// app/api/questions/intelligence/add/route.js
import Question from '@models/MITest';
import connectDB from '@middleware/database';

export async function POST(req) {
    const { class: classNum, intelligenceType, questions } = await req.json();

    await connectDB();

    // Find the existing question set by class
    const questionSet = await Question.findOne({ class: classNum });

    if (!questionSet) {
        return new Response(JSON.stringify({ success: false, message: 'Questions for this class not found.' }), { status: 404 });
    }

    // Check if the intelligence type already exists
    const intelligenceExists = questionSet.intelligences.some(
        (intel) => intel.intelligenceType === intelligenceType
    );

    if (intelligenceExists) {
        return new Response(JSON.stringify({ success: false, message: 'Intelligence type already exists for this class.' }), { status: 400 });
    }

    // Add the new intelligence type with its questions
    questionSet.intelligences.push({ intelligenceType, questions });

    // Save the updated question set
    await questionSet.save();

    return new Response(JSON.stringify({ success: true, message: 'New intelligence added successfully.', questionSet }), { status: 200 });
}
