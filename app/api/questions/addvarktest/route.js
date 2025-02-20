import VarkTest from '@models/VarkTest';
import connectDB from '@middleware/database';
import { NextResponse } from 'next/server';

export async function POST(req) {
  // Expecting a JSON payload with class, scale, and questions
  const { class: classNum, scale, questions } = await req.json();

  await connectDB();

  // Check if a VARK test for this class already exists
  const existingTest = await VarkTest.findOne({ class: classNum });
  if (existingTest) {
    return new Response(
      JSON.stringify({ success: false, message: 'Test for this class already exists.' }),
      { status: 400 }
    );
  }

  // Create and save a new VARK test document
  const newTest = new VarkTest({
    class: classNum,
    scale,
    questions, // questions should follow the VarkQuestionSchema structure
  });

  await newTest.save();

  return NextResponse.json({ success: true, message: "Test Added Successfully" }, { status: 201 });
}
