import VarkTest from '@models/VarkTest';
import connectDB from '@middleware/database';
import { NextResponse } from 'next/server';

export async function POST(req) {
  // Destructure class and questions from the request body.
  // The questions array should follow the VarkQuestionSchema structure.
  const { class: classNum, questions } = await req.json();

  await connectDB();

  // Check if a VARK test for this class already exists
  const existingTest = await VarkTest.findOne({ class: classNum });
  if (existingTest) {
    return new Response(
      JSON.stringify({ success: false, message: 'Test for this class already exists.' }),
      { status: 400 }
    );
  }

  // Create a new VARK test document
  const newTest = new VarkTest({
    class: classNum,
    questions
    // testName will default to "VARK Learning Style Test" as per the schema
  });

  await newTest.save();

  return NextResponse.json({ success: true, message: "Test Added Successfully" }, { status: 201 });
}
