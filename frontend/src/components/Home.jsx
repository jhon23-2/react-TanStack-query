import { Link } from "react-router-dom";
import { useGetTaskInfiniteScroll } from "../hooks/getTaks";
import { Card } from "./Card";

export const Home = () => {
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
            <button
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
              className="flex items-center cursor-pointer gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isFetchingNextPage ? (
                <>
                  Loading...
                  <svg
                    className="w-5 h-5 animate-spin"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </>
              ) : hasNextPage ? (
                <>
                  Load More
                  <svg
                    className="w-5 h-5 animate-bounce"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </>
              ) : (
                "No More Tasks"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
