// app/api/questions/get/route.js
import Question from '@models/Question';
import connectDB from '@middleware/database';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const classNum = searchParams.get('selectedClass');
    console.log(classNum)
    await connectDB();

    const questionSet = await Question.findOne({ class: classNum });

    if (!questionSet) {
        return new Response(JSON.stringify({ success: false, message: 'No questions found for this class.' }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true, questionSet }), { status: 200 });
}
