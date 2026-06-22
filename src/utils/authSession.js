import {
  getApiBaseUrl,
  getLogoutPath,
  getRefreshPath,
} from "../config/runtimeConfig";

import { clearAuthToken, getRefreshToken, setAuthTokens } from "./tokenService";

const extractAccessToken = (payload) =>
  payload?.data?.accessToken ||
  payload?.data?.token ||
  payload?.accessToken ||
  payload?.token ||
  null;

const extractRefreshToken = (payload) =>
  payload?.data?.refreshToken || payload?.refreshToken || null;

export async function refreshAuthSession() {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    return null;
  }

  try {
    const response = await fetch(`${getApiBaseUrl()}${getRefreshPath()}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: refreshToken,
      },
      body: JSON.stringify({
        refreshToken,
      }),
    });

    if (!response.ok) {
      return null;
    }

    const payload = await response.json();

    const nextAccessToken = extractAccessToken(payload);

    if (!nextAccessToken) {
      return null;
    }

    const nextRefreshToken = extractRefreshToken(payload) || refreshToken;

    setAuthTokens(nextAccessToken, nextRefreshToken);

    return nextAccessToken;
  } catch (error) {
    if (import.meta?.env?.DEV) {
      console.warn("[auth] refresh session failed", error);
    }

    return null;
  }
}

export async function logoutAuthSession() {
  const refreshToken = getRefreshToken();

  try {
    await fetch(`${getApiBaseUrl()}${getLogoutPath()}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: refreshToken,
      },
    });
  } catch (error) {
    if (import.meta?.env?.DEV) {
      console.warn("[auth] logout request failed", error);
    }
  } finally {
    clearAuthToken();
  }
}
