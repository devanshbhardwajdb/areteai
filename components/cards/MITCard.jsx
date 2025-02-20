import Link from 'next/link';
import React from 'react';

const MITCard = ({ result }) => {
    const calculateTotalScore = (answers) => {
        let totalPageSum = 0;
        let totalPossibleSum = 0;

        Object.values(answers).forEach(intelligence => {
            totalPageSum += intelligence.pageSum;
            totalPossibleSum += intelligence.totalSum;
        });

        return { totalPageSum, totalPossibleSum };
    };

    const { totalPageSum, totalPossibleSum } = calculateTotalScore(result.answers);

    return (
        <div className="flex flex-col min-w-[280px] gap-6 p-3 rounded-lg items-center bg-black/60">
            <div className="flex flex-col items-center border-b border-gray-500">
                <h4 className="text-white/90 text-xl font-semibold">Assessment for {result.class}th class</h4>
                <h4 className="text-white/90 font-base">({result.createdAt.split("T")[0]})</h4>
            </div>
            <div className="flex gap-2">
                <h4 className="text-white/90 font-semibold">Test Type:</h4>
                <h4 className="text-white/90">{result.testType}</h4>
            </div>
            <div className="flex gap-2">
                <h4 className="text-white/90 font-semibold">Total Score:</h4>
                <h4 className="text-white/90">{totalPageSum}/{totalPossibleSum}</h4>
            </div>
            <Link href={`/mitresult/${result.uniqueId}`}>
                <button className='bg-[#00a6a6] text-black px-6 py-2 font-mont text-base rounded-full duration-300 hover:shadow-md hover:shadow-black hover:scale-95'>
                    View Result
                </button>
            </Link>
        </div>
    );
};

export default MITCard;
