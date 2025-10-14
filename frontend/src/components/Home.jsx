import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import { useGetTaskInfiniteScroll } from "../hooks/getTaks";
import { Card } from "./Card";
export const Home = () => {
  const { ref, inView } = useInView();

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetTaskInfiniteScroll();

  // Flatten pages -> tasks
  const allTasks = data?.pages?.flatMap((p) => p.tasks) || [];

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="flex flex-col w-full h-full">
      <h1 className="font-bold text-3xl mb-2">
        Welcome Optimistip Update Example
      </h1>

      <Link
        to={"/create"}
        className="fixed bottom-8 right-8 bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
      >
        + Create
      </Link>

      <div className="grid auto-rows-auto grid-cols-3 mt-12">
        {isLoading && (
          <p className="text-2xl text-gray-500 font-bold">Loading...</p>
        )}
        {isError && (
          <p className="text-red-600 font-bold text-2xl">Error loading data</p>
        )}

        {allTasks.map((task) => {
          const { id } = task;
          return <Card key={id} task={task} />;
        })}

        {hasNextPage && (
          <div className="col-span-3 flex justify-center mt-4">
            <div
              ref={ref}
              className="flex items-center cursor-pointer gap-2  text-white font-semibold py-3 px-6"
            >
              {isFetchingNextPage ? (
                <p>Loading...</p>
              ) : hasNextPage ? (
                <p>Load More</p>
              ) : (
                "No More Tasks"
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
