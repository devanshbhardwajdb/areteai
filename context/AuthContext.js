'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const res = await fetch('/api/auth/checkuser'); // Fetch user data from API route
      const data = await res.json();

      console.log(data)
      setUser(data.user); // Set the user data in state
    };

    fetchUserData(); // Call the function on component mount
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
