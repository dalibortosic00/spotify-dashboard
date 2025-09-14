import { useState, useEffect } from "react";
import { getEnvVar } from "../env.ts";
import { getStoredAuth } from "../utils/auth.ts";

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
    const auth = getStoredAuth();
    setToken(auth ? auth.token : null);
    setIsCheckingToken(false);
  }, []);

  return { token, isCheckingToken, loginUrl };
};
