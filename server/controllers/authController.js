import {
  getAuthorizationUrl,
  exchangeCodeForToken,
  getUserInfo,
} from '../services/authService.js';

export const login = (_req, res) => {
  const authUrl = getAuthorizationUrl();
  res.redirect(authUrl);
};

export const callback = async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).json({ error: 'Authorization code not provided' });
  }

  try {
    const tokenData = await exchangeCodeForToken(code);

    if (!tokenData.success) {
      return res.status(400).json({ error: tokenData.error });
    }

    const userData = await getUserInfo(tokenData.accessToken);

    req.session.accessToken = tokenData.accessToken;
    req.session.refreshToken = tokenData.refreshToken;
    req.session.expiresIn = Date.now() + tokenData.expiresIn * 1000;
    req.session.user = userData.success ? userData.user : null;
    req.session.authType = 'Code Grant';

    req.session.save((err) => {
      if (err) {
        return res.status(500).json({ error: 'Session save failed' });
      }

      const redirectUrl = `http://localhost:5173/auth-callback?access_token=${encodeURIComponent(
        tokenData.accessToken
      )}&refresh_token=${encodeURIComponent(tokenData.refreshToken)}&expires_in=${tokenData.expiresIn}`;

      res.redirect(redirectUrl);
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed: ' + error.message });
  }
};

export const me = (req, res) => {
  if (!req.session.accessToken) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const isTokenValid = req.session.expiresIn && Date.now() < req.session.expiresIn;

  res.json({
    logged: isTokenValid,
    authType: req.session.authType || null,
    accessToken: req.session.accessToken,
    refreshToken: req.session.refreshToken,
    user: req.session.user,
  });
};

export const logout = (req, res) => {
  req.session.accessToken = null;
  req.session.refreshToken = null;
  req.session.expiresIn = null;
  req.session.authType = null;
  req.session.user = null;

  req.session.save((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout save failed' });
    }

    res.json({ success: true });
  });
};
