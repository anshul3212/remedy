import { prisma } from "@/lib/prisma";
import { serialize } from "@/lib/serialize";
import { NextResponse } from "next/server";

export async function GET() {
  try {

   
//     const channels = await prisma.channels.findMany({
//   include: {
//     channel_members: {
//       select: {
//         users:{
//             select:{
//                 users_profile:{
//                     select:{
//                         user_name:true
//                     }
//                 }
//             }
//         }
//       },
//     },
//   },
//   orderBy: {
//     id: "asc",
//   },
// });


const channels = await prisma.channels.findMany({
  include: {
    _count: {
      select: {
        posts: true, 
      },
    },

    // channel_members: {
    //   select: {
    //     users: {
    //       select: {
    //         users_profile: {
    //           select: {
    //             user_name: true,
    //           },
    //         },
    //       },
    //     },
    //   },
    // },
  },

  orderBy: {
    id: "asc",
  },
});

    return NextResponse.json(
      { message: "all channels found", channels: serialize(channels) },
      {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  },
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
