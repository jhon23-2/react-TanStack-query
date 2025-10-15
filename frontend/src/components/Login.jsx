import { signInWithPopup, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { auth, googleProvider } from "../firebase";

export const Login = () => {
  const navigate = useNavigate();
  const { setIsAuth, isAuth } = useAuth();

  const handlerLogout = async () => {
    try {
      await signOut(auth);
      setIsAuth(false);
      localStorage.removeItem("isAuth");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handlerLogin = async () => {
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
  };

  return (
    <div className="w-full h-full justify-center items-center">
      <div>
        <h1 className="font-bold text-3xl mb-2 py-12 text-center">
          Login Page
        </h1>
        <button
          onClick={isAuth ? handlerLogout : handlerLogin}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-all duration-200 cursor-pointer"
        >
          {isAuth ? "Logout" : "Login with Google"}
        </button>
      </div>
    </div>
  );
};
