import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const res = NextResponse.json({ message: "OK" }, { status: 200 });

  res.cookies.set("access_token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  res.cookies.set("refresh_token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  return res;
}
