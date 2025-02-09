'use client'
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext';
import Lottie from 'lottie-react';
import Loader from "@/docs-loader.json";
import Link from 'next/link';

const YourAssessments = () => {
    const { user } = useAuth();
    const [results, setResults] = useState();
    const [pageLoading, setPageLoading] = useState(true);

    useEffect(() => {
        const fetchResult = async () => {
            try {
                const res = await fetch(`/api/result/getresults?email=${user?.email}`);
                const response = await res.json();
                // Sort results by date in descending order
                const sortedResults = response.sort((a, b) => 
                    new Date(b.createdAt) - new Date(a.createdAt)
                );
                setResults(sortedResults);
                setPageLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        if (user) fetchResult();
    }, [user]);

    const calculateTotalScore = (answers) => {
        let totalPageSum = 0;
        let totalPossibleSum = 0;

        Object.values(answers).forEach(intelligence => {
            totalPageSum += intelligence.pageSum;
            totalPossibleSum += intelligence.totalSum;
        });

        return { totalPageSum, totalPossibleSum };
    };

    return (
        <div className='flex items-center justify-center min-h-[100vh]'>
            {pageLoading ? (
                <Lottie animationData={Loader} loop={true} className='w-[15vw] p-0' />
            ) : (
                <div className='flex flex-col font-mont gap-5 items-center justify-start p-4 pt-10 min-h-[100vh] w-full'>
                    {results.length>0 ? (<h3 className='text-white text-3xl max-xl:text-xl font-bold'>Here are your assessments</h3>)
                    :(<h3 className='text-white text-3xl max-xl:text-xl font-bold'>You have no assessment yet.</h3>)}
                    <div className="flex max-md:flex-col items-stretch gap-5 flex-wrap">
                        {results.map((elem, index) => {
                            const { totalPageSum, totalPossibleSum } = calculateTotalScore(elem.answers);
                            return (
                                <div key={index} className="flex flex-col min-w-[280px] gap-6 p-3 rounded-lg items-center bg-black/60">
                                    <div className="flex flex-col items-center border-b border-gray-500">
                                        <h4 className="text-white/90 text-xl font-semibold">Assessment for {elem.class}th class</h4>
                                        <h4 className="text-white/90 font-base">({elem.createdAt.split("T")[0]})</h4>
                                    </div>
                                    <div className="flex gap-2">
                                        <h4 className="text-white/90 font-semibold">Total Score:</h4>
                                        <h4 className="text-white/90">{totalPageSum}/{totalPossibleSum}</h4>
                                    </div>
                                    <Link href={`/result/${elem.uniqueId}`}>
                                        <button className='bg-[#00a6a6] text-black px-6 py-2 font-mont text-base rounded-full duration-300 hover:shadow-md hover:shadow-black hover:scale-95'>
                                            View Result
                                        </button>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default YourAssessments;