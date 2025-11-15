import { useQuery } from "@tanstack/react-query";
import type { TopItems, TopItemsParams } from "../types.ts";
import API from "../api.ts";

interface UseTopItemsOptions {
  token: string | null;
  params?: TopItemsParams;
  enabled?: boolean;
}

export const useTopItems = ({
  token,
  params = {},
  enabled = true,
}: UseTopItemsOptions) => {
  const { type, limit, offset, time_range } = params;

  return useQuery<TopItems>({
    queryKey: ["topItems", token, type, limit, offset, time_range],
    queryFn: async () => {
      const response = await API.get("/me/top", {
        params: {
          token,
          type,
          limit,
          offset,
          time_range,
        },
      });
      return response.data as TopItems;
    },
    enabled: enabled && !!token,
  });
};
