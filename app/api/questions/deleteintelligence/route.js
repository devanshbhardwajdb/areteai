// app/api/questions/intelligence/delete/route.js
import Question from '@models/MITest';
import connectDB from '@middleware/database';

export async function DELETE(req) {
    const { class: classNum, intelligenceType } = await req.json();

    await connectDB();

    // Find the existing question set by class
    const questionSet = await Question.findOne({ class: classNum });

    if (!questionSet) {
        return new Response(JSON.stringify({ success: false, message: 'Questions for this class not found.' }), { status: 404 });
    }

    // Find the index of the intelligence type to delete
    const intelligenceIndex = questionSet.intelligences.findIndex(
        (intel) => intel.intelligenceType === intelligenceType
    );

    if (intelligenceIndex === -1) {
        return new Response(JSON.stringify({ success: false, message: 'Intelligence type not found.' }), { status: 404 });
    }

    // Remove the intelligence type from the array
    questionSet.intelligences.splice(intelligenceIndex, 1);

    // Save the updated question set
    await questionSet.save();

    return new Response(JSON.stringify({ success: true, message: 'Intelligence type deleted successfully.', questionSet }), { status: 200 });
}
