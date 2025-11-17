import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { useTopItems } from "../hooks/useTopItems.ts";
import { useAuth } from "../hooks/useAuth.ts";
import TopItemsCard from "../components/TopItemsCard.tsx";
import { ItemTypes, TimeRanges } from "../types.ts";

const detailsSearchSchema = z.object({
  type: z.enum(ItemTypes),
  time_range: z.enum(TimeRanges),
});

type DetailsSearch = z.infer<typeof detailsSearchSchema>;

export const Route = createFileRoute("/details")({
  validateSearch: detailsSearchSchema,
  component: DetailsPage,
});

function DetailsPage() {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  const { type, time_range } = Route.useSearch() as DetailsSearch;
  const { token, isCheckingToken } = useAuth();
  const limit = 50;
  const { data: topItems, isLoading } = useTopItems({
    token,
    params: { type, time_range, limit },
    enabled: !isCheckingToken,
  });

  const topItemsResponse = topItems?.top_artists ?? topItems?.top_tracks;
  const items = topItemsResponse?.items ?? [];

  return (
    <>
      <Link to="/">Go Back</Link>

      <TopItemsCard
        title="Your Top Tracks"
        length={limit}
        items={items}
        isLoading={isLoading}
        detailed
      />
    </>
  );
}
