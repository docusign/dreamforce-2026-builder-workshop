import {
  getWorkflowDefinitions,
  getWorkflowTriggerRequirements,
  triggerWorkflowInstance,
} from '../services/workflowService.js';
import { resolveAccountId } from '../services/authService.js';

const getSessionArgs = (req, workflowId = null) => {
  const accessToken = req.session?.accessToken;
  const accountId = resolveAccountId(req.session?.user);

  return {
    accessToken,
    accountId,
    workflowId,
  };
};

const handleErrorResponse = (error, res) => {
  const statusCode = error?.statusCode || error?.response?.statusCode || 500;
  const errorMessage =
    error?.message || error?.response?.body?.message || 'Unexpected workflow error';

  if (statusCode === 403) {
    return res.status(403).json({
      error: errorMessage,
      errorInfo: 'Contact Support to enable this feature',
      ...(error?.context || {}),
    });
  }

  return res.status(statusCode).json({
    error: errorMessage,
    ...(error?.context || {}),
  });
};

export const listWorkflows = async (req, res) => {
  if (!req.session?.accessToken) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const args = getSessionArgs(req);
    if (!args.accountId) {
      return res.status(400).json({ error: 'Account ID not found in user info' });
    }

    const results = await getWorkflowDefinitions(args);
    return res.status(200).json(results);
  } catch (error) {
    return handleErrorResponse(error, res);
  }
};

export const runWorkflow = async (req, res) => {
  if (!req.session?.accessToken) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const workflowId = req.params.workflowId;
  if (!workflowId) {
    return res.status(400).json({ error: 'Workflow ID is required' });
  }

  try {
    const args = getSessionArgs(req, workflowId);
    if (!args.accountId) {
      return res.status(400).json({ error: 'Account ID not found in user info' });
    }

    const result = await triggerWorkflowInstance(args, req.body || {});

    return res.status(200).json({
      workflowId,
      accountId: args.accountId,
      instance: result,
      instanceUrl: result.instanceUrl,
      embedUrl: result.instanceUrl,
    });
  } catch (error) {
    return handleErrorResponse(error, res);
  }
};

export const getWorkflowRequirements = async (req, res) => {
  if (!req.session?.accessToken) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const workflowId = req.params.workflowId;
  if (!workflowId) {
    return res.status(400).json({ error: 'Workflow ID is required' });
  }

  try {
    const args = getSessionArgs(req, workflowId);
    if (!args.accountId) {
      return res.status(400).json({ error: 'Account ID not found in user info' });
    }

    const results = await getWorkflowTriggerRequirements(args);
    return res.status(200).json({
      workflowId,
      accountId: args.accountId,
      triggerRequirements: results,
    });
  } catch (error) {
    return handleErrorResponse(error, res);
  }
};
