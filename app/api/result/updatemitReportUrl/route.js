// app/api/result/updateReportUrl.js
import Result from '@models/MITResult';
import connectDB from '@middleware/database';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        await connectDB();
        const { uniqueId, reportUrl } = await req.json();

        const updatedResult = await Result.findOneAndUpdate(
            { uniqueId },
            { reportUrl },
            { new: true }
        );

        if (!updatedResult) {
            return NextResponse.json(
                { success: false, message: 'Result not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, result: updatedResult }, { status: 200 });
    } catch (error) {
        console.error('Error updating report URL:', error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}