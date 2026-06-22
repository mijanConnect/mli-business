import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { clearAuthToken, getAuthToken } from "../../utils/tokenService";
import { refreshAuthSession } from "../../utils/authSession";
import {
  getApiBaseUrl,
  getMediaBaseUrl,
  getRefreshPath,
} from "../../config/runtimeConfig";

const baseUrl = getApiBaseUrl();
const refreshPath = getRefreshPath();
const dashboardMode = import.meta?.env?.VITE_DASHBOARD_MODE || "shared";

const getRequestUrl = (args) =>
  typeof args === "string" ? args : args?.url || "";

const isRefreshRequest = (args) => getRequestUrl(args) === refreshPath;

const dispatchAuthEvent = (type, detail = {}) => {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(type, { detail }));
};

const emitAuthWarning = (args, status) => {
  const requestUrl = getRequestUrl(args);
  const warning = {
    mode: dashboardMode,
    status,
    url: requestUrl,
    timestamp: Date.now(),
  };

  if (import.meta?.env?.DEV) {
    console.warn("[auth] 401 warning captured", warning);
  }

  dispatchAuthEvent("auth:warning", warning);
  return warning;
};

const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  credentials: "include",
  prepareHeaders: (headers) => {
    if (headers.has("Authorization")) {
      return headers;
    }

    const token = getAuthToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const createBaseQueryWithReauth = ({ mode = dashboardMode } = {}) =>
  async (args, api, extraOptions) => {
    let result = await rawBaseQuery(args, api, extraOptions);

    if (result?.error?.status === 401 && !isRefreshRequest(args)) {
      const warning = emitAuthWarning(args, 401);
      warning.mode = mode;

      const refreshedToken = await refreshAuthSession();

      if (refreshedToken) {
        dispatchAuthEvent("auth:token-refreshed", {
          ...warning,
          refreshedAt: Date.now(),
        });

        result = await rawBaseQuery(args, api, extraOptions);
        return result;
      }

      clearAuthToken();
      dispatchAuthEvent("auth:logout", {
        ...warning,
        reason: "refresh-failed",
      });
    }

    return result;
  };

const baseQueryWithReauth = createBaseQueryWithReauth();

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Profile",
    "Customer",
    "Merchant",
    "Statistics",
    "Tier",
    "CustomerChart",
    "Promo",
    "Order",
    "Product",
    "PrivacyPolicy",
    "TermsAndConditions",
    "CustomerReport",
    "Notifications",
    "AuditLog",
    "SellManagement",
    "User",
  ],
  endpoints: () => ({}),
});

export const imageUrl = getMediaBaseUrl();