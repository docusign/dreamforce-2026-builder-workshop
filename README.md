# Docusign Builder Lab: Build a Docusign + Salesforce Agreement Workflow

Starter code for an example client app that embeds a Docusign workflow.

It includes:
- `server/`: Node + Express backend with Docusign OAuth and Workflow Builder API integration for workflow management.
- `client/`: React + Vite frontend.

## Prerequisites

- Node.js 20+
- Npm 10+
- Free [Docusign developer account](https://www.docusign.com/developers/sandbox)

## Setup

### 1. Install dependencies

```bash
npm install
npm install --prefix server
npm install --prefix client
```

### Configure Docusign integration details
1. Copy the config template:
   ```bash
   cp config.example.json config.json
   ```
2. Log in to your Docusign Developer Account and navigate to the [Apps and Keys page](https://admindemo.docusign.com/authenticate?goTo=appsAndKeys).
3. Create a new application and copy the Integration Key. Paste the value in the config.json as {INTEGRATION_KEY}.
4. Add the following Redirect URI for your app:
  * http://localhost:5000/api/auth/callback
5. Click **ADD SECRET KEY** and save the generated key — this is your {SecretKey}.
6. Review that your `config.json` has all the required Docusign credentials:
   - **Integration Key (IK)**: Found in your Docusign app settings
   - **Secret Key**: Also in your app settings
   - **Redirect URI**: Set to `http://localhost:5000/api/auth/callback` for local development
   - **Environment**: Use `demo` for Docusign sandbox, `production` for live

   Example:
   ```json
   {
     "docusign": {
       "integrationKey": "YOUR_INTEGRATION_KEY_HERE",
       "secretKey": "YOUR_SECRET_KEY_HERE",
       "redirectUri": "http://localhost:5000/api/auth/callback",
       "environment": "demo"
     }
   }
   ```

> **Note:** `config.json` is gitignored and should never be committed.

## Run in development

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

Server restarts automatically on file changes via nodemon.

### Authentication Flow

1. Click "Log in with Docusign" button on the homepage
2. You'll be redirected to Docusign's login page
3. After authentication, you're redirected back with an authorization code
4. The app exchanges the code for an access token (server-side, secure)
5. User info is displayed on the page

**Scopes requested:**
- `aow_manage` - Required for Workflow Builder API
- `signature` - Required for eSignature & Workflow Builder API
- `extended` - Ensures 30-day refresh token lifetime

## Build frontend

```bash
npm run build
```

Output: `client/dist/`

## Production start

```bash
npm run start
```

Runs just the Express server (frontend should be served separately).

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/auth/login` - Returns Docusign OAuth authorization URL
- `GET /api/auth/callback` - OAuth callback handler (exchanges code for token)

## Project Structure

```
.
├── client/              # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx      # Main component with OAuth flow
│   │   ├── App.css      # Docusign branded styles
│   │   ├── main.jsx
│   │   └── ...
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── server/              # Express backend
│   ├── index.js         # Main server & API routes
│   ├── controllers/     # Route handlers
│   ├── services/        # Docusign auth/workflow services
│   └── package.json
├── config.example.json  # OAuth credentials template
├── package.json         # Root workspace config
└── README.md
```

## Notes

- This starter uses the `@docusign/iam-sdk` (beta) for OAuth and user management
- The Authorization Code Grant (ACG) flow is used for user authentication
- Access tokens are stored in `sessionStorage` (upgrade to secure HttpOnly cookies in production)
- The app includes Docusign's official brand colors and typography
