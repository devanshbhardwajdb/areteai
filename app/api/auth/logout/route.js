import { serialize } from 'cookie';
import { NextResponse } from 'next/server';

export async function POST(req) {
    const res = NextResponse.json({ message: 'Logged out successfully' });

    // Clear the JWT cookie
    res.headers.append('Set-Cookie', serialize('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: -1, // Expire immediately
        sameSite: 'strict',
        path: '/',
    }));

    return res;
}
