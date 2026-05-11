import { generateReadUrl } from "@/helper/awsUrl";
import { prisma } from "@/lib/prisma";
import { serialize } from "@/lib/serialize";
import { NextResponse } from "next/server";

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
    },
  );
}

/* ================= GET REPORTED POSTS + COMMENTS ================= */

export async function GET() {
  try {
    /* ================= TRANSACTION ================= */

    const [reportedPosts, reportedComments] =
  await Promise.all([
    prisma.posts.findMany({
      where: {
        post_reports: {
          some: {},
        },
        is_active: true,
      },

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

        channels: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },

        post_media: {
          select: {
            id: true,
            media_url: true,
            media_type: true,
          },
        },

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

        _count: {
          select: {
            post_reports: true,
          },
        },
      },
    }),

    prisma.comments.findMany({
      where: {
        comment_reports: {
          some: {},
        },
      },

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

        posts: {
          select: {
            id: true,
            title: true,
            description: true,
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
    }),
  ]);

    /* ================= FORMAT POSTS ================= */

    const formattedPosts = await Promise.all(
      reportedPosts.map(async (post) => ({
        ...post,

        /* ================= POST MEDIA ================= */

        post_media: await Promise.all(
          post.post_media.map(async (media) => ({
            ...media,

            media_url: media.media_url
              ? await generateReadUrl(media.media_url)
              : null,
          })),
        ),

        /* ================= POST OWNER PROFILE ================= */

        users: {
          ...post.users,

          users_profile: post.users.users_profile
            ? {
                ...post.users.users_profile,

                profile_image: post.users.users_profile.profile_image
                  ? await generateReadUrl(
                      post.users.users_profile.profile_image,
                    )
                  : null,
              }
            : null,
        },

        /* ================= REPORT USERS PROFILE ================= */

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
                          report.users.users_profile.profile_image,
                        )
                      : null,
                  }
                : null,
            },
          })),
        ),
      })),
    );

    /* ================= FORMAT COMMENTS ================= */

    const formattedComments = await Promise.all(
      reportedComments.map(async (comment) => ({
        ...comment,

        /* ================= COMMENT OWNER PROFILE ================= */

        users: {
          ...comment.users,

          users_profile: comment.users.users_profile
            ? {
                ...comment.users.users_profile,

                profile_image: comment.users.users_profile.profile_image
                  ? await generateReadUrl(
                      comment.users.users_profile.profile_image,
                    )
                  : null,
              }
            : null,
        },

        /* ================= REPORT USERS PROFILE ================= */

        comment_reports: await Promise.all(
          comment.comment_reports.map(async (report) => ({
            ...report,

            users: {
              ...report.users,

              users_profile: report.users.users_profile
                ? {
                    ...report.users.users_profile,

                    profile_image: report.users.users_profile.profile_image
                      ? await generateReadUrl(
                          report.users.users_profile.profile_image,
                        )
                      : null,
                  }
                : null,
            },
          })),
        ),
      })),
    );

    /* ================= RESPONSE ================= */

    return NextResponse.json(
      {
        message: "all reported posts and comments found",

        data: {
          posts: serialize(formattedPosts),
          comments: serialize(formattedComments),
        },
      },
      {
        status: 200,
        headers: corsHeaders,
      },
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
      },
    );
  }
}
