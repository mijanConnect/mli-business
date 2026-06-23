import Cookies from "js-cookie";

const RESET_TOKEN_KEY = "resetToken";
const REFRESH_TOKEN_KEY = "refreshToken";

const LEGACY_ACCESS_TOKEN_KEYS = ["token"];
const LEGACY_REFRESH_TOKEN_KEYS = ["refreshToken"];

let accessToken = null;

const isDev = () => Boolean(import.meta?.env?.DEV);

const reportStorageIssue = (operation, error) => {
  if (isDev()) {
    console.warn(`[auth] ${operation} failed`, error);
  }
};

const readItem = (key) => {
  try {
    return Cookies.get(key) || null;
  } catch (error) {
    reportStorageIssue(`read ${key}`, error);
    return null;
  }
};

const writeItem = (key, value) => {
  try {
    Cookies.set(key, value, { expires: 30, secure: window.location.protocol === "https:", sameSite: 'lax' });
  } catch (error) {
    reportStorageIssue(`write ${key}`, error);
  }
};

const removeItem = (key) => {
  try {
    Cookies.remove(key);
  } catch (error) {
    reportStorageIssue(`remove ${key}`, error);
  }
};

const removeFromStorage = (storage, keys) => {
  keys.forEach((key) => {
    try {
      storage.removeItem(key);
    } catch (error) {
      reportStorageIssue(`remove legacy ${key}`, error);
    }
  });
};

const purgeLegacySessionData = () => {
  if (typeof window === "undefined") {
    return;
  }

  removeFromStorage(sessionStorage, [
    ...LEGACY_ACCESS_TOKEN_KEYS,
  ]);

  // Clean up legacy tokens from localStorage
  removeFromStorage(localStorage, [
    ...LEGACY_ACCESS_TOKEN_KEYS,
    ...LEGACY_REFRESH_TOKEN_KEYS,
  ]);
};

const emitAuthChange = (type) => {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent("auth:changed", { detail: { type } }));
};

purgeLegacySessionData();

export function getAuthToken() {
  return accessToken;
}

export function hasInMemoryAccessToken() {
  return Boolean(accessToken);
}

export function getRefreshToken() {
  return readItem(REFRESH_TOKEN_KEY);
}

export function setAuthToken(token) {
  if (!token) {
    return;
  }

  accessToken = token;
  emitAuthChange("token-updated");
}

export function setRefreshToken(token) {
  if (!token) {
    return;
  }

  writeItem(REFRESH_TOKEN_KEY, token);
  emitAuthChange("token-updated");
}

export function setAuthTokens(accessTokenValue, refreshTokenValue) {
  setAuthToken(accessTokenValue);

  if (refreshTokenValue) {
    setRefreshToken(refreshTokenValue);
  }
}

export function getResetToken() {
  return readItem(RESET_TOKEN_KEY);
}

export function setResetToken(token) {
  if (!token) {
    return;
  }

  writeItem(RESET_TOKEN_KEY, token);
  emitAuthChange("reset-token-updated");
}

export function clearResetToken() {
  removeItem(RESET_TOKEN_KEY);
}

export function clearAuthToken() {
  accessToken = null;
  removeItem(REFRESH_TOKEN_KEY);
  purgeLegacySessionData();
  emitAuthChange("token-cleared");
}

export default {
  getAuthToken,
  hasInMemoryAccessToken,
  getRefreshToken,
  getResetToken,
  clearAuthToken,
  clearResetToken,
  setAuthToken,
  setAuthTokens,
  setRefreshToken,
  setResetToken,
};
