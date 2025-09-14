export interface AuthStorage {
  token: string;
  loginTime: number;
}

export const getStoredAuth = (): AuthStorage | null => {
  const urlParams = new URLSearchParams(window.location.search);
  const accessToken = urlParams.get("access_token");
  const storedAuth = localStorage.getItem("spotify_auth");

  if (accessToken) {
    const auth: AuthStorage = {
      token: accessToken,
      loginTime: Date.now(),
    };
    localStorage.setItem("spotify_auth", JSON.stringify(auth));
    window.history.replaceState({}, "", "/");
    return auth;
  }

  if (storedAuth) {
    const auth = JSON.parse(storedAuth) as AuthStorage;
    const isExpired = Date.now() - auth.loginTime > 3600000; // 1 hour
    if (isExpired) {
      localStorage.removeItem("spotify_auth");
      return null;
    }
    return auth;
  }

  return null;
};
