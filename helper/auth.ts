import { appConfig } from "@/config/app";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

interface AuthUser {
  user_id: string;

  email_id: string;
}

export async function verifyAuth(
  req: NextRequest
): Promise<AuthUser | null> {
  try {
    const authHeader =
      req.headers.get("authorization");

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return null;
    }

    const token =
      authHeader.split(" ")[1];

    if (
      !token ||
      token === "undefined" ||
      token === "null"
    ) {
      return null;
    }

    const decoded = jwt.verify(
      token,
      appConfig.auth.jwtSecret
    ) as AuthUser;

    return decoded;
  } catch (error) {

    return null;
  }
}