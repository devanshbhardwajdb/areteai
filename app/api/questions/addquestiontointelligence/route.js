// app/api/questions/intelligence/questions/add/route.js
import Question from '@models/Question';
import connectDB from '@middleware/database';

export async function POST(req) {
    const { class: classNum, intelligenceType, questions } = await req.json();

    await connectDB();

    // Find the existing question set by class
    const questionSet = await Question.findOne({ class: classNum });

    if (!questionSet) {
        return new Response(JSON.stringify({ success: false, message: 'Questions for this class not found.' }), { status: 404 });
    }

    // Find the specific intelligence type object within the array
    const intelligenceIndex = questionSet.intelligences.findIndex(
        (intel) => intel.intelligenceType === intelligenceType
    );

    if (intelligenceIndex === -1) {
        return new Response(JSON.stringify({ success: false, message: 'Intelligence type not found.' }), { status: 404 });
    }

    // Add new questions to the existing intelligence type's questions array
    questionSet.intelligences[intelligenceIndex].questions.push(...questions);

    // Save the updated question set
    await questionSet.save();

    return new Response(JSON.stringify({ success: true, message: 'Questions added successfully.', questionSet }), { status: 200 });
}
