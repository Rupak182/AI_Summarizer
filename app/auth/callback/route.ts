import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development'
      let redirectUrl = `${origin}${next}`; // Default to origin

      if (!isLocalEnv) {
        // In production, prioritize HTTPS and forwarded host
        if (forwardedHost) {
          redirectUrl = `https://${forwardedHost}${next}`;
        } else {
          // If no forwarded host, ensure HTTPS and use origin's host
          try {
            const originUrl = new URL(origin);
            redirectUrl = `https://${originUrl.host}${next}`;
          } catch (e) {
            console.error("Failed to parse origin URL:", e);
            // Fallback to origin if parsing fails, though this might still be http://localhost
            redirectUrl = `${origin}${next}`;
          }
        }
      }
      // In development, use the original origin (http://localhost)
      // In production, use the constructed secure redirectUrl
      return NextResponse.redirect(redirectUrl);
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
