// profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/authenticate'; // Import the authenticate function

export async function GET(req: NextRequest) {
  const authResponse = await authenticate(req); // Ensure this returns a valid response

  // If authentication fails, authResponse will not be null
  if (authResponse) {
    return authResponse; // Return the error response if authentication fails
  }

  // If authenticated, return the profile info
  return NextResponse.json({
    message: 'This is protected profile data',
    user: req.user, // Access the authenticated user data attached to the request
  });
}
