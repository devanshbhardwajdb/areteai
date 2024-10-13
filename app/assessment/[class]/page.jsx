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


const Questions = () => {
    const router = useRouter();
    

    const { class: userClass } = useParams(); // Get class parameter from route
    // console.log(userClass,"ye hoon main")
    const searchParams = useSearchParams(); // Get query parameters
    const couponCode = searchParams.get('c'); // Example query parameter
    const { user } = useAuth();
    const [answers, setAnswers] = useState({});
    const [currentQuestions, setCurrentQuestions] = useState([]);
    const [scale, setScale] = useState(0);
    const [questionSet, setQuestionSet] = useState({});
    const [currentPageKey, setCurrentPageKey] = useState();
    const [intelligenceIndex, setIntelligenceIndex] = useState();
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true)
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!user || couponCode !== '12345') {
            router.push('/');
        }
    }, [user, router, couponCode]);

    

    useEffect(() => {
        const fetchResult = async () => {
            try {
                const res = await fetch(`/api/questions/getquestions?selectedClass=${userClass}`);
                const response = await res.json();

                if (response.success) {

                    setQuestionSet(response.questionSet);
                    setPageLoading(!pageLoading)
                }
                else {
                    toast.error('This Class is not added yet');

                    setTimeout(() => {

                        router.push('/assessment')
                    }, 3000);
                }


            } catch (error) {
                console.error('Error fetching classes data:', error);
            }
        };

        if (userClass) fetchResult();
    }, [userClass]);

    useEffect(() => {
        if (userClass && questionSet.intelligences && questionSet.intelligences.length > 0) {
            // Set currentPageKey to the first intelligence type if it's not already set
            setIntelligenceIndex(0)
            if (!currentPageKey) {
                setCurrentPageKey(questionSet.intelligences[0].intelligenceType);
            }
        }
        if (questionSet) setScale(questionSet.scale)
    }, [questionSet, userClass]); // Run this effect when questionSet or userClass changes



    // console.log(questionSet);

    // Check if intelligences exists in questionSet
    const pageKeys = questionSet.intelligences ? questionSet.intelligences.map(intelligence => intelligence.intelligenceType) : [];
    const totalPages = pageKeys.length;

    useEffect(() => {
        const currentQuestions = currentPageKey && questionSet.intelligences ? questionSet.intelligences[intelligenceIndex]?.questions : [];
        setCurrentQuestions(currentQuestions)

    }, [intelligenceIndex])

    // Check if all questions for the current page are answered
    const isAllAnswered = currentQuestions.every((_, index) => {
        const answer = answers[currentPageKey]?.[index];
        return answer !== undefined && answer !== '';
    });



    // Update progress bar when page changes
    useEffect(() => {
        const pageIndex = pageKeys.indexOf(currentPageKey) + 1; // Page index starts from 1
        const progressPercentage = (pageIndex / totalPages) * 100; // Calculate progress percentage
        setProgress(progressPercentage);
    }, [currentPageKey, totalPages]); // Ensure totalPages is included as a dependency

    // Function to handle answers
    const handleAnswerChange = (questionIndex, value) => {
        // Check if the value is empty (backspace)
        if (value === '') {
            setAnswers((prevAnswers) => ({
                ...prevAnswers,
                [currentPageKey]: {
                    ...(prevAnswers[currentPageKey] || {}),
                    [questionIndex]: value,
                },
            }));
            return; // Exit early if the input is empty
        }

        // Allow only numeric values between 1 and 5
        const parsedValue = parseInt(value, 10);
        if (parsedValue >= 1 && parsedValue <= 5) {
            setAnswers((prevAnswers) => ({
                ...prevAnswers,
                [currentPageKey]: {
                    ...(prevAnswers[currentPageKey] || {}),
                    [questionIndex]: value,
                },
            }));
        } else {
            // Prevent updating state with invalid input
            toast.error('Please enter a value between 1 and 5'); // Optional: Notify user of invalid input
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Calculate the pageSum for the last page
            const currentQuestions = questionSet.intelligences[intelligenceIndex]?.questions;
            const currentPageAnswers = currentQuestions.map((_, index) => {
                const answer = answers[currentPageKey]?.[index];
                return answer ? parseInt(answer, 10) : 0;
            });
            const pageSum = currentPageAnswers.reduce((acc, score) => acc + score, 0);
            const totalSum = currentQuestions.length * scale

            // Update answers with pageSum for the last page and then submit
            const updatedAnswers = {
                ...answers,
                [currentPageKey]: { ...answers[currentPageKey], pageSum, totalSum },
            };

            setAnswers(updatedAnswers);

            // Wait for state update to complete
            await new Promise((resolve) => setTimeout(resolve, 0));

            // Continue with submission logic
            const email = user.email;
            const uniqueId = `${user.username}_${new Date().getTime()}`;

            const dataToSave = {
                email,
                class: userClass,
                scale,
                answers: updatedAnswers, // use the updated answers object
                uniqueId,
            };

            // Save results in the database
            const response = await fetch('/api/result/saveresult', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSave),
            });

            if (response.ok) {
                toast.success('Answers submitted successfully!');
                router.push(`/result/${uniqueId}`);
                setProgress(100);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error saving result');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error submitting answers');
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        setIntelligenceIndex(intelligenceIndex + 1)
        const currentQuestions = questionSet.intelligences[intelligenceIndex]?.questions;
        const currentPageAnswers = currentQuestions.map((_, index) => {
            const answer = answers[currentPageKey]?.[index];
            return answer ? parseInt(answer, 10) : 0;
        });
        const pageSum = currentPageAnswers.reduce((acc, score) => acc + score, 0);
        const totalSum = currentQuestions.length * scale

        // Store the score for the current page in `answers`
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [currentPageKey]: { ...prevAnswers[currentPageKey], pageSum, totalSum },
        }));

        // Move to the next page (based on the key)
        const currentPageIndex = pageKeys.indexOf(currentPageKey);
        if (currentPageIndex < totalPages - 1) {
            const nextPageKey = pageKeys[currentPageIndex + 1];

            // Reset answers for the new page
            setAnswers((prevAnswers) => ({
                ...prevAnswers,
                [nextPageKey]: {}, // Clear previous answers for the next page
            }));
            setCurrentPageKey(nextPageKey);
        }
    };







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
            {pageLoading ?
                <>
                    <Lottie animationData={Loader} loop={true} className='w-[15vw] p-0' />
                </>
                :
                (<form
                    onSubmit={(e) => handleSubmit(e)}
                    method="POST"
                    className="flex flex-col gap-2 items-center md:w-3/4 w-full h-auto p-8 rounded-lg shadow-lg shadow-black/50 duration-150 transition-all font-mont  backdrop-blur-md bg-black/60 mt-40"
                >
                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden mb-4">
                        <div
                            className="bg-[#00a6a6] h-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <h3 className="text-white/90 text-2xl max-lg:text-xl font-bold">Answer the Questions</h3>
                    <h4 className="text-white/90 text-xl max-lg:text-base font-medium mb-1">(On the scale of 1-{questionSet.scale})</h4>
                    <div className="flex mt-6 gap-8 flex-col w-full">

                        {/* Display current set of questions */}
                        {currentQuestions.map((question, index) => (
                            <div key={index} className="flex flex-col gap-2 w-full">
                                <label className="text-white/90">{question}</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={answers[currentPageKey]?.[index] || ''}
                                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                                    className="bg-transparent rounded-lg p-2 w-full focus:outline-none focus:shadow-md border border-gray-600 text-white/90 focus:border-[#00a6a6] focus:shadow-[#00a6a6]"
                                    required
                                />
                            </div>
                        ))}
                    </div>

                    {/* Next or Continue Button */}
                    {pageKeys.indexOf(currentPageKey) < totalPages - 1 ? (
                        <button
                            type="button"
                            className="nav-btn bg-[#00a6a6] text-black px-5 py-2 rounded-lg transition-all duration-150 hover:scale-95 hover:shadow-lg w-full flex justify-center items-center mt-5"
                            onClick={handleNext}
                            disabled={!isAllAnswered} // Disable until all questions are answered
                        >
                            Continue
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className="nav-btn bg-[#00a6a6] text-black px-5 py-2 rounded-lg transition-all duration-150 hover:scale-95 hover:shadow-lg w-full flex justify-center items-center mt-5"
                            disabled={loading || !isAllAnswered}
                        >
                            {loading ? (
                                <Lottie animationData={A1} loop={true} className="w-6" />
                            ) : (
                                'Submit'
                            )}
                        </button>
                    )}
                </form>)
            }


        </div>
    );
};

export default Questions;
