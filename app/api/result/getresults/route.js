import Result from '@models/Result';
import connectDB from '@middleware/database';
import { NextResponse } from 'next/server';

export async function GET(req) {
    await connectDB(); // Connect to the database
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    

    // Fetch posts where post.uniqueId is similar to the provided id
    const results = await Result.find({ email: email });

    return NextResponse.json(results, { status: 200 }); // Return the posts as JSON response
}
