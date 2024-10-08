import Result from '@models/Result';
import connectDB from '@middleware/database';
import { NextResponse } from 'next/server';

export async function GET(req) {
    await connectDB(); // Connect to the database
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    // Fetch posts where post.uniqueId is similar to the provided id
    const result = await Result.find({ uniqueId: id });

    return NextResponse.json(result, { status: 200 }); // Return the posts as JSON response
}
