"use client";
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Lottie from 'lottie-react';
import LoaderAnimation from '@/docs-loader.json';
import A1 from '@/anime3.json';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const VarkTest = ({ userClass }) => {
    const router = useRouter();
    const { user } = useAuth();
    const [questionSet, setQuestionSet] = useState(null);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await fetch(`/api/questions/getvarkquestions?selectedClass=${userClass}`);
                const response = await res.json();
                if (response.success) {
                    setQuestionSet(response.questionSet);
                    setPageLoading(false);
                } else {
                    toast.error('No questions found for this class.');
                    setTimeout(() => router.push('/assessment'), 3000);
                }
            } catch (error) {
                console.error('Error fetching VARK questions:', error);
            }
        };
        if (userClass) fetchQuestions();
    }, [userClass, router]);

    useEffect(() => {
        if (questionSet?.questions) {
            const total = questionSet.questions.length;
            const answeredCount = Object.keys(answers).length;
            setProgress((answeredCount / total) * 100);
        }
    }, [answers, questionSet]);

    const handleAnswerChange = (questionIndex, selectedOption) => {
        setAnswers(prev => ({
            ...prev,
            [questionIndex]: selectedOption,
        }));
    };

    const calculateScores = (answers) => {
        const scores = { V: 0, A: 0, R: 0, K: 0 };
        Object.entries(answers).forEach(([_, answer]) => {
            if (answer in scores) {
                scores[answer]++;
            }
        });
        return scores;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (questionSet.questions.length !== Object.keys(answers).length) {
            toast.error("Please answer all questions before submitting.");
            setLoading(false);
            return;
        }

        const scores = calculateScores(answers);
        const uniqueId = `${user.username}_${Date.now()}`;

        const dataToSave = {
            email: user.email,
            class: userClass,
            scale: questionSet.scale,
            testType: "VarkTest",
            answers,
            uniqueId,
            scores
        };

        try {
            const res = await fetch('/api/result/savevarkresult', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSave),
            });

            const resData = await res.json();
            if (res.ok) {
                toast.success("Test submitted successfully!");
                router.push(`/varkresult/${uniqueId}`);
            } else {
                toast.error(resData.error || "Error saving result.");
            }
        } catch (error) {
            console.error("Error submitting VARK result:", error);
            toast.error("Submission failed.");
        }
        setLoading(false);
    };

    return (
        <>
            {pageLoading ? (
                <Lottie animationData={LoaderAnimation} loop={true} className="w-[15vw] p-0" />
            ) : (
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4 items-center md:w-3/4 w-full h-auto p-8 rounded-lg shadow-lg shadow-black/50 duration-150 transition-all font-mont backdrop-blur-md bg-black/60 mt-40"
                >
                    <ToastContainer position="top-center" autoClose={3000} hideProgressBar theme="dark" />
                    <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden mb-4">
                        <div
                            className="bg-[#00a6a6] h-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <h3 className="text-white/90 text-2xl max-lg:text-xl font-bold">Answer the Questions</h3>
                    <h4 className="text-white/90 text-xl max-lg:text-base font-medium">
                        Select the option that best describes your preference
                    </h4>
                    <div className="flex flex-col gap-6 w-full">
                        {questionSet.questions.map((q, index) => (
                            <div key={index} className="flex flex-col gap-2 w-full">
                                <label className="text-white/90 text-lg font-semibold">
                                    {`${index + 1}. ${q.question}`}
                                </label>
                                <div className="flex flex-col pl-6 gap-4">
                                    {['V', 'A', 'R', 'K'].map((option, optIndex) => (
                                        <label key={optIndex} className="flex items-center gap-2 text-white/90 cursor-pointer ">
                                            <input
                                                type="radio"
                                                name={`question-${index}`}
                                                value={option}
                                                checked={answers[index] === option}
                                                onChange={() => handleAnswerChange(index, option)}
                                                required
                                                className="form-radio h-4 w-4 text-[#00a6a6]"
                                            />
                                            <span>{q.options[optIndex]}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        type="submit"
                        className="bg-[#00a6a6] text-black px-5 py-2 rounded-lg transition-all duration-150 hover:scale-95 w-full flex justify-center items-center mt-5"
                        disabled={loading}
                    >
                        {loading ? <Lottie animationData={A1} loop={true} className="w-6" /> : 'Submit'}
                    </button>
                </form>
            )}
        </>
    );
};

export default VarkTest;