"use client"
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Lottie from 'lottie-react';
import Loader from "@/docs-loader.json";


const Result = () => {
    const router = useRouter();
    const [result, setResult] = useState();
    const [totalScore, setTotalScore] = useState(0);
    const [grandTotal, setGrandTotal] = useState()
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true)
    const { id } = useParams();
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            router.push('/');
        }
    }, [user, router]);


    useEffect(() => {
        const fetchResult = async () => {
            try {
                // Fetch posts 
                const res = await fetch(`/api/result/getresultbyid?id=${id}`);
                const response = await res.json();
                setResult(response[0]);
                setPageLoading(!pageLoading)
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        if (id) fetchResult();
    }, [id]);

    // Calculate total score when the result is updated
    useEffect(() => {
        if (result) {
            const score = Object.values(result.answers).reduce((acc, intelligence) => acc + intelligence.pageSum, 0);
            setTotalScore(score);
            const total = Object.keys(result.answers).reduce((acc, key) => {
                const intelligence = result.answers[key];
                const questionCount = Object.keys(intelligence).length - 2;
                return acc + (result.scale * questionCount); // scale multiplied by the number of questions
            }, 0);
            setGrandTotal(total);
        }
    }, [result]);

    return (
        <div className="min-h-[100vh] px-[10vw] flex flex-col justify-center items-center font-mont max-md:px-6 max-md:pt-28">
            {pageLoading ? (
                <Lottie animationData={Loader} loop={true} className='w-[15vw] p-0' />

            ) : (
                <div className="flex flex-col gap-2 items-center md:w-3/4 w-full h-auto p-8 rounded-lg shadow-lg shadow-black/50 duration-150 transition-all font-mont  backdrop-blur-md bg-black/60 mt-40">
                    <h3 className="text-white/90 text-2xl font-bold">Evaluation of your Assessment</h3>
                    <h3 className="text-white/90 text-xl font-semibold mb-1">For {result.class}th class</h3>
                    <div className="flex mt-6 gap-8 flex-col w-full">
                        {Object.keys(result.answers).map((elem, index) => {
                            const intelligence = result.answers[elem];
                            return (
                                <div key={index} className="flex flex-col gap-2 w-full">
                                    <div className="flex gap-2">
                                        <h4 className="text-white/90 font-semibold">{elem}:</h4>
                                        <h4 className="text-white/90">{intelligence.pageSum}/{intelligence.totalSum}</h4>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex gap-2">
                        <h4 className="text-white/90 font-semibold">Total Score:</h4>
                        <h4 className="text-white/90">{totalScore}/{grandTotal}</h4>
                    </div>
                    <button
                        type="submit"
                        className="nav-btn bg-[#00a6a6] text-black px-5 py-2 rounded-lg transition-all duration-150 hover:scale-95 hover:shadow-lg w-full flex justify-center items-center mt-5"
                        disabled={loading}
                    >
                        {loading ? (
                            <Lottie animationData={A1} loop={true} className="w-6" />
                        ) : (
                            'Generate Analyzed AI Report'
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Result;
