import { prisma } from "@/lib/prisma";
import { serialize } from "@/lib/serialize";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    /* ================= PAGINATION ================= */

    const { searchParams } = new URL(req.url);

    const page = parseInt(
      searchParams.get("page") || "1"
    );

    const limit = parseInt(
      searchParams.get("limit") || "10"
    );

    const skip = (page - 1) * limit;

    /* ================= TOTAL CHANNELS ================= */

    const totalChannels =
      await prisma.channels.count();

    /* ================= GET CHANNELS ================= */

    const channels = await prisma.channels.findMany({
      skip,
      take: limit,

      include: {
    
        _count: {
          select: {
            posts: true,
          },
        },

        channel_categories: {
          select: {
            id: true,
            category: true,
          },
        },

        users: {
          select: {
            users_profile: {
              select: {
                user_name: true,
              },
            },
          }, 
        },
      },

      orderBy: {
        id: "asc",
      },
    });

    /* ================= RESPONSE ================= */

    return NextResponse.json(
      {
        message: "all channels found",

        channels: serialize(
          channels
        ),

        pagination: {
          totalChannels,

          currentPage: page,

          totalPages: Math.ceil(
            totalChannels / limit
          ),

          limit,

          hasNextPage:
            page <
            Math.ceil(
              totalChannels / limit
            ),

          hasPrevPage: page > 1,
        },
      },

      {
        status: 200,

        headers: {
          "Access-Control-Allow-Origin":
            "*",

          "Access-Control-Allow-Methods":
            "GET, POST, PUT, DELETE, OPTIONS",

          "Access-Control-Allow-Headers":
            "Content-Type, Authorization",
        },
      }
    );
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        message: "Internal Server Error",

        error:
          err instanceof Error
            ? err.message
            : "Unknown Error",
      },

      {
        status: 500,

        headers: {
          "Access-Control-Allow-Origin":
            "*",

          "Access-Control-Allow-Methods":
            "GET, POST, PUT, DELETE, OPTIONS",

          "Access-Control-Allow-Headers":
            "Content-Type, Authorization",
        },
      }
    );
  }
}