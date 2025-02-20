import MITResult from '@models/MITResult';
import connectDB from '@middleware/database';
import { NextResponse } from 'next/server';

export async function POST(req) {
    await connectDB(); // Connect to the database
    const { email, class: userClass, scale, answers, uniqueId } = await req.json();

    const result = new MITResult({
        email,
        class: userClass,
        scale,
        answers,
        uniqueId,
    });

    await result.save();

    return NextResponse.json({ success: true, result }, { status: 201 });
}
