

import { verifyAuth } from "@/helper/auth";
import { prisma } from "@/lib/prisma";
import { channel_type } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
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

/* ================= UPDATE CHANNEL TYPE ================= */

export async function PUT(req: NextRequest) {
  try {
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

    const body = await req.json();

    /* ================= VALIDATION ================= */

    if (!Array.isArray(body) || !body.length) {
      return NextResponse.json(
        {
          message: "Request body must be a non-empty array",
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    for (const item of body) {
      if (!item.channel_id) {
        return NextResponse.json(
          {
            message: "channel_id is required",
          },
          {
            status: 400,
            headers: corsHeaders,
          }
        );
      }

      if (!item.type) {
        return NextResponse.json(
          {
            message: "type is required",
          },
          {
            status: 400,
            headers: corsHeaders,
          }
        );
      }

      const type = item.type.toUpperCase();

      if (
        !Object.values(channel_type).includes(
          type as channel_type
        )
      ) {
        return NextResponse.json(
          {
            message: `Invalid channel type: ${item.type}`,
          },
          {
            status: 400,
            headers: corsHeaders,
          }
        );
      }
    }

    /* ================= UPDATE ================= */

    await prisma.$transaction(
      body.map(
        (item: {
          channel_id: string | number;
          type: string;
        }) =>
          prisma.channels.update({
            where: {
              id: BigInt(item.channel_id),
            },
            data: {
              channel_type:
                item.type.toUpperCase() as channel_type,
            },
          })
      )
    );

    return NextResponse.json(
      {
        message: "channel type updated successfully",
      },
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error) {

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