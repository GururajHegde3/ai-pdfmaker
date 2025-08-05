import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Protect only dashboard routes, leave auth pages public
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth().protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|.*\\.(?:svg|ico|png|jpg|jpeg|gif|webp|ttf|woff|woff2|eot|css|js|json)|favicon\\.ico|robots\\.txt|manifest\\.webmanifest|sign-in|sign-up).*)',
    '/(api|trpc)(.*)',
  ],
};
