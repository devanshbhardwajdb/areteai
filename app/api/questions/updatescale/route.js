// app/api/questions/scale/update/route.js
import Question from '@models/Question';
import connectDB from '@middleware/database';

export async function PUT(req) {
    try {
        const { class: classNum, scale } = await req.json();

        await connectDB();

        // Find the existing question set by class
        const questionSet = await Question.findOne({ class: classNum });

        if (!questionSet) {
            return new Response(JSON.stringify({ success: false, message: 'Questions for this class not found.' }), { status: 404 });
        }

        // Update the scale if provided
        if (scale !== undefined) {
            questionSet.scale = scale;
        }

        // Save the updated question set
        await questionSet.save();

        return new Response(JSON.stringify({ success: true, message: 'Scale updated successfully.', questionSet }), { status: 200 });
    } catch (error) {
        console.error('Error updating scale:', error);
        return new Response(JSON.stringify({ success: false, message: 'Internal Server Error' }), { status: 500 });
    }
}
