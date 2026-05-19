

import { generateReadUrl } from "@/helper/awsUrl";
import { prisma } from "@/lib/prisma";
import { serialize } from "@/lib/serialize";
import { NextRequest, NextResponse } from "next/server";

/* ================= COMMON CORS HEADERS ================= */

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

/* ================= GET POST BY ID ================= */

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
 
    const post = await prisma.posts.findUnique({
      where: {
        id: BigInt(id),
      },

      include: {
        /* ================= POST OWNER ================= */

        users: {
          select: {
            id: true,
            email_id: true,
            users_profile: {
              select: {
                user_name: true,
                first_name: true,
                last_name: true,
                profile_image: true,
              },
            },
          },
        },

        /* ================= CHANNEL DETAILS ================= */

        channels: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },

        /* ================= POST MEDIA ================= */

        post_media: {
          select: {
            id: true,
            media_url: true,
            media_type: true,
          },
        },

        /* ================= COMMENTS ================= */

        comments: {
          include: {
            users: {
              select: {
                id: true,
                email_id: true,
                users_profile: {
                  select: {
                    user_name: true,
                    first_name: true,
                    last_name: true,
                    profile_image: true,
                  },
                },
              },
            },

            comment_reports: {
              include: {
                users: {
                  select: {
                    id: true,
                    email_id: true,
                    users_profile: {
                      select: {
                        user_name: true,
                        first_name: true,
                        last_name: true,
                        profile_image: true,
                      },
                    },
                  },
                },
              },
            },

            _count: {
              select: {
                comment_reports: true,
              },
            },
          },
        },

        /* ================= POST REPORTS ================= */

        post_reports: {
          include: {
            users: {
              select: {
                id: true,
                email_id: true,
                users_profile: {
                  select: {
                    user_name: true,
                    first_name: true,
                    last_name: true,
                    profile_image: true,
                  },
                },
              },
            },
          },
        },

        /* ================= COUNTS ================= */

        _count: {
          select: {
            post_reports: true,
          },
        },
      },
    });

    /* ================= NOT FOUND ================= */

    if (!post) {
      return NextResponse.json(
        { message: "Post not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    /* ================= FORMAT POST ================= */

    const formattedPost = {
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

      /* ================= POST OWNER PROFILE ================= */

      users: {
        ...post.users,
        users_profile: post.users.users_profile
          ? {
              ...post.users.users_profile,
              profile_image: post.users.users_profile.profile_image
                ? await generateReadUrl(
                    post.users.users_profile.profile_image
                  )
                : null,
            }
          : null,
      },

      /* ================= COMMENTS (WITH REPORTS ENHANCED) ================= */

      comments: await Promise.all(
        post.comments.map(async (comment) => ({
          ...comment,

          users: {
            ...comment.users,
            users_profile: comment.users.users_profile
              ? {
                  ...comment.users.users_profile,
                  profile_image: comment.users.users_profile.profile_image
                    ? await generateReadUrl(
                        comment.users.users_profile.profile_image
                      )
                    : null,
                }
              : null,
          },

          /* ================= COMMENT REPORTS ================= */

          comment_reports: await Promise.all(
            comment.comment_reports.map(async (report) => ({
              id: report.id,
              reason: report.reason ?? null,

              created_at: report.created_at ?? null, // 👈 date reported

              users: {
                id: report.users.id,
                email_id: report.users.email_id,

                users_profile: report.users.users_profile
                  ? {
                      user_name:
                        report.users.users_profile.user_name ?? null, // 👈 username
                      first_name:
                        report.users.users_profile.first_name ?? null,
                      last_name:
                        report.users.users_profile.last_name ?? null,

                      profile_image: report.users.users_profile.profile_image
                        ? await generateReadUrl(
                            report.users.users_profile.profile_image
                          )
                        : null,
                    }
                  : null,
              },
            }))
          ),
        }))
      ),

      /* ================= POST REPORTS ================= */

      post_reports: await Promise.all(
        post.post_reports.map(async (report) => ({
          ...report,

          users: {
            ...report.users,
            users_profile: report.users.users_profile
              ? {
                  ...report.users.users_profile,
                  profile_image: report.users.users_profile.profile_image
                    ? await generateReadUrl(
                        report.users.users_profile.profile_image
                      )
                    : null,
                }
              : null,
          },
        }))
      ),
    };

    /* ================= RESPONSE ================= */

    return NextResponse.json(
      {
        message: "post found",
        post: serialize(formattedPost),
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
        message: "Internal Server Error",
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}