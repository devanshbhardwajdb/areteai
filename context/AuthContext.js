'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter,usePathname } from 'next/navigation';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const pathname = usePathname()

  // console.log(pathname)

  useEffect(() => {
    const fetchUserData = async () => {
      const res = await fetch('/api/auth/checkuser'); // Fetch user data from API route
      const data = await res.json();

      // Set the user data in state
      setUser(data.user);
    };

    fetchUserData();
   

    // router.events.on('routeChangeComplete', handleRouteChange); // Listen for route changes

    // return () => {
    //   router.events.off('routeChangeComplete', handleRouteChange); // Cleanup listener
    // };
  }, [pathname]);

  const resetUser = () => {
    setUser(null); // Reset the user state manually
  };

  return (
    <AuthContext.Provider value={{ user, resetUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
