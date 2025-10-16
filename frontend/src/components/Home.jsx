import { signInWithPopup, signOut } from "firebase/auth";
import { Link } from "react-router-dom";
import { auth, googleProvider } from "../config/firebase";
import { useAuth } from "../context/context";
import { useGetAllFirebaseByUserId } from "../hooks/getTaks";
import { Card } from "./Card";

export const Home = () => {
  const { data, isLoading, isError } = useGetAllFirebaseByUserId();
  const { isAuth, user, setIsAuth } = useAuth();

  const handlerLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setIsAuth(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handlerLogout = async () => {
    try {
      await signOut(auth);
      setIsAuth(false);
    } catch (error) {
      console.error(error);
    }
  };

  const { displayName, photoURL } = user || {};

  return (
    <div className="flex flex-col w-full h-full">
      <header className="w-ful border-l-2 h-12 my-4 mx-1">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-blue-500 mx-4">
              {isAuth && photoURL ? (
                <img
                  src={photoURL}
                  alt="profile photo"
                  className="w-full h-full rounded-full"
                />
              ) : null}
            </div>
            <strong>{isAuth && displayName ? displayName : "USERNAME"}</strong>
          </div>
          <button
            onClick={isAuth ? handlerLogout : handlerLogin}
            className={`${
              isAuth
                ? "rounded-2xl py-1 px-2  hover:bg-gray-400  transition-all duration-500 cursor-pointer bg-gray-500 font-semibold flex justify-center items-center"
                : "rounded-2xl py-1 px-2  hover:bg-green-500  transition-all duration-500 cursor-pointer bg-green-900 border-1 border-green-800 font-semibold flex justify-center items-center"
            }`}
          >
            {isAuth ? "Logout" : "Login"}
          </button>
        </div>
      </header>

      <h1 className="font-bold text-3xl mt-8">
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

        {isAuth && data && data?.length > 0 ? (
          data?.map((todo) => {
            const { id } = todo;
            return <Card key={id} todo={todo} />;
          })
        ) : (
          <div className="col-span-3 text-center font-semibold text-3xl">
            <p className="text-xl text-gray-600">
              Hello {displayName}, you don't have any todos yet!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
