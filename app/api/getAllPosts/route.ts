// import { verifyAuth } from "@/helper/auth";
// import { generateReadUrl } from "@/helper/awsUrl";
// import { prisma } from "@/lib/prisma";
// import { serialize } from "@/lib/serialize";
// import { NextRequest, NextResponse } from "next/server";

// /* ================= COMMON CORS HEADERS ================= */

// const corsHeaders = {
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Methods":
//     "GET, POST, PUT, DELETE, OPTIONS",
//   "Access-Control-Allow-Headers":
//     "Content-Type, Authorization",
// };

// /* ================= OPTIONS ================= */

// export async function OPTIONS() {
//   return NextResponse.json(
//     {},
//     {
//       status: 200,
//       headers: corsHeaders,
//     }
//   );
// }

// /* ================= GET REPORTED POSTS ================= */

// export async function GET(req: NextRequest) {
//   try {
//     const user = await verifyAuth(req);
    
//       if (!user) {
//         return NextResponse.json(
//           {
//             message: "Unauthorized",
//           },
//           {
//             status: 401,
//           }
//         );
//       }

//     const posts = await prisma.posts.findMany({
//       where: {
//         is_active: true,
//       },

//       include: {
//         /* ================= POST OWNER ================= */

//         users: {
//           select: {
//             id: true,
//             email_id: true,

//             users_profile: {
//               select: {
//                 user_name: true,
//                 first_name: true,
//                 last_name: true,
//                 profile_image: true,
//               },
//             },
//           },
//         },

//         /* ================= CHANNEL DETAILS ================= */

//         channels: {
//           select: {
//             id: true,
//             name: true,
//             description: true,
//           },
//         },

//         /* ================= POST MEDIA ================= */

//         post_media: {
//           select: {
//             id: true,
//             media_url: true,
//             media_type: true,
//           },
//         },

//         /* ================= ALL REPORTS ================= */

//         post_reports: {
//           include: {
//             users: {
//               select: {
//                 id: true,
//                 email_id: true,

//                 users_profile: {
//                   select: {
//                     user_name: true,
//                     first_name: true,
//                     last_name: true,
//                     profile_image: true,
//                   },
//                 },
//               },
//             },
//           },
//         },

//         /* ================= REPORT COUNT ================= */

//         _count: {
//           select: {
//             post_reports: true,
//           },
//         },
//       },
//     });

//     const formattedPosts = await Promise.all(
//       posts.map(async (post) => ({
//         ...post,

//         /* ================= POST MEDIA ================= */

//         post_media: await Promise.all(
//           post.post_media.map(async (media) => ({
//             ...media,

//             media_url: media.media_url
//               ? await generateReadUrl(media.media_url)
//               : null,
//           }))
//         ),

//         /* ================= POST OWNER PROFILE ================= */

//         users: {
//           ...post.users,

//           users_profile: post.users.users_profile
//             ? {
//                 ...post.users.users_profile,

//                 profile_image:
//                   post.users.users_profile.profile_image
//                     ? await generateReadUrl(
//                         post.users.users_profile.profile_image
//                       )
//                     : null,
//               }
//             : null,
//         },

//         /* ================= REPORT USERS PROFILE ================= */

//         post_reports: await Promise.all(
//           post.post_reports.map(async (report) => ({
//             ...report,

//             users: {
//               ...report.users,

//               users_profile: report.users.users_profile
//                 ? {
//                     ...report.users.users_profile,

//                     profile_image:
//                       report.users.users_profile.profile_image
//                         ? await generateReadUrl(
//                             report.users.users_profile.profile_image
//                           )
//                         : null,
//                   }
//                 : null,
//             },
//           }))
//         ),
//       }))
//     );

//     return NextResponse.json(
//       {
//         message: "all posts found",
//         post: serialize(formattedPosts),
//       },
//       {
//         status: 200,
//         headers: corsHeaders,
//       }
//     );
//   } catch (err) {

//     return NextResponse.json(
//       {
//         message: "Internal Server Error",
//       },
//       {
//         status: 500,
//         headers: corsHeaders,
//       }
//     );
//   }
// }






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