import { IamClient } from '@docusign/iam-sdk';
import * as iam from '@docusign/iam-sdk';
import { getConfig } from './configService.js';

const iamClient = new IamClient();

export const getAuthorizationUrl = () => {
  const config = getConfig();

  try {
    return iam.AuthUtils.createAuthorizationUrl({
      clientId: config.docusign.integrationKey,
      scopes: ['aow_manage', 'signature', 'extended'],
      redirectUri: config.docusign.redirectUri,
      type: 'code',
      state:
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15),
    });
  } catch {
    throw new Error('Authorization URL generation failed');
  }
};

export const exchangeCodeForToken = async (code) => {
  const config = getConfig();

  try {
    const result = await iamClient.auth.getTokenFromConfidentialAuthCode(
      {
        clientId: config.docusign.integrationKey,
        secretKey: config.docusign.secretKey,
      },
      { code }
    );

    return {
      success: true,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      expiresIn: result.expiresIn,
      tokenType: result.tokenType,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to exchange authorization code',
    };
  }
};

export const getUserInfo = async (accessToken) => {
  try {
    const client = new IamClient({ accessToken });
    const userInfo = await client.auth.getUserInfo();

    return {
      success: true,
      user: userInfo,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to fetch user info',
    };
  }
};

export const resolveAccountId = (user) => {
  const config = getConfig();
  const allAccounts = user?.accounts || [];

  if (config.docusign.targetAccountId) {
    const found = allAccounts.find((account) => account.accountId === config.docusign.targetAccountId);
    if (found) {
      return config.docusign.targetAccountId;
    }
  }

  return allAccounts[0]?.accountId || null;
};
