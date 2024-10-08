// app/api/questions/intelligence/questions/delete/route.js
import Question from '@models/Question';
import connectDB from '@middleware/database';

export async function DELETE(req) {
    const { class: classNum, intelligenceType, question } = await req.json();

    await connectDB();

    // Find the existing question set by class
    const questionSet = await Question.findOne({ class: classNum });

    if (!questionSet) {
        return new Response(JSON.stringify({ success: false, message: 'Questions for this class not found.' }), { status: 404 });
    }

    // Find the specific intelligence type
    const intelligence = questionSet.intelligences.find(
        (intel) => intel.intelligenceType === intelligenceType
    );

    if (!intelligence) {
        return new Response(JSON.stringify({ success: false, message: 'Intelligence type not found.' }), { status: 404 });
    }

    // Find the index of the question to delete
    const questionIndex = intelligence.questions.indexOf(question);

    if (questionIndex === -1) {
        return new Response(JSON.stringify({ success: false, message: 'Question not found.' }), { status: 404 });
    }

    // Remove the question from the array
    intelligence.questions.splice(questionIndex, 1);

    // Save the updated question set
    await questionSet.save();

    return new Response(JSON.stringify({ success: true, message: 'Question deleted successfully.', questionSet }), { status: 200 });
}
