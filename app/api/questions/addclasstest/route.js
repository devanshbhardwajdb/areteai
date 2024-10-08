// app/api/questions/create/route.js
import Question from '@models/Question';
import connectDB from '@middleware/database';

export async function POST(req) {
    const { class: classNum, scale, intelligences } = await req.json();

    await connectDB();

    // Check if a question set already exists for the class
    const existingClassQuestions = await Question.findOne({ class: classNum });

    if (existingClassQuestions) {
        return new Response(JSON.stringify({ success: false, message: 'Questions for this class already exist.' }), { status: 400 });
    }

    // Create a new question set for the class with multiple intelligences
    const newQuestionSet = new Question({
        class: classNum,
        scale,
        intelligences // This should now be an array of intelligence types and their respective questions
    });

    await newQuestionSet.save();

    return new Response(JSON.stringify({ success: true, message: 'Questions added successfully.' }), { status: 200 });
}
