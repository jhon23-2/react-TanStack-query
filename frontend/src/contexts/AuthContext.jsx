import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
      setIsAuth(!!u);
      if (u) {
        localStorage.setItem("isAuth", "true");
      } else {
        localStorage.removeItem("isAuth");
      }
    });
    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuth, setIsAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = AuthContext._currentValue;
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
