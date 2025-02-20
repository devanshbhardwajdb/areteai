'use client'
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext';
import Lottie from 'lottie-react';
import Loader from "@/docs-loader.json";
import Link from 'next/link';

const YourAssessments = () => {
    const { user } = useAuth();
    const [results, setResults] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                // Fetch all types of results
                const mitRes = await fetch(`/api/result/getmitresults?email=${user?.email}`);
                const mitResponse = await mitRes.json();

                const varkRes = await fetch(`/api/result/getvarkresults?email=${user?.email}`);
                const varkResponse = await varkRes.json();



                // Combine and sort all results by date in descending order
                const combinedResults = [
                    ...mitResponse.map(r => ({ ...r, testType: 'MIT' })),
                    ...varkResponse.map(r => ({ ...r, testType: 'VARK' })),

                ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                setResults(combinedResults);
                setPageLoading(false);
            } catch (error) {
                console.error('Error fetching results:', error);
                setPageLoading(false);
            }
        };

        if (user) fetchResults();
    }, [user]);



    const calculateScore = (result) => {
        switch (result.testType) {
            case 'MIT':
                let totalPageSum = 0;
                let totalPossibleSum = 0;
                Object.values(result.answers).forEach(intelligence => {
                    totalPageSum += intelligence.pageSum;
                    totalPossibleSum += intelligence.totalSum;
                });
                return {
                    mainScore: `${totalPageSum}/${totalPossibleSum}`,
                    // details: Object.entries(result.answers).map(([key, value]) => ({
                    //     name: key,
                    //     score: `${value.pageSum}/${value.totalSum}`
                    // }))
                };

            case 'VARK':
                const total = result.scores.V + result.scores.A + result.scores.R + result.scores.K;
                return {
                    // mainScore: `${total}/48`,
                    details: [
                        { name: 'Visual', score: result.scores.V },
                        { name: 'Auditory', score: result.scores.A },
                        { name: 'Reading', score: result.scores.R },
                        { name: 'Kinesthetic', score: result.scores.K }
                    ]
                };

            default:
                return { mainScore: '0/0', details: [] };
        }
    };

    return (
        <div className='flex items-center justify-center min-h-[100vh]'>
            {pageLoading ? (
                <Lottie animationData={Loader} loop={true} className='w-[15vw] p-0' />
            ) : (
                <div className='flex flex-col font-mont gap-5 items-center justify-start p-4 pt-10 min-h-[100vh] w-full'>
                    {results.length > 0 ? (
                        <h3 className='text-white text-3xl max-xl:text-xl font-bold'>Here are your assessments</h3>
                    ) : (
                        <h3 className='text-white text-3xl max-xl:text-xl font-bold'>You have no assessment yet.</h3>
                    )}
                    <div className="flex max-md:flex-col  items-stretch gap-5 flex-wrap">
                        {results.map((result, index) => {
                            const scoreData = calculateScore(result);
                            return (
                                <div key={index} className="flex flex-col min-w-[300px] gap-6 p-5 rounded-lg items-center bg-black/60">
                                    <div className="flex flex-col items-center border-b border-gray-500 w-full pb-3">
                                        <h4 className="text-white/90 text-xl font-semibold">
                                            {result.testType} Assessment
                                        </h4>
                                        <h4 className="text-white/90 text-sm">
                                            Class {result.class} | {result.createdAt.split("T")[0]}
                                        </h4>
                                    </div>
                                   {scoreData.mainScore && <div className="flex justify-between items-center">
                                        <h4 className="text-white/90 font-semibold">Total Score : </h4>
                                        <h4 className="text-white/90"> {scoreData.mainScore}</h4>
                                    </div>}
                                    <div className="flex flex-col gap-4 w-full">
                                        <div className="flex flex-col gap-2">
                                            {/* <h4 className="text-white/90 font-semibold">Breakdown:</h4> */}
                                            {scoreData.details?.map((detail, idx) => (
                                                <div key={idx} className="flex justify-between items-center text-sm">
                                                    <span className="text-white/80">{detail.name}:</span>
                                                    <span className="text-white/80">{detail.score}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <Link
                                        href={`/${result.testType.toLowerCase()}result/${result.uniqueId}`}
                                        rel="noopener noreferrer"
                                        className='bg-[#00a6a6] text-black px-6 py-2 font-mont text-base rounded-full duration-300 hover:shadow-md hover:shadow-black hover:scale-95 mt-2'
                                    >
                                        View Details
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