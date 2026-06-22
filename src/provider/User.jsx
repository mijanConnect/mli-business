import React, { useContext, useEffect, useState } from "react";
import { useProfileQuery } from "../redux/apiSlices/authSlice";
import { getAuthToken } from "../utils/tokenService";
import { refreshAuthSession } from "../utils/authSession";

export const UserContext = React.createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    typeof window !== "undefined" ? getAuthToken() : null,
  );
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const activeToken = token || getAuthToken();

  useEffect(() => {
    let cancelled = false;

    const bootstrapSession = async () => {
      try {
        if (!getAuthToken()) {
          await refreshAuthSession();
        }
      } finally {
        if (!cancelled) {
          setToken(getAuthToken());
          setIsBootstrapping(false);
        }
      }
    };

    bootstrapSession();

    const handleAuthChange = () => {
      const currentToken = getAuthToken();
      setToken(currentToken);

      if (!currentToken) {
        setUser(null);
      }
    };

    window.addEventListener("auth:changed", handleAuthChange);
    window.addEventListener("auth:logout", handleAuthChange);

    return () => {
      cancelled = true;
      window.removeEventListener("auth:changed", handleAuthChange);
      window.removeEventListener("auth:logout", handleAuthChange);
    };
  }, []);

  const {
    data: profile,
    isLoading,
    isError,
    refetch,
  } = useProfileQuery(undefined, {
    skip: isBootstrapping || !activeToken,
  });

  useEffect(() => {
    if (profile && !isLoading && !isError) {
      setUser(profile);
    } else if (isError) {
      setUser(null);
    }
  }, [profile, isLoading, isError]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        token: activeToken,
        isLoading,
        isBootstrapping,
        refetch,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
