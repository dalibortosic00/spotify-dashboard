import type { TopItems, TopItemsParams } from "../types.ts";
import { useQuery } from "@tanstack/react-query";
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
  return useQuery<TopItems>({
    queryKey: ["topItems", token, params],
    queryFn: async () => {
      console.log("Fetching /me/top from API");
      const response = await API.get("/me/top", {
        params: { token, ...params },
      });
      return response.data as TopItems;
    },
    enabled: enabled && !!token,
  });
};
