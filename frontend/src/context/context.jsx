import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../config/firebase";

const authContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
      setIsAuth(!!u);
    });

    return () => unSubscribe();
  }, [isAuth, user]);

  return (
    <authContext.Provider value={{ isAuth, user, setIsAuth }}>
      {children}
    </authContext.Provider>
  );
};

export const useAuth = () => useContext(authContext);
