"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Lottie from 'lottie-react';
import A1 from '@/anime3.json';
import Loader from "@/docs-loader.json";

const VarkResult = () => {
    const router = useRouter();
    const { id } = useParams();
    const { user } = useAuth();
    const [result, setResult] = useState(null);
    const [pageLoading, setPageLoading] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) {
            router.push('/');
        }
    }, [user]);

    useEffect(() => {
        const fetchResult = async () => {
            try {
                const res = await fetch(`/api/result/getvarkresultbyid?id=${id}`);
                const response = await res.json();
                if (response && response.length > 0) {
                    setResult(response[0]);
                }
                setPageLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setPageLoading(false);
            }
        };

        if (id) fetchResult();
    }, [id]);

    if (pageLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Lottie animationData={Loader} loop className='w-[15vw] p-0' />
            </div>
        );
    }

    if (!result) {
        return (
            <div className="flex justify-center items-center min-h-screen text-white text-lg">
                No result found.
            </div>
        );
    }

    const { scores, reportUrl } = result;
    const visual = scores?.V || 0;
    const auditory = scores?.A || 0;
    const reading = scores?.R || 0;
    const kinesthetic = scores?.K || 0;

    const totalScore = visual + auditory + reading + kinesthetic;
    const getPercentage = (score) => ((score / totalScore) * 100).toFixed(1);

    const scoreArray = [
        { name: "Visual", score: visual, percentage: getPercentage(visual) },
        { name: "Auditory", score: auditory, percentage: getPercentage(auditory) },
        { name: "Reading/Writing", score: reading, percentage: getPercentage(reading) },
        { name: "Kinesthetic", score: kinesthetic, percentage: getPercentage(kinesthetic) }
    ];

    const sortedScores = [...scoreArray].sort((a, b) => b.score - a.score);
    const highestScore = sortedScores[0].score;
    const topCategories = sortedScores.filter(category => category.score === highestScore);

    let learningStyle = "Balanced Learner";
    if (topCategories.length === 1) {
        learningStyle = `Dominant ${topCategories[0].name} Learner`;
    } else if (topCategories.length > 1) {
        learningStyle = `Multimodal Learner: ${topCategories.map(cat => cat.name).join(" & ")}`;
    }

    const getStyleDescription = (style) => {
        const descriptions = {
            Visual: "You learn best through visual aids like diagrams, charts, and images.",
            Auditory: "You prefer learning through listening and discussion.",
            "Reading/Writing": "You excel with written materials and note-taking.",
            Kinesthetic: "You learn most effectively through hands-on experience.",
            Balanced: "You can adapt to various learning methods effectively.",
            Multimodal: "You benefit from combining different learning approaches."
        };
        return descriptions[style] || descriptions.Balanced;
    };

    const generateVarkReport = async () => {
        setLoading(true);
        try {
            // Step 1: Generate analysis data
            const analysisResponse = await fetch('/api/report/generateVarkAnalysis', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ result, user }),
            });
            const analysisResult = await analysisResponse.json();
            if (!analysisResponse.ok) throw new Error(analysisResult.error || 'Failed to generate analysis');

            if (!analysisResult.analysisData) {
                throw new Error('Invalid analysis data received');
            }

            // Step 2: Generate PDF from analysis data
            const pdfResponse = await fetch('/api/report/generateVarkPdf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    analysisData: analysisResult.analysisData,
                    user
                }),
            });
            const pdfResult = await pdfResponse.json();
            if (!pdfResponse.ok) throw new Error(pdfResult.error || 'Failed to generate PDF');

            console.log(pdfResult)

            // Step 3: Update the result with the PDF URL
            const updateResponse = await fetch('/api/result/updatevarkReportUrl', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ uniqueId: result.uniqueId, reportUrl: pdfResult.pdfUrl }),
            });

            if (!updateResponse.ok) {
                const updateResult = await updateResponse.json();
                throw new Error(updateResult.error || 'Failed to update report URL');
            }

            setResult(prev => ({ ...prev, reportUrl: pdfResult.pdfUrl }));

            // Open the PDF in a new tab
            window.open(pdfResult.pdfUrl, '_blank');
        } catch (error) {
            console.error('Error generating VARK report:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen px-[10vw] flex flex-col justify-center items-center font-mont max-md:px-6 max-md:pt-28">
            <div className="flex flex-col gap-6 items-center md:w-3/4 w-full h-auto p-8 rounded-lg shadow-lg bg-black/60 mt-40 mb-20">
                <h3 className="text-white text-2xl font-bold">VARK Assessment Results (For Class {result.class})</h3>
                <h4 className="text-white text-xl font-semibold">{learningStyle}</h4>

                <p className="text-white text-center">
                    {getStyleDescription(topCategories.length === 1 ? topCategories[0].name :
                        topCategories.length > 1 ? 'Multimodal' : 'Balanced')}
                </p>

                <div className="w-full mt-6">
                    {scoreArray.map((category, index) => (
                        <div key={index} className="mb-4">
                            <div className="flex justify-between text-white text-lg mb-2">
                                <span>{category.name}</span>
                                <span>{category.score} ({category.percentage}%)</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2.5">
                                <div
                                    className="bg-[#00a6a6] h-2.5 rounded-full transition-all duration-500"
                                    style={{ width: `${category.percentage}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* <div className="w-full mt-6 p-4 bg-white/10 rounded-lg">
                    <h5 className="text-white text-lg font-semibold mb-3">Learning Recommendations</h5>
                    <p className="text-white">{recommendations}</p>
                </div> */}

                {result.reportUrl ? (
                    <a href={result.reportUrl} target="_blank" className="nav-btn bg-[#00a6a6] text-black px-5 py-2 rounded-lg transition-all duration-150 hover:scale-95 hover:shadow-lg w-full flex justify-center items-center mt-5">
                        View Report
                    </a>
                ) : (
                    <button onClick={generateVarkReport} className="nav-btn bg-[#00a6a6] text-black px-5 py-2 rounded-lg transition-all duration-150 hover:scale-95 hover:shadow-lg w-full flex justify-center items-center mt-5" disabled={loading}>
                        {loading ? <Lottie animationData={A1} loop className="w-6" /> : 'Generate Report'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default VarkResult;
