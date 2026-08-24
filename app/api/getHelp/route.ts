 
 
 import { verifyAuth } from "@/helper/auth";
import { generateReadUrl } from "@/helper/awsUrl";
 import { prisma } from "@/lib/prisma";
 import { serialize } from "@/lib/serialize";
 import { NextResponse, NextRequest } from "next/server";
 
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
 
     const page = Number(searchParams.get("page")) || 1;
     const limit = Number(searchParams.get("limit")) || 10;
 
     const skip = (page - 1) * limit;
 
     /* ================= TOTAL DATA ================= */
 
     const total= await prisma.help_support.count();
 
     /* ================= GET HELP & SUPPORT DATA ================= */
 
     const helps = await prisma.help_support.findMany({
       skip,
       take: limit,
       include:{
        users:{
            select:{
                email_id:true,
                users_profile:{
                    select:{
                        user_name:true,
                        first_name:true,
                        last_name:true,
                        profile_image:true,
                    }
                }
            }
        }
       },
 
       orderBy: {
         created_at: "desc",
       },
     });
 
     /* ================= FORMAT DATA ================= */
 
    //  const formattedData = await Promise.all(
    //    helps.map(async (help) => ({
    //      ...help,
 
    //      users_profile: {
    //        ...help.users.users_profile,
 
    //        profile_image: help.users.users_profile?.profile_image
    //          ? await generateReadUrl(
    //              help.users.users_profile?.profile_image
    //            )
    //          : null,
    //      },
    //    }))
    //  );
 
const formattedData = await Promise.all(
  helps.map(async (help) => ({
    ...help,

    users: {
      ...help.users,

      users_profile: {
        ...help.users.users_profile,

        profile_image: help.users.users_profile?.profile_image
          ? await generateReadUrl(
              help.users.users_profile.profile_image
            )
          : null,
      },
    },
  }))
);


     /* ================= RESPONSE ================= */
 
     return NextResponse.json(
       {
         message: "all help data found",
 
         helps: serialize(formattedData),
 
         pagination: {
           total,
           currentPage: page,
           totalPages: Math.ceil(total / limit),
           limit,
           hasNextPage: page < Math.ceil(total / limit),
           hasPrevPage: page > 1,
         },
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
 
     return NextResponse.json(
       { message: "Internal Server Error" },
       { status: 500 }
     );
   }
 }