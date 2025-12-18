import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const access = req.cookies.get("access_token")?.value;
  const refresh = req.cookies.get("refresh_token")?.value;

  if (!access || !refresh) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  try {
    // Access token is available
    jwt.verify(access, process.env.JWT_SECRET!);
    return NextResponse.next();
  } catch (err) {
    // Allocate access token
    try {
      const payload = jwt.verify(refresh, process.env.JWT_REFRESH_SECRET!) as {
        id: string;
      };

      const newAccess = jwt.sign({ id: payload.id }, process.env.JWT_SECRET!, {
        expiresIn: "5m",
      });

      const res = NextResponse.next();

      res.cookies.set("access_token", newAccess, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 5 * 60,
      });

      return res;
    } catch (err) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }
  }
}

export const config = {
  matcher: ["/app/user/:path*", "/app/topic/:path*"],
};
