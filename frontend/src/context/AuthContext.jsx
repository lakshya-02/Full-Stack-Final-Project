import { createContext, useContext, useEffect, useState } from "react";

import { apiRequest } from "../services/api";

const AuthContext = createContext(null);
const storageKey = "helpdeskAuth";
const emptyAuthState = { token: "", user: null };

const readStoredAuth = () => {
  try {
    const stored = localStorage.getItem(storageKey);

    if (!stored) {
      return emptyAuthState;
    }

    const parsed = JSON.parse(stored);

    if (!parsed?.token || !parsed?.user) {
      localStorage.removeItem(storageKey);
      return emptyAuthState;
    }

    return parsed;
  } catch (error) {
    localStorage.removeItem(storageKey);
    return emptyAuthState;
  }
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(readStoredAuth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateSession = async () => {
      if (!auth.token) {
        setLoading(false);
        return;
      }

      try {
        const data = await apiRequest("/auth/me", {}, auth.token);
        setAuth((current) => ({ ...current, user: data.user }));
      } catch (error) {
        localStorage.removeItem(storageKey);
        setAuth(emptyAuthState);
      } finally {
        setLoading(false);
      }
    };

    validateSession();
  }, [auth.token]);

  const saveAuth = (value) => {
    localStorage.setItem(storageKey, JSON.stringify(value));
    setAuth(value);
  };

  const login = (payload) => {
    saveAuth(payload);
  };

  const logout = () => {
    localStorage.removeItem(storageKey);
    setAuth(emptyAuthState);
  };

  return (
    <AuthContext.Provider
      value={{
        token: auth.token,
        user: auth.user,
        isAuthenticated: Boolean(auth.token),
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
