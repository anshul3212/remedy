import { prisma } from "@/lib/prisma";
import { serialize } from "@/lib/serialize";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const totalUsers = await prisma.users.count();
    // const startOfDay = new Date();
    // startOfDay.setHours(0, 0, 0, 0);

    // const endOfDay = new Date();
    // endOfDay.setHours(23, 59, 59, 999);

    // const activeToday = await prisma.users.count({
    //   where: {
    //     is_active: true,
    //     last_active_at: {
    //       gte: startOfDay,
    //       lte: endOfDay,
    //     },
    //   },
    // });

    // console.log(activeToday)

    const users = await prisma.users.findMany({
  include: {
    users_profile: {
      select: {
        first_name: true,
        last_name: true, 
      },
    },
  },
  orderBy: {
    id: "asc",
  },
});

    return NextResponse.json(
      { message: "all users found", users: serialize(users),totalUsers },
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
