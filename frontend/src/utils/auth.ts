export const getStoredToken = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  const accessToken = urlParams.get("access_token");
  const storedToken = localStorage.getItem("spotify_token");

  if (accessToken) {
    localStorage.setItem("spotify_token", accessToken);
    window.history.replaceState({}, "", "/");
    return accessToken;
  }

  return storedToken;
};
