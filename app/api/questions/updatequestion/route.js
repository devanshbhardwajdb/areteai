// app/api/questions/intelligence/update/route.js
import Question from '@models/MITest';
import connectDB from '@middleware/database';

export async function PUT(req) {
    const { class: classNum, selectedIntelligenceType, updatedIntelligenceType, questions } = await req.json();

    await connectDB();

    // Find the existing question set by class
    const questionSet = await Question.findOne({ class: classNum });

    if (!questionSet) {
        return new Response(JSON.stringify({ success: false, message: 'Questions for this class not found.' }), { status: 404 });
    }

    // Find the specific intelligence type object within the array to update
    const intelligenceIndex = questionSet.intelligences.findIndex(
        (intel) => intel.intelligenceType === selectedIntelligenceType
    );

    if (intelligenceIndex === -1) {
        return new Response(JSON.stringify({ success: false, message: 'Intelligence type not found.' }), { status: 404 });
    }

    // Update the intelligence type if provided
    if (updatedIntelligenceType) {
        questionSet.intelligences[intelligenceIndex].intelligenceType = updatedIntelligenceType;
    }

    // Update the questions for the found intelligence type if provided
    if (questions) {
        questionSet.intelligences[intelligenceIndex].questions = questions;
    }

    // Save the updated question set
    await questionSet.save();

    return new Response(JSON.stringify({ success: true, message: 'Questions updated successfully.', questionSet }), { status: 200 });
}
