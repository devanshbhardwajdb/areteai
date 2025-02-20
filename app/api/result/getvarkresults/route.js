import { NextResponse } from 'next/server';
import connectDB from '@middleware/database';
import VarkResult from '@/models/VarkResult';

export async function GET(request) {
    try {
        await connectDB(); // Connect to the database
        
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const results = await VarkResult.find({ email: email });
        return NextResponse.json(results);
        
    } catch (error) {
        console.error('Error fetching VARK results:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
