import FactCard from "../components/FactCard.tsx";
import TopItemsCard from "../components/TopItemsCard.tsx";
import { useAuth } from "../hooks/useAuth.ts";
import { useTopItems } from "../hooks/useTopItems.ts";
import ChartCard from "../components/ChartCard.tsx";
import GenreChart from "../components/GenreChart.tsx";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { getStoredAuth } from "../utils/auth.ts";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    const auth = getStoredAuth();
    if (!auth) {
      /* eslint-disable-next-line @typescript-eslint/only-throw-error */
      throw redirect({ to: "/login" });
    }
  },
  component: DashboardPage,
});

function DashboardPage() {
  const { token, isCheckingToken } = useAuth();
  const {
    data: topItems,
    isLoading,
    error,
  } = useTopItems({
    token,
    enabled: !isCheckingToken,
  });

  if (isLoading) return <p>Loading your Spotify data...</p>;

  if (error) {
    return (
      <p className="error-message">
        Failed to load Spotify data. Your session might have expired. Please try
        logging in again.
      </p>
    );
  }

  if (topItems) {
    const { top_artists, top_tracks } = topItems;

    return (
      <div className="dashboard-grid">
        <FactCard
          title="Your Top Artist"
          item={top_artists.items[0]}
          icon={
            <span role="img" aria-label="star">
              ⭐
            </span>
          }
        />

        <FactCard
          title="Your Top Track"
          item={top_tracks.items[0]}
          icon={
            <span role="img" aria-label="music note">
              🎵
            </span>
          }
        />

        {top_artists.items.length > 1 && (
          <TopItemsCard
            title="Your Top Artists"
            items={top_artists.items.slice(0, 10)}
          />
        )}

        {top_tracks.items.length > 1 && (
          <TopItemsCard
            title="Your Top Tracks"
            items={top_tracks.items.slice(0, 10)}
          />
        )}

        {top_artists.items.length > 1 && (
          <ChartCard
            title="Your Top Genres"
            subtitle="Based on your top artists"
          >
            <GenreChart artists={top_artists.items} />
          </ChartCard>
        )}
      </div>
    );
  }

  // Fallback if topItems is null but no specific error or loading state
  return <p>No data available. Please log in to see your Spotify Dashboard.</p>;
}
