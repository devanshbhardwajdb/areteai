import { serialize } from 'cookie';
import { NextResponse } from 'next/server';

export async function POST(req) {
    const res = NextResponse.json({ success: true });
    const domain = process.env.NODE_ENV === 'production' ? 'arete-ai.vercel.app' : 'localhost';
    // Clear the JWT cookie
    res.headers.append('Set-Cookie', serialize('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: -1, // Expire immediately
        sameSite: 'strict',
        path: '/',
        domain: domain,
    }));


    return res;
}
