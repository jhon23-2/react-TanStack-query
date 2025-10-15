import { useInfiniteQuery } from "@tanstack/react-query";

const ITEMS_PER_PAGE = 10;

export const useGetTaskInfiniteScroll = () => {
  return useInfiniteQuery({
    queryKey: ["task"],
    queryFn: fetchPage,
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined; // lastPage is the server response: { tasks, page, totalPages }
      return lastPage.page < lastPage.totalPages
        ? lastPage.page + 1
        : undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 30, // 30 seconds
    cacheTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
  });
};

const fetchPage = async ({ pageParam = 1 }) => {
  const res = await fetch(
    `http://localhost:3000/api/task?page=${pageParam}&limit=${ITEMS_PER_PAGE}`
  );
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
};
