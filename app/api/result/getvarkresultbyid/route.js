import VARKResult from '@models/VarkResult';
import connectDB from '@middleware/database';
import { NextResponse } from 'next/server';

export async function GET(req) {
    await connectDB(); // Connect to the database
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    // Fetch VARK test results where uniqueId matches the provided id
    const result = await VARKResult.find({ uniqueId: id });

    return NextResponse.json(result, { status: 200 }); // Return the results as JSON response
}
