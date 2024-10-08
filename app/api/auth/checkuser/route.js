import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(req) {
    // Get the 'cookie' header from the request
    const cookieHeader = req.headers.get('cookie');
    
    if (!cookieHeader) {
        return NextResponse.json({ user: null }); // No cookies present, return null
    }

    // Extract the JWT token from the 'cookie' header
    const token = cookieHeader
        .split('; ')
        .find((cookie) => cookie.startsWith('token='))
        ?.split('=')[1];

    if (!token) {
        return NextResponse.json({ user: null }); // No token found in cookies
    }

    try {
        // Verify and decode the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return NextResponse.json({ user: decoded }); // Return the decoded user data
    } catch (err) {
        console.error('JWT verification failed:', err);
        return NextResponse.json({ user: null }); // Token verification failed, return null
    }
}
