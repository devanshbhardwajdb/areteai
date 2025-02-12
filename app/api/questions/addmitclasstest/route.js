import MITest from '@models/MITest';
import connectDB from '@middleware/database';
import { NextResponse } from 'next/server';


export async function POST(req) {
    const { class: classNum, scale, intelligences } = await req.json();

    await connectDB();

    // Check if a question set already exists for the class
    const existingClassQuestions = await MITest.findOne({ class: classNum });

    if (existingClassQuestions) {
        return new Response(JSON.stringify({ success: false, message: 'Questions for this class already exist.' }), { status: 400 });
    }

    // Create a new question set for the class with multiple intelligences
    const newQuestionSet = new MITest({
        class: classNum,
        scale,
        intelligences 
    });

    await newQuestionSet.save();

    return NextResponse.json({ success: true, message:"Class Added Successfully" }, { status: 201 });
}
