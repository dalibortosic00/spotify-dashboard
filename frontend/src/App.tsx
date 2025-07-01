import { useState, useEffect } from "react";
import API from "./api.ts";
import type { TopItems } from "./types.ts";
import FactCard from "./components/FactCard.tsx";
import TopItemsCard from "./components/TopItemsCard.tsx";
import { useAuth } from "./hooks/useAuth.ts";

function App() {
  const { token, isCheckingToken, loginUrl } = useAuth();
  const [topItems, setTopItems] = useState<TopItems | null>(null);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = () => {
    window.location.href = loginUrl;
  };

  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        setIsFetchingData(true);
        setError(null);
        try {
          const response = await API.get("/me/top", { params: { token } });
          setTopItems(response.data as TopItems);
        } catch (err: unknown) {
          console.error("Error fetching data:", err);
          setError(
            "Failed to load Spotify data. Your session might have expired. Please try logging in again.",
          );
          localStorage.removeItem("spotify_token");
        } finally {
          setIsFetchingData(false);
        }
      }
    };

    if (token && !isCheckingToken) {
      void fetchData();
    }
  }, [token, isCheckingToken]);

  if (isCheckingToken) {
    return null;
  }

  if (!token) {
    return (
      <button type="button" onClick={handleLogin}>
        Login with Spotify
      </button>
    );
  }

  if (isFetchingData) {
    return <p>Loading your Spotify data...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (topItems) {
    const topArtist = topItems.top_artists[0];
    const topTrack = topItems.top_tracks[0];

    return (
      <div className="dashboard-grid">
        <FactCard
          title="Your Top Artist"
          item={topArtist}
          icon={
            <span role="img" aria-label="star">
              ⭐
            </span>
          }
        />

        <FactCard
          title="Your Top Track"
          item={topTrack}
          icon={
            <span role="img" aria-label="music note">
              🎵
            </span>
          }
        />

        {topItems.top_artists.length > 1 && (
          <TopItemsCard
            title="Your Top Artists"
            items={topItems.top_artists.slice(0, 10)}
          />
        )}

        {topItems.top_tracks.length > 1 && (
          <TopItemsCard
            title="Your Top Tracks"
            items={topItems.top_tracks.slice(0, 10)}
          />
        )}
      </div>
    );
  }

  // Fallback if topItems is null but no specific error or loading state
  return <p>No data available. Please log in to see your Spotify Dashboard.</p>;
}

export default App;
