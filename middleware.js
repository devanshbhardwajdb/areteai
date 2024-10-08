import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function middleware(req) {
    const cookieStore = cookies();

    const token = cookieStore.get('token')?.value; // Get token from cookies



  if (!token) {
    return NextResponse.next(); // No token, continue without modifying the request
  }

  // Attach the token as-is to request headers
  const headers = new Headers(req.headers);
  headers.set('x-token', token); // Add the token to the headers

  // Pass the token along for verification in the API routes
  return NextResponse.next({
    req: {
      headers,
    },
  });
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)', // Apply middleware to all paths except API, static files, etc.
};
