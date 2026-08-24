import { verifyAuth } from "@/helper/auth";
import { generateReadUrl } from "@/helper/awsUrl";
import { prisma } from "@/lib/prisma";
import { serialize } from "@/lib/serialize";
import { NextRequest, NextResponse } from "next/server";



export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    /* ================= GET ID ================= */

    const { id } = await context.params;

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

    /* ================= FIND CHANNEL ================= */

    const channel =

      await prisma.channels.findUnique({
        where: {
          id: BigInt(id),
        },

        include: {

          _count: {
  select: {
    posts: {
      where: {
        is_active:true
      },
    },
  },
},

          channel_categories: {
            select: {
              id: true,
              category: true,
            },
          },

          users: {
            select: {
              users_profile: {
                select: {
                  user_name: true,
                },
              },
            },
          },
        },
      });


    /* ================= CHANNEL NOT FOUND ================= */

    if (!channel) {
      return NextResponse.json(
        {
          success: false,
          message: "channel not found",
        },
        {
          status: 404,
        }
      );
    }

    /* ================= FORMAT CHANNEL ================= */

    const formattedChannel = {
  ...channel,

  image: channel.image
    ? await generateReadUrl(channel.image)
    : null,
};

    /* ================= RESPONSE ================= */

    return NextResponse.json(
      {
        success: true,

        message: "channel found",

        channel: serialize(
          formattedChannel
        ),
      },

      {
        status: 200,

        headers: {
          "Access-Control-Allow-Origin":
            "*",

          "Access-Control-Allow-Methods":
            "GET, POST, PUT, DELETE, OPTIONS",

          "Access-Control-Allow-Headers":
            "Content-Type, Authorization",
        },
      }
    );
  } catch (err) {
  

    return NextResponse.json(
      {
        success: false,

        message: "Internal Server Error",

        error:
          err instanceof Error
            ? err.message
            : "Unknown Error",
      },

      {
        status: 500,

        headers: {
          "Access-Control-Allow-Origin":
            "*",

          "Access-Control-Allow-Methods":
            "GET, POST, PUT, DELETE, OPTIONS",

          "Access-Control-Allow-Headers":
            "Content-Type, Authorization",
        },
      }
    );
  }
}