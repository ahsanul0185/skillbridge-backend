import { UserRoles, UserStatus, type User } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"

type PaginationInput = {
    page: number;
    limit: number;
    skip: number;
    sortBy: string;
    sortOrder: string;
}

const listUsers = async ({page, limit, sortBy, skip, sortOrder} : PaginationInput) => {

    const total = await prisma.tutorProfiles.count({});

    const result = await prisma.user.findMany({
        take: limit,
        skip,
        orderBy: {
            [sortBy]: sortOrder,
        },
    });
    return {
        data: result,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
}

const getUser = async (user : User) => {

    return await prisma.user.findUnique({
        where : {
            id : user.id
        },
        include : {
            studentReviews : user.role === UserRoles.STUDENT,
            studentBookings : user.role === UserRoles.STUDENT,
            tutorProfile : user.role === UserRoles.TUTOR && {
                include : {
                    subjects : {
                        include : {
                            subject : true
                        }
                    }
                }
            }
        },
        
    })
}

const updateUserData = async (data: Partial<User>, user: User) => {

  const { name, image, phone } = data;

  if (!name && !image && !phone) {
    throw new Error("Invalid input fields");
  }

  const userExists = await prisma.user.findUniqueOrThrow({
    where: {
      id: user.id,
    },
  });


  return await prisma.user.update({
    where: {
      id: userExists.id,
    },
    data: {
      ...(name && { name }),
      ...(image && { image }),
      ...(phone && { phone }),
    },
    select: {
      id: true,
      name: true,
      image: true,
      email: true, 
      phone : true
    },
  });
};

const updateUserStatus = async (status : UserStatus, userId : string) => {

    return await prisma.user.update({
        where : {
            id : userId
        },
        data : {
            status
        }
    })
}


export const userService = {getUser, listUsers, updateUserStatus, updateUserData}