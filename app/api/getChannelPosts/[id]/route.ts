import { verifyAuth } from "@/helper/auth";
import { generateReadUrl } from "@/helper/awsUrl";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/* ================= COMMON CORS HEADERS ================= */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods":
    "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization",
};

/* ================= OPTIONS ================= */

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: corsHeaders,
    }
  );
}

/* ================= GET CHANNEL POST MEDIA ================= */

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    /* ================= AUTH ================= */

    const user = await verifyAuth(req);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
          headers: corsHeaders,
        }
      );
    }

    /* ================= CHANNEL ID ================= */

    const { id } = await context.params;

    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid channel ID",
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    const channelId = BigInt(id);

    /* ================= PAGINATION ================= */

    const { searchParams } = new URL(req.url);

    const page = Math.max(
      parseInt(searchParams.get("page") || "1"),
      1
    );

    const limit = Math.max(
      parseInt(searchParams.get("limit") || "10"),
      1
    );

    const skip = (page - 1) * limit;

    /* ================= CHANNEL CHECK ================= */

    const channel = await prisma.channels.findUnique({
      where: {
        id: channelId,
      },
      select: {
        id: true,
      },
    });

    if (!channel) {
      return NextResponse.json(
        {
          success: false,
          message: "Channel not found",
        },
        {
          status: 404,
          headers: corsHeaders,
        }
      );
    }

    /* ================= GET CHANNEL POSTS ================= */

    const posts = await prisma.posts.findMany({
      where: {
        channel_id: channelId,
        is_active:true
      },

      skip,

      take: limit,

      orderBy: {
        created_at: "desc",
      },

      select: {
        id: true,

        total_likes: true,

        total_comments: true,

        post_media: {
          select: {
            id: true,
            media_url: true,
          },
        },
      },
    });

    /* ================= FORMAT POSTS ================= */

    const formattedPosts = await Promise.all(
      posts.map(async (post) => ({
        id: post.id.toString(),

        total_likes:
          post.total_likes !== null &&
          post.total_likes !== undefined
            ? Number(post.total_likes)
            : 0,

        total_comments:
          post.total_comments !== null &&
          post.total_comments !== undefined
            ? Number(post.total_comments)
            : 0,

        post_media: await Promise.all(
          post.post_media.map(async (media) => ({
            id: media.id.toString(),

            media_url: await generateReadUrl(
              media.media_url
            ),
          }))
        ),
      }))
    );

    /* ================= TOTAL POSTS ================= */

    const totalPosts = await prisma.posts.count({
      where: {
        channel_id: channelId,
        is_active:true
      },
    });

    const totalPages = Math.ceil(
      totalPosts / limit
    );

    const hasNextPage = page < totalPages;

    /* ================= RESPONSE ================= */

    return NextResponse.json(
      {
        success: true,

        message: "Channel post media found",

        posts: formattedPosts,

        pagination: {
          page,
          limit,

          totalPosts,

          totalPages,

          hasNextPage,

          count: formattedPosts.length,
        },
      },
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (err) {

    return NextResponse.json(
      {
        success: false,

        message: "Internal Server Error",

        error:
          err instanceof Error
            ? err.message
            : "Unknown Error",
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}