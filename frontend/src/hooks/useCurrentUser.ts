import { useQuery } from "@tanstack/react-query";
import type { User } from "../types/index.ts";
import API from "../api.ts";

interface UseCurrentUserOptions {
  token: string | null;
}

export const useCurrentUser = ({ token }: UseCurrentUserOptions) => {
  return useQuery({
    queryKey: ["currentUser", token],
    queryFn: async () => {
      const response = await API.get("/me", {
        params: { token },
      });
      return response.data as User;
    },
    enabled: !!token,
  });
};
