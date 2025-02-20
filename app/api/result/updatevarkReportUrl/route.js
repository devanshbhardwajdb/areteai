// app/api/result/updateVarkReportUrl.js

import VarkResult from '@/models/VarkResult';
import connectDB from '@/middleware/database';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        await connectDB();

        const { uniqueId, reportUrl } = await req.json();

        console.log('Received uniqueId:', uniqueId);
        console.log('Received reportUrl:', reportUrl);

        const updatedResult = await VarkResult.findOneAndUpdate(
            { uniqueId },
            { reportUrl },
            { new: true }
        );

        if (!updatedResult) {
            console.error('Result not found for uniqueId:', uniqueId);
            return NextResponse.json(
                { success: false, message: 'Result not found' },
                { status: 404 }
            );
        }

        console.log('Updated result:', updatedResult);

        return NextResponse.json({ success: true, result: updatedResult }, { status: 200 });
    } catch (error) {
        console.error('Error updating report URL:', error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}