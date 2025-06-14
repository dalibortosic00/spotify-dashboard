import { useState, useEffect } from "react";
import "./App.css";
import API from "./api";
import type { TopItems } from "./types";
import { getEnvVar } from "./env";

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [topItems, setTopItems] = useState<TopItems | null>(null);

  const handleLogin = () => {
    window.location.href = `${getEnvVar("VITE_API_BASE_URL")}/login`;
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("access_token");

    if (accessToken) {
      setToken(accessToken);
      localStorage.setItem("spotify_token", accessToken);
      window.history.replaceState({}, "", "/");
    } else {
      const storedToken = localStorage.getItem("spotify_token");
      if (storedToken) setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      API.get("/me/top", { params: { token } })
        .then((response) => {
          setTopItems(response.data as TopItems);
        })
        .catch((error: unknown) => {
          console.error("Error fetching top items:", error);
          setTopItems(null);
        });
    }
  }, [token]);

  return (
    <div>
      {token ? (
        <>
          {topItems ? (
            <div>
              <h2>Top Artists</h2>
              <ul>
                {topItems.top_artists.map((artist) => (
                  <li key={artist.id}>{artist.name}</li>
                ))}
              </ul>
              <h2>Top Tracks</h2>
              <ul>
                {topItems.top_tracks.map((track) => (
                  <li key={track.id}>{track.name}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p>Loading your top items...</p>
          )}
        </>
      ) : (
        <button type="button" onClick={handleLogin}>
          Login with Spotify
        </button>
      )}
    </div>
  );
}

export default App;
