// components/ClientWrapper.jsx
"use client";

import React, { useEffect, useState } from 'react';
import LoadingBar from 'react-top-loading-bar';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import Footer from './Footer';

const ClientWrapper = ({ children, initial }) => {
  // const [user, setUser] = useState(initial.decoded || null);
  const [progress, setProgress] = useState(0);
  const router = useRouter();
  const { user, resetUser } = useAuth();


  // useEffect(() => {
  //   if (initial.decoded) {
  //     setUser();
  //   }
  // }, []);

  const logout = async () => {
    const res = await fetch('/api/auth/logout', { method: 'POST' });
    const data = await res.json()

    // console.log(data)
    if (data.success) {
      resetUser(); 
      router.push('/');
    }
  };

  return (
    <>
      <LoadingBar
        style={{ backgroundColor: '#000000' }}
        progress={progress}
        waitingTime={300}
        height={4}
        onLoaderFinished={() => setProgress(0)}
      />
      <Navbar user={user} logout={logout} />
      {children}
      <Footer/>
    </>
  );
};

export default ClientWrapper;
