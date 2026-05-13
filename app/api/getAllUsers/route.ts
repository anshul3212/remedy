import { generateReadUrl } from "@/helper/awsUrl";
import { prisma } from "@/lib/prisma";
import { serialize } from "@/lib/serialize";
import { NextResponse,NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // const userHeader = req.headers.get("user");

    // const user = userHeader
    //   ? JSON.parse(userHeader)
    //   : null;

    // console.log("Logged In User:", user);

    const totalUsers = await prisma.users.count();

    const users = await prisma.users.findMany({
  include: {
    users_profile: {
      select: {
        first_name: true,
        last_name: true, 
        profile_image: true,
      },
    },
  },
  orderBy: {
    id: "asc",
  },
});


const formattedUsers = await Promise.all(
  users.map(async (user) => ({
    ...user,

    users_profile: {
      ...user.users_profile,

      profile_image: user.users_profile?.profile_image
        ? await generateReadUrl(
            user.users_profile.profile_image
          )
        : null,
    },
  }))
);

    return NextResponse.json(
      { message: "all users found", users: serialize(formattedUsers),totalUsers },
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
