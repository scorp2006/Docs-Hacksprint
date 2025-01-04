import { NextResponse } from 'next/server';

export function middleware(req) {
    // Allow all routes without authentication
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next).*)'], // Apply to all routes except API and Next.js internals
};