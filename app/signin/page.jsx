"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { parseCookies } from 'nookies';
import { FcGoogle } from "react-icons/fc";
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Lottie from "lottie-react";
import A1 from "@/anime3.json";
import A2 from "@/butterfly.json";
import Head from 'next/head';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from '@firebase.config';
import { useAuth } from '@/context/AuthContext';

const Signup = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { user } = useAuth();

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // console.log(user)
            const username = user.email.split("@")[0]

            const userData = {
                name: user.displayName,
                username,
                email: user.email,
                profilepic: user.photoURL,
            };

            const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/auth/signin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const data = await res.json();
            // console.log(data)
            if (data.success) {
                toast.success('You are signed up successfully.');
                
                setTimeout(() => {
                    router.push('/')
                }, 3000); 
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            console.error('Error signing in with Google:', error);

            toast.error(`${error.message}`);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {

        if (user) {
            router.push('/')
        }

    }, [user])

    return (
        <div className='min-h-screen px-[10vw] flex flex-col justify-center items-center font-mont max-md:px-6 max-md:pt-28'>
            <Head>
                <title>SignIn to AreteAI</title>
                {/* Description */}
                <meta name="description" content="Join AreteAI to evaluate yourself" />
                {/* Open Graph metadata for sharing on social media */}
                <meta property="og:title" content="AreteAI" />
                <meta property="og:description" content="Join AreteAI to evaluate yourself" />
                <meta property="og:image" content="https://arete-ai.vercel.app/logo.png" />
                {/* Twitter Card metadata */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="AreteAI" />
                <meta name="twitter:description" content="Join AreteAI to evaluate yourself" />
                <meta name="twitter:image" content="https://arete-ai.vercel.app/logo.png" />
            </Head>
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={true}
                newestOnTop={false}
                rtl={false}
                pauseOnFocusLoss
                theme="dark"
            />
            <div className="flex flex-col  items-center md:w-1/2 w-full h-1/2 p-8 rounded-lg shadow-lg shadow-black/50 bg-black/60 font-mont gap-20 ">
                <div className="flex  items-center justify-center">

                    <h3 className="text-white/90 text-6xl font-bold"><span className='text-[#00a6a6]'>Arete</span>AI</h3>
                    {/* <Lottie animationData={A2} loop={true} className='w-1/2 bg-red-400 p-0' /> */}
                </div> 
                <div className='flex flex-col items-center gap-4'>
                    <h3 className="text-white/90 text-2xl font-bold">Join and start assessing yourself</h3>

                    <button
                        type='button'
                        onClick={handleGoogleSignIn}
                        className='flex items-center gap-2 justify-center bg-gray-700 text-white/90 hover:bg-black duration-150 transition-all p-2 w-60 rounded-xl '>
                        <FcGoogle size={40} />
                        {loading ? <Lottie animationData={A1} loop={true} className='w-6 invert' /> : <p>Sign in with Google</p>}
                    </button>
                </div>
            </div>
        </div>
    );
}


export default Signup;
