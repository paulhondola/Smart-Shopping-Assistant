import { useCallback, useEffect, useState, type ReactNode } from "react";
import { authApi } from "@/api/client/AuthApiClient";
import { tokenStore } from "@/api/base/http";
import { toUser } from "@/shared/types/User";
import type { User } from "@/shared/types/User";
import { AuthContext } from "./auth-context";
import { showToast } from "@/lib/toast";

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    tokenStore.clear();
    setUser(null);
    showToast("Signed out", "info");
  }, []);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    const token = tokenStore.get();
    if (!token) {
      setIsLoading(false);
      return;
    }
    authApi
      .me()
      .then((dto) => setUser(toUser(dto)))
      .catch(() => tokenStore.clear())
      .finally(() => setIsLoading(false));
  }, []);

  // Handle 401s fired from the Axios interceptor
  useEffect(() => {
    window.addEventListener("auth:logout", logout);
    return () => window.removeEventListener("auth:logout", logout);
  }, [logout]);

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      tokenStore.set(response.token);
      const u = toUser(response.user);
      setUser(u);
      showToast(`Welcome back, ${u.displayName}`, "success");
    } catch (err) {
      showToast("Authentication failed", "error");
      throw err;
    }
  };

  const register = async (
    email: string,
    password: string,
    displayName: string,
  ) => {
    try {
      const response = await authApi.register({ email, password, displayName });
      tokenStore.set(response.token);
      setUser(toUser(response.user));
      showToast("Account created", "success");
    } catch (err) {
      showToast("Authentication failed", "error");
      throw err;
    }
  };

  const updateProfile = async (displayName: string) => {
    const dto = await authApi.updateProfile({ displayName });
    setUser(toUser(dto));
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
