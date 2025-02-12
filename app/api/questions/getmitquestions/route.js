// app/api/questions/get/route.js
import MITest from '@models/MITest';
import connectDB from '@middleware/database';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const classNum = searchParams.get('selectedClass');
    // console.log(classNum)
    await connectDB();

    const questionSet = await MITest.findOne({ class: classNum });

    if (!questionSet) {
        return new Response(JSON.stringify({ success: false, message: 'No questions found for this class.' }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true, questionSet }), { status: 200 });
}
