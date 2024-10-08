import User from '@models/User';
import connectDB from '@middleware/database';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import { NextResponse } from 'next/server';

export async function POST(req) {
    await connectDB(); // Connect to the database
    const { name, email, phone, profilepic } = await req.json();

    // Check if a user already exists with the same phone or email
    const existingUserByPhone = await User.findOne({ phone });
    const existingUserByEmail = await User.findOne({ email });

    // Create JWT payload
    const tokenPayload = { name, email, profilepic, phone };

    // Generate a token
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '5d' });

    // Set token in HTTP-only cookie with domain setting
    const res = NextResponse.json({ success: true });

    // Get the domain from the environment variables (adjust if necessary)
    const domain = process.env.NODE_ENV === 'production' ? 'arete-ai.vercel.app' : 'localhost';

    res.headers.append('Set-Cookie', serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 5 * 24 * 60 * 60, // 5 days
        sameSite: 'strict',
        path: '/',
        domain: domain,  // Set the domain explicitly
    }));

    if (existingUserByPhone || existingUserByEmail) {
        // User already exists, just send success response
        return res;
    }

    // If user does not exist, create a new user
    let newUser = new User({
        name,
        email,
        profilepic,
        phone,
        role: email === process.env.ADMIN_EMAIL ? 'admin' : 'user',
    });
    await newUser.save();

    return res;
}
