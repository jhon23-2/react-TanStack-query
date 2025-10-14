import { useQuery } from "@tanstack/react-query";

const ITEMS_PER_PAGE = 10;

export const useGetTasks = () => {
  return useQuery({
    queryKey: ["task"],
    queryFn: async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/task?page=1&limit={ITEMS_PER_PAGE}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      } catch (error) {
        throw new Error("Failed to fetch data: " + error.message);
      }
    },
    staleTime: 1000 * 30,
    cacheTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};
