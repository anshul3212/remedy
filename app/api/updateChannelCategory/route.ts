import { prisma } from "@/lib/prisma";
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
    const body = await req.json();

    const { channelIds, category } = body;

    /* ================= VALIDATION ================= */

    if (
      !channelIds ||
      !Array.isArray(channelIds) ||
      !channelIds.length
    ) {
      return NextResponse.json(
        {
          message: "channelIds are required",
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    if (!category) {
      return NextResponse.json(
        {
          message: "category is required",
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    /* ================= UPDATE ================= */

    await prisma.channels.updateMany({
      where: {
        id: {
          in: channelIds.map((id: number | string) =>
            BigInt(id)
          ),
        },
      },

      data: {
        channel_type: category.toUpperCase(),
      },
    });

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
    console.error(error);

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