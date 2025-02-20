"use client"
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Lottie from 'lottie-react';
import A1 from '@/anime3.json';
import A2 from "@/butterfly.json";
import Loader from "@/docs-loader.json";
import { useRouter } from 'next/navigation';
import { useParams, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import MITest from '@components/MITest';
import VarkTest from '@components/VarkTest';


const Questions = () => {

    const router = useRouter();
    const { class: userClass, testType: testType } = useParams();

    const searchParams = useSearchParams(); // Get query parameters
    const couponCode = searchParams.get('c'); // Example query parameter
    const { user } = useAuth();


    useEffect(() => {
        if (!user || couponCode !== '12345') {
            router.push('/');
        }
    }, [user, router, couponCode]);



    return (
        <div className="min-h-[100vh] px-[10vw] flex flex-col justify-center items-center font-mont max-md:px-6 max-md:pt-28">
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={true}
                newestOnTop={false}
                rtl={false}
                pauseOnFocusLoss
                theme="dark"
            />
            {(testType === 'MITest') ? <MITest userClass={userClass} /> : <VarkTest userClass={userClass}/>}
        </div>
    );
};

export default Questions;
