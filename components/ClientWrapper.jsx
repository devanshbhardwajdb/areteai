// components/ClientWrapper.jsx
"use client";

import React, { useEffect, useState } from 'react';
import LoadingBar from 'react-top-loading-bar';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

const ClientWrapper = ({ children, initial }) => {
  const [user, setUser] = useState(initial.decoded || null);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (initial.decoded) {
      setUser(initial.decoded);
    }
  }, [initial.decoded]);

  const logout = async () => {
    const res = await fetch('/api/auth/logout', { method: 'POST' });
    if (res.ok) {
      setUser(null);
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
      <Navbar tokenUserData={user} logout={logout} />
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, { tokenUserData: user }); // Pass user to all children
      })}
    </>
  );
};

export default ClientWrapper;
