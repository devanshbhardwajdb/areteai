'use client'
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { MdAccountCircle } from 'react-icons/md';
import Lottie from 'lottie-react';
import Loader from "@/docs-loader.json";
import Link from 'next/link';

const YourAssessments = () => {

    const { user } = useAuth();
    const [results, setResults] = useState()
    const [pageLoading, setPageLoading] = useState(true)


    useEffect(() => {
        const fetchResult = async () => {
            try {
                // Fetch posts 
                const res = await fetch(`/api/result/getresults?email=${user?.email}`);
                const response = await res.json();
                setResults(response);
                setPageLoading(!pageLoading)
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        if (user) fetchResult();
    }, [user]);




    return (
        <div className='flex items-center justify-center min-h-[100vh]'> {pageLoading ? <Lottie animationData={Loader} loop={true} className='w-[15vw] p-0' /> : <div className='flex flex-col font-mont gap-5 items-center justify-start p-4 pt-10 min-h-[100vh] w-full'>


            <h3 className='text-white text-3xl max-xl:text-xl font-bold'>Here are your assessments</h3>

            <div className="flex max-md:flex-col items-center gap-5">

                {results.map((elem, index) => {

                    return (
                        <div key={index} className="flex flex-col gap-6 w-full p-3 rounded-lg items-center bg-black/60">
                            <div className="flex flex-col items-center border-b border-gray-500">
                                <h4 className="text-white/90 text-xl font-semibold">Assessment for {elem.class}th class </h4>
                                <h4 className="text-white/90 font-base">({elem.createdAt.split("T")[0]}) </h4>
                            </div>
                            {Object.keys(elem.answers).map((e, index) => {
                                const intelligence = elem.answers[e];
                                return (
                                    <div key={index} className="flex flex-col gap-2 w-full">
                                        <div className="flex gap-2">
                                            <h4 className="text-white/90 font-semibold">{e}:</h4>
                                            <h4 className="text-white/90">{intelligence.pageSum}/{intelligence.totalSum}</h4>
                                        </div>
                                    </div>
                                );
                            })}
                            <Link href={`/result/${elem.uniqueId}`}>
                                <button className='bg-[#00a6a6] text-black px-6 py-2 font-mont text-base  rounded-full  duration-300   hover:shadow-md hover:shadow-black hover:scale-95'>View Result</button>
                            </Link>
                        </div>
                    );
                })}

            </div>
        </div>}
        </div>
    )
}

export default YourAssessments
