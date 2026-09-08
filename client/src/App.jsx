import { useEffect, useState } from 'react';

function App() {
  const [user, setUser] = useState(null);
  const [workflows, setWorkflows] = useState({ data: [] });
  const [loading, setLoading] = useState(false);
  const [workflowsLoading, setWorkflowsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [runningWorkflowId, setRunningWorkflowId] = useState(null);
  const [workflowEmbedUrl, setWorkflowEmbedUrl] = useState(null);
  const [workflowRunInfo, setWorkflowRunInfo] = useState(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [requirementsLoading, setRequirementsLoading] = useState(false);
  const [requiredTriggerInputs, setRequiredTriggerInputs] = useState([]);
  const [triggerInputs, setTriggerInputs] = useState({});

  useEffect(() => {
    // Check if we're in auth-callback mode (tokens in URL)
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const expiresIn = params.get('expires_in');

    if (accessToken) {
      // We've just returned from Docusign OAuth redirect
      handleAuthCallbackUrl(accessToken, refreshToken, expiresIn);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      // Check if already logged in
      checkAuth();
    }
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        if (data.logged) {
          setUser(data.user);
          fetchWorkflows();
        }
      }
    } catch {
      // Not authenticated, that's fine
    }
  };

  const fetchWorkflows = async () => {
    setWorkflowsLoading(true);
    try {
      const response = await fetch('/api/workflows', { credentials: 'include' });

      if (response.ok) {
        const data = await response.json();
        setWorkflows(data || { data: [] });
      } else {
        const errorData = await response.json();
        setError(`Failed to fetch workflows: ${errorData.error || 'Unknown error'}`);
        setWorkflows({ data: [] });
      }
    } catch (err) {
      setError('Error fetching workflows: ' + err.message);
      setWorkflows({ data: [] });
    } finally {
      setWorkflowsLoading(false);
    }
  };

  const handleAuthCallbackUrl = async (accessToken, refreshToken, expiresIn) => {
    setLoading(true);
    try {
      // Store tokens from URL (backend session is already set via cookie)
      sessionStorage.setItem('accessToken', accessToken);
      sessionStorage.setItem('refreshToken', refreshToken);
      sessionStorage.setItem('expiresIn', expiresIn);

      // Now fetch user data from session
      const response = await fetch('/api/auth/me', { credentials: 'include' });

      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setUser(data.user);
          // Fetch workflows after user is set
          fetchWorkflows();
        } else {
          setError('Authentication successful but user info unavailable');
        }
      } else {
        setError('Failed to authenticate');
      }
    } catch (err) {
      setError('Error during authentication: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    // Redirect to /api/auth/login which will redirect to Docusign
    window.location.href = '/api/auth/login';
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // Logout endpoint failed, continue anyway
    }
    setUser(null);
    setWorkflows({ data: [] });
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('expiresIn');
    setWorkflowEmbedUrl(null);
    setWorkflowRunInfo(null);
    setSelectedWorkflow(null);
    setRequiredTriggerInputs([]);
    setTriggerInputs({});
  };

  const extractRequiredTriggerInputKeys = (requirements) => {
    if (!requirements || typeof requirements !== 'object') {
      return [];
    }

    if (Array.isArray(requirements.trigger_input_schema)) {
      return requirements.trigger_input_schema
        .map((item) => item?.field_name || item?.fieldName || item?.name || item?.key)
        .filter(Boolean);
    }

    if (Array.isArray(requirements.triggerInputSchema)) {
      const hasObjects = requirements.triggerInputSchema.some(
        (item) => item && typeof item === 'object'
      );

      if (hasObjects) {
        return requirements.triggerInputSchema
          .map((item) => item?.field_name || item?.fieldName || item?.name || item?.key)
          .filter(Boolean);
      }

      return requirements.triggerInputSchema.filter((item) => typeof item === 'string');
    }

    if (Array.isArray(requirements.requiredTriggerInputs)) {
      return requirements.requiredTriggerInputs
        .map((item) => item?.field_name || item?.fieldName || item?.name || item?.key)
        .filter(Boolean);
    }

    if (Array.isArray(requirements.triggerInputSchema?.required)) {
      return requirements.triggerInputSchema.required;
    }

    if (Array.isArray(requirements.jsonSchema?.required)) {
      return requirements.jsonSchema.required;
    }

    return [];
  };

  const handleSelectWorkflow = async (workflow) => {
    const workflowId = workflow?.id;
    if (!workflowId) {
      setError('Workflow cannot be selected because it has no ID.');
      return;
    }

    setSelectedWorkflow(workflow);
    setWorkflowEmbedUrl(null);
    setWorkflowRunInfo(null);
    setRequiredTriggerInputs([]);
    setTriggerInputs({});
    setError(null);
    setRequirementsLoading(true);

    try {
      const response = await fetch(`/api/workflows/${workflowId}/requirements`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch workflow requirements');
      }

      const requirements = data.triggerRequirements || {};
      const requiredKeys = extractRequiredTriggerInputKeys(requirements);
      setRequiredTriggerInputs(requiredKeys);
      setTriggerInputs(Object.fromEntries(requiredKeys.map((key) => [key, ''])));
    } catch (err) {
      setError('Error fetching workflow requirements: ' + err.message);
    } finally {
      setRequirementsLoading(false);
    }
  };

  const handleRunWorkflow = async () => {
    const workflowId = selectedWorkflow?.id;
    if (!workflowId) {
      setError('No workflow selected.');
      return;
    }

    const missing = requiredTriggerInputs.filter(
      (key) => !String(triggerInputs[key] || '').trim()
    );

    if (missing.length > 0) {
      setError('Please fill required fields: ' + missing.join(', '));
      return;
    }

    setRunningWorkflowId(workflowId);
    setError(null);

    try {
      const response = await fetch(`/api/workflows/${workflowId}/run`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ triggerInputs }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (Array.isArray(data.requiredTriggerInputs)) {
          setRequiredTriggerInputs(data.requiredTriggerInputs);
        }
        throw new Error(data.error || 'Failed to run workflow');
      }

      setWorkflowRunInfo(data);
      setWorkflowEmbedUrl(data.embedUrl || null);
    } catch (err) {
      setError('Error running workflow: ' + err.message);
      setWorkflowEmbedUrl(null);
      setWorkflowRunInfo(null);
    } finally {
      setRunningWorkflowId(null);
    }
  };

  const handleBackToWorkflows = () => {
    setSelectedWorkflow(null);
    setRunningWorkflowId(null);
    setWorkflowEmbedUrl(null);
    setWorkflowRunInfo(null);
    setRequiredTriggerInputs([]);
    setTriggerInputs({});
  };

  const activeWorkflows = (workflows?.data || []).filter(
    (workflow) => String(workflow.status || '').toLowerCase() === 'active'
  );

  return (
    <main className="page">
      {user && (
        <header className="user-toolbar" aria-label="User controls">
          <span className="user-welcome">
            Welcome {user.name || user.email || user.sub || 'Docusign User'}
          </span>
          <button onClick={handleLogout} className="btn btn-secondary">
            Log out
          </button>
        </header>
      )}

      <section className="hero" aria-label="Docusign branded hero">
        <p className="eyebrow">Docusign Builder Lab</p>
        <h1>In-App Workflow Integration</h1>
      </section>

      {!user && (
        <section className="auth-card">
          {loading && <p className="loading">Processing authentication...</p>}
          {error && <p className="error">{error}</p>}

          <div>
            <h2>Sign in to Docusign</h2>
            <p>Click below to log in with your Docusign account.</p>
            <button onClick={handleLogin} disabled={loading} className="btn btn-primary">
              {loading ? 'Redirecting to Docusign...' : 'Log in with Docusign'}
            </button>
          </div>
        </section>
      )}

      {user && (
        <section className="workflows-card">
          <h2>Available Workflows</h2>
          {error && error.toLowerCase().includes('workflow') && <p className="error">{error}</p>}
          {workflowsLoading ? (
            <p className="loading">Loading workflows...</p>
          ) : selectedWorkflow ? (
            <div className="workflow-focus" style={{ display: 'grid', gap: '1rem' }}>
              <button onClick={handleBackToWorkflows} className="btn btn-secondary" style={{ width: 'fit-content' }}>
                Back to Workflows
              </button>

              <div className="workflow-item">
                <h3>{selectedWorkflow.name}</h3>
              </div>

              {requirementsLoading ? (
                <p className="loading">Loading trigger requirements...</p>
              ) : (
                <div className="workflow-item">
                  <h3>Required Inputs</h3>
                  {requiredTriggerInputs.length === 0 ? (
                    <p className="empty-state">No required trigger inputs detected for this workflow.</p>
                  ) : (
                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                      {requiredTriggerInputs.map((key) => (
                        <label key={key} style={{ display: 'grid', gap: '0.3rem' }}>
                          <span>{key}</span>
                          <input
                            type="text"
                            value={triggerInputs[key] || ''}
                            onChange={(e) =>
                              setTriggerInputs((prev) => ({
                                ...prev,
                                [key]: e.target.value,
                              }))
                            }
                            style={{
                              padding: '0.6rem',
                              borderRadius: '8px',
                              border: '1px solid rgba(76,0,255,0.2)',
                            }}
                          />
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={handleRunWorkflow}
                disabled={requirementsLoading || runningWorkflowId === selectedWorkflow.id}
                className="btn btn-primary"
                style={{ width: 'fit-content' }}
              >
                {runningWorkflowId === selectedWorkflow.id ? 'Starting...' : 'Run Workflow'}
              </button>

              {runningWorkflowId === selectedWorkflow.id && (
                <p className="loading">Starting workflow...</p>
              )}

              {workflowRunInfo && (
                <div className="workflow-run-result">
                  <h3>Workflow Started</h3>
                  <p>
                    Workflow ID: <code>{workflowRunInfo.workflowId}</code>
                  </p>
                  {!workflowEmbedUrl && !runningWorkflowId && (
                    <p className="empty-state">
                      Workflow started, but no embed URL was returned by the API response.
                    </p>
                  )}
                </div>
              )}

              {workflowEmbedUrl && (
                <div className="workflow-embed">
                  <h3>Workflow Embed</h3>
                  <iframe
                    title="workflow-embed"
                    src={workflowEmbedUrl}
                    style={{ width: '100%', minHeight: '520px', border: '1px solid rgba(76,0,255,0.2)', borderRadius: '12px' }}
                  />
                </div>
              )}
            </div>
          ) : activeWorkflows.length > 0 ? (
            <div className="workflows-list">
              {activeWorkflows.map((workflow) => (
                <div key={workflow.id} className="workflow-item workflow-list-item">
                  <h3>{workflow.name}</h3>
                  <button
                    onClick={() => handleSelectWorkflow(workflow)}
                    disabled={runningWorkflowId === workflow.id}
                    className="btn btn-primary"
                  >
                    Open Workflow
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">No active workflows found in your account.</p>
          )}
        </section>
      )}
    </main>
  );
}

export default App;
