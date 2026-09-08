import express from 'express';
import cors from 'cors';
import session from 'express-session';
import {
  login,
  callback,
  me,
  logout,
} from './controllers/authController.js';
import {
  listWorkflows,
  getWorkflowRequirements,
  runWorkflow,
} from './controllers/workflowController.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Session configuration
app.use(session({
  secret: 'docusign-demo-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // set true in production with HTTPS
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
}));

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'api', timestamp: new Date().toISOString() });
});

// Start OAuth flow - redirect directly to Docusign
app.get('/api/auth/login', login);

// OAuth callback - exchange code for token
app.get('/api/auth/callback', callback);

// Get current user info from session
app.get('/api/auth/me', me);

// Get workflows for authenticated user
app.get('/api/workflows', listWorkflows);

// Get trigger requirements for a workflow
app.get('/api/workflows/:workflowId/requirements', getWorkflowRequirements);

// Trigger a workflow instance
app.post('/api/workflows/:workflowId/run', runWorkflow);

// Logout
app.post('/api/auth/logout', logout);

app.listen(PORT);
