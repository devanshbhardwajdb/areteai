import Result from '@models/Result';
import connectDB from '@middleware/database';
import { NextResponse } from 'next/server';

export async function POST(req) {
    await connectDB(); // Connect to the database
    const { email, class: userClass, scale, answers, uniqueId } = await req.json();

    const result = new Result({
        email,
        class: userClass,
        scale,
        answers,
        uniqueId,
    });

    await result.save();

    return NextResponse.json({ success: true, result }, { status: 201 });
}
