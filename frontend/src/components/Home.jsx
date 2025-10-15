import { signInWithPopup, signOut } from "firebase/auth";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { auth, googleProvider } from "../firebase";
import { useGetTaskInfiniteScroll } from "../hooks/getTaks";
import { Card } from "./Card";

export const Home = () => {
  const { ref, inView } = useInView();
  const { isAuth, setIsAuth, user } = useAuth();
  const navigate = useNavigate();

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

  const { displayName, email, photoURL } = user || {};
  const name = displayName?.split(" ")[0] || email?.split("@")[0] || "User";

  return (
    <div className="flex flex-col w-full h-full">
      <header className="w-full p-4 border-b border-gray-300 flex justify-between items-center">
        {/* if is there a user show image profile user and the name  */}

        {isAuth && (
          <div className="flex justify-between items-center">
            <div className="bg-blue-400 rounded-full w-12 h-12 flex justify-center font-bold items-center overflow-hidden">
              {photoURL ? (
                <img src={photoURL} alt="Photo profile" />
              ) : (
                <span className="text-white">{name[0]}</span>
              )}
            </div>
            <h3 className="font-semibold mx-12 text-2xl text-blue-500">
              HI! Welcome {name}
            </h3>
          </div>
        )}

        {/* if user is authenticated show logout button else show login button */}

        {!isAuth ? (
          <button
            onClick={async () => {
              try {
                const result = await signInWithPopup(auth, googleProvider);
                if (result.user) {
                  setIsAuth(true);
                  localStorage.setItem("isAuth", "true");
                  navigate("/");
                }
              } catch (error) {
                console.error("Login failed:", error);
              }
            }}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-all duration-200 cursor-pointer"
          >
            Login
          </button>
        ) : (
          <div>
            <button
              onClick={async () => {
                try {
                  await signOut(auth);
                  localStorage.removeItem("isAuth");
                } catch (err) {
                  console.error("Logout failed", err);
                }
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-all duration-200 cursor-pointer"
            >
              Logout
            </button>
          </div>
        )}
      </header>
      <h1 className="font-bold text-3xl mb-2 py-12 text-center">
        Welcome Optimistip Update Example
      </h1>

      {isAuth && (
        <Link
          to={"/create"}
          className="fixed bottom-8 right-8 bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
        >
          + Create
        </Link>
      )}

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
