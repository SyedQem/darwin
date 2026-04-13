import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
  // Only redirect to waitlist if the environment variable is actively set
  if (process.env.ENABLE_WAITLIST === 'true') {
    const ALLOWED_PATHS = [
      '/waitlist',
      '/whitelist',
      '/_next',
      '/favicon.ico',
      '/api',
    ];

    const { pathname } = request.nextUrl;
    const isAllowed = ALLOWED_PATHS.some((p) => pathname.startsWith(p));

    if (!isAllowed) {
      return NextResponse.redirect(new URL('/waitlist', request.url));
    }
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({ request });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  try {
    await supabase.auth.getUser();
  } catch {
    return response;
  }
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
