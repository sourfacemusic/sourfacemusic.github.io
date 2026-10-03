/* Auth0 Universal Login. Require authenticator MFA in the Auth0 tenant. */
(async () => {
  'use strict';
  const login = document.getElementById('sfm-login');
  const logout = document.getElementById('sfm-logout');
  const status = document.getElementById('sfm-auth-status');
  if (!login || !logout || !status) return;

  const config = window.SFM_AUTH_CONFIG;
  if (!config || !config.domain || !config.clientId) {
    status.textContent = 'Sign-in is not available yet.';
    return;
  }

  let client;
  const showError = () => {
    status.textContent = 'Sign-in could not be completed. Please try again.';
  };
  const update = async () => {
    const signedIn = await client.isAuthenticated();
    login.hidden = signedIn;
    logout.hidden = !signedIn;
    login.disabled = false;
    logout.disabled = false;
    const user = signedIn ? await client.getUser() : undefined;
    status.textContent = signedIn
      ? `Signed in as ${user?.name || user?.nickname || 'a member'}.`
      : 'Sign in to your account.';
  };

  try {
    if (!window.auth0 || typeof window.auth0.createAuth0Client !== 'function') {
      throw new Error('Auth0 SDK unavailable');
    }
    const redirect = new URL(config.redirectUri);
    if (redirect.origin !== window.location.origin) {
      status.textContent = 'Sign-in is available on the official website.';
      return;
    }
    client = await window.auth0.createAuth0Client({
      domain: config.domain,
      clientId: config.clientId,
      cacheLocation: 'memory',
      authorizationParams: {
        redirect_uri: config.redirectUri,
        scope: 'openid profile'
      }
    });

    const query = new URLSearchParams(window.location.search);
    if (query.has('state') && (query.has('code') || query.has('error'))) {
      try {
        await client.handleRedirectCallback();
      } finally {
        for (const key of ['code', 'state', 'error', 'error_description']) {
          query.delete(key);
        }
        const remaining = query.toString();
        window.history.replaceState({}, document.title,
          window.location.pathname + (remaining ? `?${remaining}` : '') + window.location.hash);
      }
    }

    login.addEventListener('click', async () => {
      login.disabled = true;
      status.textContent = 'Opening secure sign-in…';
      try {
        await client.loginWithRedirect();
      } catch {
        login.disabled = false;
        showError();
      }
    });
    logout.addEventListener('click', async () => {
      logout.disabled = true;
      try {
        await client.logout({ logoutParams: { returnTo: config.redirectUri } });
      } catch {
        logout.disabled = false;
        showError();
      }
    });
    await update();
  } catch {
    showError();
    // Retry callback failures from a clean URL; never display raw provider errors.
    login.hidden = false;
    login.disabled = false;
    login.addEventListener('click', () => window.location.reload(), { once: true });
  }
})();
