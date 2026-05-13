
// import { prisma } from "@/lib/prisma";
// import { serialize } from "@/lib/serialize";
// import { NextResponse } from "next/server";

// /* ================= OPTIONS ================= */

// export async function OPTIONS() {
//   return NextResponse.json(
//     {},
//     {
//       status: 200,
//       headers: {
//         "Access-Control-Allow-Origin": "*",
//         "Access-Control-Allow-Methods":
//           "GET, POST, PUT, DELETE, OPTIONS",
//         "Access-Control-Allow-Headers":
//           "Content-Type, Authorization",
//       },
//     }
//   );
// }

// /* ================= GET CHANNELS ================= */

// export async function GET() {
//   try {
//     const channels = await prisma.channels.findMany({
//       include: {
//         posts:true,
//         _count: {
//           select: {
//             posts: true,
//           },
//         },

//         // channel_members: {
//         //   select: {
//         //     users: {
//         //       select: {
//         //         users_profile: {
//         //           select: {
//         //             user_name: true,
//         //           },
//         //         },
//         //       },
//         //     },
//         //   },
//         // },
//       },

//       orderBy: {
//         id: "asc",
//       },
//     });
 
//     return NextResponse.json(
//       {
//         message: "all channels found",
//         channels: serialize(channels),
//       },
//       {
//         status: 200,
//         headers: {
//           "Access-Control-Allow-Origin": "*",
//           "Access-Control-Allow-Methods":
//             "GET, POST, PUT, DELETE, OPTIONS",
//           "Access-Control-Allow-Headers":
//             "Content-Type, Authorization",
//         },
//       }
//     );
//   } catch (err) {
//     console.error(err);

//     return NextResponse.json(
//       {
//         message: "Internal Server Error",
//       },
//       {
//         status: 500,
//         headers: {
//           "Access-Control-Allow-Origin": "*",
//           "Access-Control-Allow-Methods":
//             "GET, POST, PUT, DELETE, OPTIONS",
//           "Access-Control-Allow-Headers":
//             "Content-Type, Authorization",
//         },
//       }
//     );
//   }
// }




// import { generateReadUrl } from "@/helper/awsUrl";
// import { prisma } from "@/lib/prisma";
// import { serialize } from "@/lib/serialize";
// import { NextResponse } from "next/server";


// export async function GET() {
//   try {
//     const channels = await prisma.channels.findMany({
//       include: {
//         posts: true,

//         _count: {
//           select: {
//             posts: true,
//           },
//         },
//       },

//       orderBy: {
//         id: "asc",
//       },
//     });



// //    const updatedChannels = await Promise.all(
// //   channels.map(async (channel) => ({
// //     ...channel,

// //     image: channel.image
// //       ? await generateReadUrl(channel.image)
// //       : null,

// //     posts: await Promise.all(
// //       channel.posts.map(async (post) => ({
// //         ...post,

// //         media_url: post.media_url
// //           ? await generateReadUrl(post.media_url)
// //           : null,
// //       }))
// //     ),
// //   }))
// // );


// const updatedChannels = await Promise.all(
//   channels.map(async (channel) => ({
//     ...channel,

//     image: channel.image
//       ? await generateReadUrl(channel.image)
//       : null,
//   }))
// );

//     return NextResponse.json(
//       {
//         message: "all channels found",
//         channels: serialize(updatedChannels),
//       },
//       {
//         status: 200,
//         headers: {
//           "Access-Control-Allow-Origin": "*",
//           "Access-Control-Allow-Methods":
//             "GET, POST, PUT, DELETE, OPTIONS",
//           "Access-Control-Allow-Headers":
//             "Content-Type, Authorization",
//         },
//       }
//     );
//   } catch (err) {
//     console.error(err);

//     return NextResponse.json(
//       {
//         message: "Internal Server Error",
//       },
//       {
//         status: 500,
//         headers: {
//           "Access-Control-Allow-Origin": "*",
//           "Access-Control-Allow-Methods":
//             "GET, POST, PUT, DELETE, OPTIONS",
//           "Access-Control-Allow-Headers":
//             "Content-Type, Authorization",
//         },
//       }
//     );
//   }
// }


import { generateReadUrl } from "@/helper/awsUrl";
import { prisma } from "@/lib/prisma";
import { serialize } from "@/lib/serialize";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const channels = await prisma.channels.findMany({
      include: {
        posts: true,

        _count: {
          select: {
            posts: true,
          },
        },
        channel_categories:{
          select:{
            id:true,
            category:true
          }
        },
        users:{
          select:{
            users_profile:{
              select:{
                user_name:true
              }
            }
          }
        }
      },

      orderBy: {
        id: "asc",
      },
    });


    const formattedChannels = await Promise.all(
      channels.map(async (channel) => ({
        ...channel,

        image: channel.image
          ? await generateReadUrl(channel.image)
          : null,

        posts: await Promise.all(
          channel.posts.map(async (post: any) => ({
            ...post,

            media_url: post.media_url
              ? await generateReadUrl(post.media_url)
              : null,
          }))
        ),
      }))
    );

    return NextResponse.json(
      {
        message: "all channels found",
        channels: serialize(formattedChannels),
      },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods":
            "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers":
            "Content-Type, Authorization",
        },
      }
    );
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: err instanceof Error ? err.message : "Unknown Error",
      },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods":
            "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers":
            "Content-Type, Authorization",
        },
      }
    );
  }
}