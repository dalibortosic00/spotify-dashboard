import type { FC } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { Artist } from "../types.ts";

const CHART_COLORS = [
  "#1DB954", // Spotify Green
  "#1E90FF", // Dodger Blue
  "#8A2BE2", // Blue Violet
  "#FF4500", // Orange Red
  "#00CED1", // Dark Turquoise
  "#DA70D6", // Orchid
  "#FFD700", // Gold
  "#4682B4", // Steel Blue
  "#BA55D3", // Medium Orchid
  "#7CFC00", // Lawn Green
  "#FF6347", // Tomato
  "#6A5ACD", // Slate Blue
  "#20B2AA", // Light Sea Green
  "#FF8C00", // Dark Orange
];

interface GenreChartProps {
  artists: Artist[];
}

const getGenreData = (
  artists: Artist[],
  topX: number,
): { name: string; value: number }[] => {
  if (artists.length === 0) return [];

  const genreCounts: Record<string, number> = {};
  artists.forEach((artist) => {
    artist.genres?.forEach((genre) => {
      const formattedGenre = genre
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      genreCounts[formattedGenre] = (genreCounts[formattedGenre] || 0) + 1;
    });
  });

  const sortedGenres = Object.entries(genreCounts)
    .sort(([, countA], [, countB]) => countB - countA)
    .map(([name, value]) => ({ name, value }));

  return sortedGenres.slice(0, topX);
};

const GenreChart: FC<GenreChartProps> = ({ artists }) => {
  const genres = getGenreData(artists, 10);

  if (genres.length === 0) {
    return null;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={genres}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          labelLine={false}
        >
          {genres.map((entry, index) => (
            <Cell
              key={entry.name}
              fill={CHART_COLORS[index % CHART_COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default GenreChart;
