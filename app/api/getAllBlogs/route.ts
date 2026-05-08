import { generateReadUrl } from "@/helper/awsUrl";
import { prisma } from "@/lib/prisma";
import { serialize } from "@/lib/serialize";
import { NextResponse } from "next/server";

interface BlogMedia {
  id?: bigint;
  media_url: string;
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

  type: "BLOG" | "NEWS" | string; // replace with your enum values

  title: string;
  description: string;

  read_time: number;

  status: "DRAFT" | "PUBLISHED" | string; // replace with your enum values

  created_at: Date;
  updated_at: Date;

  blog_categories: BlogCategory[];
  blog_media: BlogMedia[];
}
export async function GET() {
  try {
    const blogs = await prisma.blogs.findMany({
      include: {
        blog_categories: {
          include: {
            mstr_categories: true,
          },
        },
        blog_media: true,
      },
    });

    const formattedBlogs = await Promise.all(
      blogs.map(async (blog: Blog) => ({
        ...blog,

        blog_media: await Promise.all(
          blog.blog_media.map(async (media) => ({
            ...media,

            media_url: await generateReadUrl(media.media_url),
          }))
        ),
      }))
    );
    return NextResponse.json(
      { message: "all blogs found", blogs: serialize(formattedBlogs) },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
