
import { verifyAuth } from "@/helper/auth";
import { prisma } from "@/lib/prisma";
import { serialize } from "@/lib/serialize";
import {
  NextRequest,
  NextResponse,
} from "next/server";

interface BlogMedia {
  id?: bigint;

  media_url?: string | null;
 media_key?: string | null,
  thumbnail_url?: string | null;
  thumbnail_key?: string | null;

  created_at?: Date;

  updated_at?: Date;
}

interface BlogCategory {
  id?: bigint;

  mstr_categories: {
    id?: bigint;

    name?: string;

    [key: string]: any;
  };

  [key: string]: any;
}

interface Blog {
  id: bigint;

  uuid: string;

  type: "BLOG" | "NEWS" | string;

  title: string;

  description: string;

  read_time: number;

  status:
    | "DRAFT"
    | "PUBLISHED"
    | string;

  created_at: Date;

  updated_at: Date;

  blog_categories: BlogCategory[];

  blog_media: BlogMedia[];
}

/* ================= CORS ================= */

const corsHeaders = {
  "Access-Control-Allow-Origin":
    "*",

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

/* ================= GET BLOGS ================= */

export async function GET(
  req: NextRequest
) {
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
    const { searchParams } =
      new URL(req.url);

    const page = parseInt(
      searchParams.get("page") || "1"
    );

    const limit = parseInt(
      searchParams.get("limit") || "10"
    );

    const skip = (page - 1) * limit;

    /* ================= TOTAL BLOGS ================= */

    const total =
      await prisma.blogs.count();

    /* ================= GET BLOGS ================= */

    const blogs =
      await prisma.blogs.findMany({
        skip,

        take: limit,

        orderBy: {
          updated_at: "desc",
        },

        include: {
          blog_categories: {
            select: {
              mstr_categories: {
                select:{
                  name:true
                }
              },
            },
          },
        },
      });

    /* ================= RESPONSE ================= */

    return NextResponse.json(
      {
        message: "all blogs found",

        blogs: serialize(
          blogs
        ),

        pagination: {
          currentPage: page,

          limit,

          total,

          totalPages: Math.ceil(
            total / limit
          ),

          hasNextPage:
            page <
            Math.ceil(
              total / limit
            ),

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