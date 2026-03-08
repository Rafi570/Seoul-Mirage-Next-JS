"use client"
import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      const savedToken = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user"); 

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser)); 
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (data) => {
    setToken(data.token);
    setUser(data.user);


    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const authInfo = {
    user,
    token,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;