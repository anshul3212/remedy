import { generateReadUrl } from "@/helper/awsUrl";
import { prisma } from "@/lib/prisma";
import { serialize } from "@/lib/serialize";
import {
  NextRequest,
  NextResponse,
} from "next/server";

interface BlogMedia {
  id?: bigint;

  media_url?: string | null;

  media_key?: string | null;

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

/* ================= GET BLOG BY UUID ================= */

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      uuid: string;
    }>;
  }
) {
  try {
    const { uuid } =
      await params;

    /* ================= FIND BLOG ================= */

    const blog =
      await prisma.blogs.findFirst({
        where: {
          uuid: uuid,
        },

        include: {
          blog_categories: {
            include: {
              mstr_categories: true,
            },
          },

          blog_media: true,
        },
      });

    /* ================= NOT FOUND ================= */

    if (!blog) {
      return NextResponse.json(
        {
          message:
            "Blog not found",
        },
        {
          status: 404,

          headers: corsHeaders,
        }
      );
    }

    /* ================= FORMAT BLOG ================= */

    const formattedBlog = {
      ...blog,

      blog_media:
        await Promise.all(
          blog.blog_media.map(
            async (media) => ({
              ...media,

              media_key:
                media.media_url,

              media_url:
                media.media_url
                  ? await generateReadUrl(
                      media.media_url
                    )
                  : null,

              thumbnail_key:
                media.thumbnail_url,

              thumbnail_url:
                media.thumbnail_url
                  ? await generateReadUrl(
                      media.thumbnail_url
                    )
                  : null,
            })
          )
        ),
    };

    /* ================= RESPONSE ================= */

    return NextResponse.json(
      {
        message:
          "blog found",

        blog: serialize(
          formattedBlog
        ),
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