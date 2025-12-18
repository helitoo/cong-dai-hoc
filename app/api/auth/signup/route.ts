import bcrypt from "bcryptjs";
import { createClient } from "@/lib/supabase/server";
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

    // Password hasing

    const passwordHash = bcrypt.hashSync(password, 10);

    // Insert data

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("profile")
      .insert([
        {
          id: `${email
            .split("@")[0]
            .replace(/[^a-zA-Z0-9]/g, "")}-${Math.random()
            .toString(36)
            .substring(2, 8)}`,
          email,
          hashed_password: passwordHash,
          avatar_message: email,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ message: error }, { status: 500 });
    }

    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: err }, { status: 500 });
  }
}
