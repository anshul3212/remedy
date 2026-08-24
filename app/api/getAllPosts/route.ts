import { verifyAuth } from "@/helper/auth";
import { generateReadUrl } from "@/helper/awsUrl";
import { prisma } from "@/lib/prisma";
import { serialize } from "@/lib/serialize";
import { NextRequest, NextResponse } from "next/server";


/* ================= COMMON CORS HEADERS ================= */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods":
    "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization",
};


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

    const page = Math.max(
      parseInt(searchParams.get("page") || "1"),
      1
    );

    const limit = Math.max(
      parseInt(searchParams.get("limit") || "10"),
      1
    );

    const skip = (page - 1) * limit;

    /* ================= TOTAL POSTS ================= */

    const total = await prisma.posts.count({
      where: {
        is_active: true,
      },
    });

    /* ================= FETCH POSTS ================= */

    const posts = await prisma.posts.findMany({
      where: {
        is_active: true,
      },

      skip,

      take: limit,

      orderBy: {
        created_at: "desc",
      },

      include: {

        /* ================= POST MEDIA ================= */

        post_media: {
          select: {
            id: true,
            media_url: true,
            media_type: true,
          },
        },
      },
    });

    /* ================= FORMAT POSTS ================= */

    const formattedPosts = await Promise.all(
      posts.map(async (post) => ({
        ...post,

        /* ================= POST MEDIA ================= */

        post_media: await Promise.all(
          post.post_media.map(async (media) => ({
            ...media,

            media_url: media.media_url
              ? await generateReadUrl(media.media_url)
              : null,
          }))
        ),  
      }))
    );

    /* ================= PAGINATION ================= */

    const totalPages = Math.ceil(
      total / limit
    );

    return NextResponse.json(
      {
        message: "all posts found",

        post: serialize(formattedPosts),

        pagination: {
          currentPage: page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (err:any) {

    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}