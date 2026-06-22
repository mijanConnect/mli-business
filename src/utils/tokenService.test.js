import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getAuthToken,
  hasInMemoryAccessToken,
  getRefreshToken,
  setAuthToken,
  setRefreshToken,
  setAuthTokens,
  getResetToken,
  setResetToken,
  clearResetToken,
  clearAuthToken,
} from "./tokenService";

describe("tokenService", () => {
  beforeEach(() => {
    // Clear storage and reset mocks
    sessionStorage.clear();
    localStorage.clear();
    // Reset internal accessToken variable by calling clearAuthToken
    clearAuthToken();
    vi.restoreAllMocks();
  });

  describe("Auth Token (In-Memory)", () => {
    it("should initially have no in-memory access token", () => {
      expect(getAuthToken()).toBeNull();
      expect(hasInMemoryAccessToken()).toBe(false);
    });

    it("should set and get in-memory access token", () => {
      const dispatchSpy = vi.spyOn(window, "dispatchEvent");
      setAuthToken("test-access-token");
      expect(getAuthToken()).toBe("test-access-token");
      expect(hasInMemoryAccessToken()).toBe(true);
      expect(dispatchSpy).toHaveBeenCalled();
      
      const event = dispatchSpy.mock.calls[0][0];
      expect(event.type).toBe("auth:changed");
      expect(event.detail).toEqual({ type: "token-updated" });
    });

    it("should not set in-memory access token if it is falsy", () => {
      const dispatchSpy = vi.spyOn(window, "dispatchEvent");
      setAuthToken(null);
      expect(getAuthToken()).toBeNull();
      expect(dispatchSpy).not.toHaveBeenCalled();
    });
  });

  describe("Refresh Token (Session Storage)", () => {
    it("should return null if refresh token is not set", () => {
      expect(getRefreshToken()).toBeNull();
    });

    it("should set and get refresh token from sessionStorage", () => {
      const dispatchSpy = vi.spyOn(window, "dispatchEvent");
      setRefreshToken("test-refresh-token");
      expect(getRefreshToken()).toBe("test-refresh-token");
      expect(sessionStorage.getItem("refreshToken")).toBe("test-refresh-token");
      
      const event = dispatchSpy.mock.calls[0][0];
      expect(event.type).toBe("auth:changed");
      expect(event.detail).toEqual({ type: "token-updated" });
    });

    it("should not set refresh token if it is falsy", () => {
      const dispatchSpy = vi.spyOn(window, "dispatchEvent");
      setRefreshToken("");
      expect(getRefreshToken()).toBeNull();
      expect(dispatchSpy).not.toHaveBeenCalled();
    });
  });

  describe("Set Auth Tokens", () => {
    it("should set both access and refresh tokens", () => {
      setAuthTokens("access-123", "refresh-123");
      expect(getAuthToken()).toBe("access-123");
      expect(getRefreshToken()).toBe("refresh-123");
    });

    it("should not set refresh token if not provided", () => {
      setAuthTokens("access-only", null);
      expect(getAuthToken()).toBe("access-only");
      expect(getRefreshToken()).toBeNull();
    });
  });

  describe("Reset Token (Session Storage)", () => {
    it("should return null if reset token is not set", () => {
      expect(getResetToken()).toBeNull();
    });

    it("should set and get reset token", () => {
      const dispatchSpy = vi.spyOn(window, "dispatchEvent");
      setResetToken("reset-123");
      expect(getResetToken()).toBe("reset-123");
      expect(sessionStorage.getItem("resetToken")).toBe("reset-123");

      const event = dispatchSpy.mock.calls[0][0];
      expect(event.type).toBe("auth:changed");
      expect(event.detail).toEqual({ type: "reset-token-updated" });
    });

    it("should not set reset token if it is falsy", () => {
      const dispatchSpy = vi.spyOn(window, "dispatchEvent");
      setResetToken("");
      expect(getResetToken()).toBeNull();
      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it("should clear reset token", () => {
      setResetToken("reset-123");
      clearResetToken();
      expect(getResetToken()).toBeNull();
      expect(sessionStorage.getItem("resetToken")).toBeNull();
    });
  });

  describe("Clear Auth Token", () => {
    it("should clear both tokens and dispatch token-cleared event", () => {
      setAuthTokens("access-123", "refresh-123");
      const dispatchSpy = vi.spyOn(window, "dispatchEvent");
      
      clearAuthToken();
      
      expect(getAuthToken()).toBeNull();
      expect(getRefreshToken()).toBeNull();
      
      const event = dispatchSpy.mock.calls[0][0];
      expect(event.type).toBe("auth:changed");
      expect(event.detail).toEqual({ type: "token-cleared" });
    });
  });

  describe("Legacy Tokens Cleanup", () => {
    it("should remove legacy keys from localStorage and sessionStorage on initialization/cleanup", () => {
      localStorage.setItem("token", "legacy-access");
      localStorage.setItem("refreshToken", "legacy-refresh");
      sessionStorage.setItem("token", "legacy-session-access");

      clearAuthToken();

      expect(localStorage.getItem("token")).toBeNull();
      expect(localStorage.getItem("refreshToken")).toBeNull();
      expect(sessionStorage.getItem("token")).toBeNull();
    });
  });
});
