import { Link } from "react-router-dom";
import { useGetTasks } from "../hooks/getTaks";
import { Card } from "./Card";

export const Home = () => {
  const { data, isLoading, isError } = useGetTasks();

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

        {data &&
          data.tasks?.map((task) => {
            const { id } = task;
            return <Card key={id} task={task} />;
          })}
      </div>
    </div>
  );
};
