import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "@/lib/types/profile/profile";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Validate

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 400 }
      );
    }

    // Fetch data

    const supabase = await createClient();

    const { data: user, error } = await supabase
      .from("profile")
      .select("id, hashed_password, avatar_variant, avatar_message")
      .eq("email", email)
      .single();

    if (!user) {
      return NextResponse.json({ message: "Invalid user" }, { status: 401 });
    }

    if (error) {
      return NextResponse.json({ message: error }, { status: 500 });
    }

    // Validate

    const isValid = bcrypt.compareSync(password, user.hashed_password);
    if (!isValid) {
      return NextResponse.json({ message: "Invalid user" }, { status: 401 });
    }

    // Create JWT

    const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "5m",
    });

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_SECRET!,
      {
        expiresIn: "10m",
      }
    );

    const res = NextResponse.json(
      {
        message: "OK",
        payload: {
          id: user.id,
          avatar: {
            variant: user.avatar_variant,
            message: user.avatar_message,
          },
        } as Metadata,
      },
      { status: 200 }
    );

    // Create cookie

    res.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 5 * 60, // 15 m
    });

    res.cookies.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 10 * 60, // 90 * 24 * 60 * 60, // 90 days
    });

    return res;
  } catch (err) {
    return NextResponse.json({ message: err }, { status: 500 });
  }
}
