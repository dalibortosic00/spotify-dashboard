import { useState, useEffect } from "react";
import { getEnvVar } from "../env.ts";
import { getStoredToken } from "../utils/auth.ts";

interface AuthState {
  token: string | null;
  isCheckingToken: boolean;
  loginUrl: string;
}

export const useAuth = (): AuthState => {
  const [token, setToken] = useState<string | null>(null);
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  const loginUrl = `${getEnvVar("VITE_API_BASE_URL")}/login`;

  useEffect(() => {
    const token = getStoredToken();
    setToken(token);
    setIsCheckingToken(false);
  }, []);

  return { token, isCheckingToken, loginUrl };
};
