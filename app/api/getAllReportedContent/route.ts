import { prisma } from "@/lib/prisma";
import { serialize } from "@/lib/serialize";
import { NextRequest, NextResponse } from "next/server";

/* ================= CORS HEADERS ================= */

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

/* ================= GET REPORTED CONTENT ================= */

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

    /* ================= FETCH POSTS ================= */

    const reportedPosts =
      await prisma.posts.findMany({
        where: {
          post_reports: {
            some: {},
          },

          is_active: true,
        },

        select: {
          id: true,
          title: true,
          created_at: true,
          _count: {
            select: {
              post_reports: true,
            },
          },
        },
      });

    /* ================= FETCH COMMENTS ================= */

    const reportedComments =
      await prisma.comments.findMany({
        where: {
          comment_reports: {
            some: {},
          },
        },

        select: {
          id: true,
          comment: true,
          created_at: true,
          post_id:true,
          _count: {
            select: {
              comment_reports: true,
            },
          },
        },
      });

    /* ================= FORMAT POSTS ================= */

    const formattedPosts =
      reportedPosts.map((post) => ({
        id: post.id,

        type: "POST",

        content: post.title,

        created_at: post.created_at,

        reportsCount:
          post._count.post_reports,
      }));

    /* ================= FORMAT COMMENTS ================= */

    const formattedComments =
      reportedComments.map((comment) => ({
        id: comment.id,

        type: "COMMENT",

        post_id : comment.post_id,

        content: comment.comment,

        created_at: comment.created_at,


        reportsCount:
          comment._count
            .comment_reports,
      }));

    /* ================= MERGE + SORT ================= */

    const mergedData = [
      ...formattedPosts,
      ...formattedComments,
    ].sort(
      (a, b) =>
        new Date(
          b.created_at
        ).getTime() -
        new Date(
          a.created_at
        ).getTime()
    );

    /* ================= PAGINATION ================= */

    const total = mergedData.length;

    const totalPages = Math.ceil(
      total / limit
    );

    const startIndex =
      (page - 1) * limit;

    const paginatedData =
      mergedData.slice(
        startIndex,
        startIndex + limit
      );

    /* ================= RESPONSE ================= */

    return NextResponse.json(
      {
        message:
          "all reported content found",

        data: serialize(
          paginatedData
        ),

        pagination: {
          currentPage: page,

          limit,

          total,

          totalPages,

          hasNextPage:
            page < totalPages,

          hasPrevPage:
            page > 1,
        },
      },
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        message:
          "Internal Server Error",
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}