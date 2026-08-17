import { verifyAuth } from "@/helper/auth";
import { prisma } from "@/lib/prisma";
import { serialize } from "@/lib/serialize";
import { generateReadUrl } from "@/helper/awsUrl";

import {
  NextRequest,
  NextResponse,
} from "next/server";

/* ================= CORS ================= */

const corsHeaders = {
  "Access-Control-Allow-Origin":
    "*",

  "Access-Control-Allow-Methods":
    "GET, OPTIONS",

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

/* ================= GET ADMIN ================= */

export async function GET(
  req: NextRequest
) {
  try {
    /* ================= VERIFY TOKEN ================= */

    const user = await verifyAuth(req);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
          headers: corsHeaders,
        }
      );
    }

    /* ================= FIND ADMIN ================= */

    const admin =
      await prisma.admin.findUnique({
        where: {
          email_id: user.email_id,
        },

        select: {
          full_name: true,
          profile_image: true,
          is_active: true,
          
        },
      });

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin not found",
        },
        {
          status: 404,
          headers: corsHeaders,
        }
      );
    }

    /* ================= IMAGE URL ================= */

const adminWithImage = {
  ...admin,

  profile_image:
    admin.profile_image
      ? await generateReadUrl(
          admin.profile_image
        )
      : null,
};

    /* ================= RESPONSE ================= */

    return NextResponse.json(
      {
        success: true,

        message: "Admin found",

        admin: serialize(adminWithImage),
      },
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error) {

    return NextResponse.json(
      {
        success: false,

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