// middleware.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export function middleware(req) {
    console.log(req);

    const url = req.nextUrl.clone();
    const cookieStore = cookies(); // Access cookies

    // Get the JWT token from cookies
    const token = cookieStore.get('jwt');

    // If there's no token and the user is not on the login page
    if (!token && url.pathname !== '/sign-in') {
        // Redirect the user to the login page
        url.pathname = '/sign-in';
        return NextResponse.redirect(url);
    }

    // Continue to the requested page
    return NextResponse.next();
}

// Define paths that require protection
export const config = {
    matcher: ['/dashboard'],
};
