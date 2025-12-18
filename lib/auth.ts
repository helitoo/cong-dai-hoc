import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function checkAuth(id?: string): Promise<boolean> {
  const cookieStore = await cookies();
  const access = cookieStore.get("access_token")?.value;

  if (!access) return false;

  try {
    const payload = jwt.verify(access, process.env.JWT_SECRET!) as any;
    return id ? payload.id === id : true;
  } catch {
    return false;
  }
}

export async function getId(): Promise<string> {
  if (!(await checkAuth())) return "";

  const cookieStore = await cookies();
  const access = cookieStore.get("access_token")?.value;

  if (!access) return "";

  try {
    const payload = jwt.verify(access, process.env.JWT_SECRET!) as any;
    return payload.id;
  } catch {
    return "";
  }
}
