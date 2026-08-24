

import { verifyAuth } from "@/helper/auth";
import { generateReadUrl } from "@/helper/awsUrl";
import { prisma } from "@/lib/prisma";
import { serialize } from "@/lib/serialize";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
        
          if (!user) {
            return NextResponse.json(
              {
                message: "Unauthorized",
              },
              {
                status: 401,
              }
            );
          }
    /* ================= PAGINATION ================= */

    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    const skip = (page - 1) * limit;

    /* ================= TOTAL USERS ================= */

    const totalUsers = await prisma.users.count();

    /* ================= GET USERS ================= */

    const users = await prisma.users.findMany({
      skip,
      take: limit,

      include: {
        users_profile: {
          select: {
            first_name: true,
            last_name: true,
            profile_image: true,
          },
        },
      },

      orderBy: {
        created_at: "desc",
      },
    });

    /* ================= FORMAT USERS ================= */

    const formattedUsers = await Promise.all(
      users.map(async (user) => ({
        ...user,

        users_profile: {
          ...user.users_profile,

          profile_image: user.users_profile?.profile_image
            ? await generateReadUrl(
                user.users_profile.profile_image
              )
            : null,
        },
      }))
    );

    /* ================= RESPONSE ================= */

    return NextResponse.json(
      {
        message: "all users found",

        users: serialize(formattedUsers),
        totalUsers,

        pagination: {
          totalUsers,
          currentPage: page,
          totalPages: Math.ceil(totalUsers / limit),
          limit,
          hasNextPage: page < Math.ceil(totalUsers / limit),
          hasPrevPage: page > 1,
        },
      },
      {
        status: 200,

        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods":
            "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers":
            "Content-Type, Authorization",
        },
      }
    );
  } catch (err) {

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}