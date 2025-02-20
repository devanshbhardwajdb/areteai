import VarkTest from '@models/VarkTest';
import connectDB from '@middleware/database';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const classNum = searchParams.get('selectedClass');
  await connectDB();

  const questionSet = await VarkTest.findOne({ class: classNum });
  if (!questionSet) {
    return new Response(
      JSON.stringify({ success: false, message: 'No questions found for this class.' }),
      { status: 404 }
    );
  }

  return new Response(JSON.stringify({ success: true, questionSet }), { status: 200 });
}
