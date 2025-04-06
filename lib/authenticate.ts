// Import the necessary types from next/server and your custom types
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { RequestCookies } from 'next/server'; // Import custom types from next.d.ts

export async function authenticate(req: NextRequest) {
  // Ensure TypeScript knows about the `token` property in cookies
  const token = (req.cookies as RequestCookies).token;

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Verify the token (make sure you use the correct JWT_SECRET here)
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded as { userId: string; email: string }; // Attach the user info to the request

    return null; // Return null if authenticated
  } catch (error) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }
}
