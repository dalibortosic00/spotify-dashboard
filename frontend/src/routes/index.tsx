import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import FactCard from "../components/FactCard.tsx";
import TopItemsCard from "../components/TopItemsCard.tsx";
import { useAuth } from "../hooks/useAuth.ts";
import { useTopItems } from "../hooks/useTopItems.ts";
// import ChartCard from "../components/ChartCard.tsx";
// import GenreChart from "../components/GenreChart.tsx";
import { getStoredAuth } from "../utils/auth.ts";
import type { TimeRange } from "../types.ts";

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
  const [timeRange, setTimeRange] = useState<TimeRange>("medium_term");
  const limit = 20;
  const { token, isCheckingToken } = useAuth();
  const {
    data: topItems,
    isLoading,
    error,
  } = useTopItems({
    token,
    params: { time_range: timeRange, limit },
    enabled: !isCheckingToken,
  });

  if (error) {
    return (
      <p className="error-message">
        Failed to load Spotify data. Your session might have expired. Please try
        logging in again.
      </p>
    );
  }

  const topArtists = topItems?.top_artists.items;
  const topTracks = topItems?.top_tracks.items;

  return (
    <>
      <div className="time-range-buttons">
        <button
          type="button"
          className={timeRange === "long_term" ? "active" : ""}
          onClick={() => {
            setTimeRange("long_term");
          }}
        >
          Last Year
        </button>
        <button
          type="button"
          className={timeRange === "medium_term" ? "active" : ""}
          onClick={() => {
            setTimeRange("medium_term");
          }}
        >
          Last 6 Months
        </button>
        <button
          type="button"
          className={timeRange === "short_term" ? "active" : ""}
          onClick={() => {
            setTimeRange("short_term");
          }}
        >
          Last 4 Weeks
        </button>
      </div>
      <div className="dashboard-grid">
        <FactCard
          title="Your Top Artist"
          item={topArtists?.[0]}
          icon={
            <span role="img" aria-label="star">
              ⭐
            </span>
          }
          isLoading={isLoading}
        />

        <FactCard
          title="Your Top Track"
          item={topTracks?.[0]}
          icon={
            <span role="img" aria-label="music note">
              🎵
            </span>
          }
          isLoading={isLoading}
        />

        <TopItemsCard
          title="Your Top Artists"
          length={10}
          items={topArtists}
          isLoading={isLoading}
        />

        <TopItemsCard
          title="Your Top Tracks"
          length={10}
          items={topTracks}
          isLoading={isLoading}
        />

        {/* <ChartCard title="Your Top Genres" subtitle="Based on your top artists">
          <GenreChart artists={topArtists} />
        </ChartCard> */}
      </div>
    </>
  );
}
