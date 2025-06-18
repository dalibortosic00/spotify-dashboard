import { useState, useEffect } from "react";
import { getEnvVar } from "../env.ts";

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
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("access_token");
    const storedToken = localStorage.getItem("spotify_token");

    if (accessToken) {
      setToken(accessToken);
      localStorage.setItem("spotify_token", accessToken);
      window.history.replaceState({}, "", "/");
    } else if (storedToken) {
      setToken(storedToken);
    }
    setIsCheckingToken(false);
  }, []);

  return { token, isCheckingToken, loginUrl };
};
