import { useState, useEffect } from "react";
import API from "./api.ts";
import type { TopItems } from "./types.ts";
import FactCard from "./components/FactCard.tsx";
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

  const topArtist = topItems?.top_artists[0];
  const topTrack = topItems?.top_tracks[0];

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
    return (
      <div className="dashboard-grid">
        {topArtist && (
          <FactCard
            title="Your Top Artist"
            value={topArtist.name}
            description="You couldn't get enough of them this year!"
            icon={
              <span role="img" aria-label="star">
                ⭐
              </span>
            }
            imageUrl={
              topArtist.images && topArtist.images.length > 0
                ? topArtist.images[0].url
                : undefined
            }
            imageAlt={topArtist.name}
          />
        )}

        {topTrack && (
          <FactCard
            title="Your Top Track"
            value={topTrack.name}
            description={`by ${topTrack.artists.map((a) => a.name).join(", ")}`}
            icon={
              <span role="img" aria-label="music note">
                🎵
              </span>
            }
            imageUrl={
              topTrack.album.images.length > 0
                ? topTrack.album.images[0].url
                : undefined
            }
            imageAlt={`${topTrack.name} by ${topTrack.artists[0].name}`}
          />
        )}
      </div>
    );
  }

  // Fallback if topItems is null but no specific error or loading state
  return <p>No data available. Please log in to see your Spotify Dashboard.</p>;
}

export default App;
