import { verifyAuth } from "@/helper/auth";
import { prisma } from "@/lib/prisma";
import { serialize } from "@/lib/serialize";
import { blog_type } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

/* ================= CORS ================= */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
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

/* ================= GET BLOGS ================= */

export async function GET(req: NextRequest) {
  try {
    /* ================= AUTH ================= */

    const user = await verifyAuth(req);

    if (!user) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
          headers: corsHeaders,
        }
      );
    }

    /* ================= QUERY PARAMS ================= */

    const { searchParams } = new URL(req.url);

    const page = Math.max(
      1,
      parseInt(searchParams.get("page") || "1")
    );

    const limit = Math.max(
      1,
      parseInt(searchParams.get("limit") || "10")
    );

    const typeParam = searchParams.get("type");

    /* ================= VALIDATE TYPE ================= */

    const validTypes = Object.values(blog_type);

    const type = typeParam
      ? typeParam.trim().replace(/^["']|["']$/g, "").toUpperCase()
      : null;

    if (type && !validTypes.includes(type as blog_type)) {
      return NextResponse.json(
        {
          message: "Invalid blog type",
          allowedTypes: validTypes,
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    const skip = (page - 1) * limit;

    /* ================= TYPE FILTER ================= */

    const where = type
      ? {
          type: type as blog_type,
        }
      : {};

    /* ================= TOTAL BLOGS ================= */

    const total = await prisma.blogs.count({
      where,
    });

    /* ================= GET BLOGS ================= */

    const blogs = await prisma.blogs.findMany({
      where,

      skip,

      take: limit,

      orderBy: {
        updated_at: "desc",
      },

      include: {
        blog_categories: {
          select: {
            mstr_categories: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    /* ================= PAGINATION ================= */

    const totalPages = Math.ceil(total / limit);

    /* ================= RESPONSE ================= */

    return NextResponse.json(
      {
        message: type
          ? `${type} blogs found`
          : "all blogs found",

        blogs: serialize(blogs),

        pagination: {
          currentPage: page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },

        filter: {
          category: type,
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
        message: "Internal Server Error",
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}