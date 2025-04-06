// app/api/auth/logout/route.ts

import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Clear the token cookie by setting Max-Age to 0
    const response = NextResponse.json({ message: 'Logout successful' });
    response.cookies.set('token', '', { maxAge: 0, path: '/' }); // Expire the cookie immediately

    return response; // Send success response
  } catch (error) {
    console.error('Error during logout:', error);
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}
