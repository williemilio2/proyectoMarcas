import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function getUser() {

  const cookieStore = await cookies()


    const token =
      cookieStore.get("accountToken")?.value
  if (!token) {
          console.log("No hay toqen");
    return null;
  }

  try {
          console.log("si hay toqen");

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as jwt.JwtPayload;

    return {
      id: decoded.id,
      email: decoded.email,
    };

  } catch {

    return null;

  }
}