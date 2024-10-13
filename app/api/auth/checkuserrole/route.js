import User from '@models/User';
import connectDB from '@middleware/database';
import { NextResponse } from 'next/server';

export async function GET(req) {
    await connectDB(); // Connect to the database
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');



    // Fetch posts where post.uniqueId is similar to the provided id
    const result = await User.find({ username });
    

    if (result[0].role === 'admin') {
        return NextResponse.json({ success: true });
    }


    return NextResponse.json({ sucess: false }); // Return the posts as JSON response
}
