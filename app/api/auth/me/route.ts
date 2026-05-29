import { NextResponse } from "next/server";
import { getUser } from "@/src/lib/auth";

export async function GET() {

  const user = await getUser();
console.log("USER:", user)
  if (!user) {
          console.log("Holaaaaaª");

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 401,
      }
    );
  }
          console.log("Adios!");

  return NextResponse.json({
    success: true,
    user,
  });
}