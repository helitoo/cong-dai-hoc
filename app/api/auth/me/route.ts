import { checkAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const isAuth = await checkAuth();

  if (isAuth) return NextResponse.json({ message: "OK" }, { status: 200 });
  else return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
}
