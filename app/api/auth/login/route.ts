import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { setCookie } from 'nookies';

interface LoginRequestBody {
  email: string;
  password: string;
}

export async function POST(req: NextRequest) {
  try {
    // Connect to the database
    await dbConnect();

    // Get email and password from the request body
    const { email, password }: LoginRequestBody = await req.json();

    // Input validation
    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    // Find user by email (case-insensitive)
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 400 });
    }

    // Compare passwords (hashed password comparison)
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 400 });
    }

    // Ensure JWT_SECRET is set (required for signing the JWT)
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return NextResponse.json({ message: 'JWT_SECRET is not defined' }, { status: 500 });
    }

    // Create JWT token with user's name and email in the payload
    const token = jwt.sign(
      { userId: user._id, email: user.email, name: user.name },
      jwtSecret,
      { expiresIn: '5h' } // Token expires in 1 hour
    );

    // Prepare response with user details and token
    const response = NextResponse.json(
      {
        message: 'Login successful',
        token,
        name: user.name,
        email: user.email
      },
      { status: 200 }
    );

    // Set the token in an HTTP-only cookie (for secure, server-side access)
    setCookie({ res: response }, 'token', token, {
      httpOnly: true,          // Cookie cannot be accessed from JavaScript
      secure: process.env.NODE_ENV === 'production', // Secure cookies only in production
      sameSite: 'Strict',      // Prevent sending cookies in cross-site requests
      maxAge: 60 * 60*5,         // Token expiry in 1 hour
      path: '/',               // Accessible for all routes
    });

    // Return the response
    return response;

  } catch (error) {
    // Handle errors (e.g., database connection issues)
    console.error('Error during login:', error);
    return NextResponse.json(
      { message: 'Error logging in', error: (error as Error).message },
      { status: 500 }
    );
  }
}
