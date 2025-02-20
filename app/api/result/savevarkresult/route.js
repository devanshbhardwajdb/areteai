import VarkResult from '@models/VarkResult';
import connectDB from '@middleware/database';
import { NextResponse } from 'next/server';

export async function POST(req) {
    await connectDB();
    const data = await req.json();
    
    if (!data.email || !data.class || !data.scale || !data.answers || !data.uniqueId) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
        const newResult = new VarkResult({
            email: data.email,
            class: data.class,
            scale: data.scale,
            testType: data.testType,
            answers: data.answers,
            uniqueId: data.uniqueId,
            scores: data.scores
        });

        await newResult.save();
        return NextResponse.json({ 
            success: true, 
            uniqueId: data.uniqueId 
        }, { status: 201 });
    } catch (error) {
        console.error("Error saving VARK result:", error);
        return NextResponse.json({ 
            error: "Internal Server Error" 
        }, { status: 500 });
    }
}