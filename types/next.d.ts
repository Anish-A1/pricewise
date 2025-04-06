// types/next.d.ts

import { NextRequest } from 'next/server';

declare module 'next/server' {
  interface NextRequest {
    user?: { userId: string; email: string };  // Adding user data from JWT
  }

  interface RequestCookies {
    token?: string;  // Define the 'token' property in RequestCookies
  }
}
