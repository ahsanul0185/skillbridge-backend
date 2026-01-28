import type { TutorProfilesWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma"


type FilterItems = {
    search : string | null;
    hourlyRate : number | null;
    categoryId  : string | null;
    isFeatured : boolean | null;
    avgRating : number | null;
    totalReviews : number | null;

    page: number;
    limit: number;
    skip: number;
    sortBy: string;
    sortOrder: string;
}

const getAllTutors = async ({search, hourlyRate, categoryId, isFeatured, avgRating, totalReviews, page, limit, sortBy, skip, sortOrder} : FilterItems) => {
//{search, hourlyRate, categoryId, avgRating, totalReviews}
    const andConditions : TutorProfilesWhereInput[] = [];

    if (search) {
        andConditions.push({
            OR : [
                {
                    user : {
                        name : {
                            contains : search,
                            mode : "insensitive"
                        }
                    }     
                },
                {
                    bio : {
                        contains : search,
                        mode : "insensitive"
                    }
                }
            ],
        })
    }

    if (hourlyRate) {
        andConditions.push({
            hourlyRate : {
                lte : hourlyRate
            }
        })
    }

    if (categoryId) {
        andConditions.push({
            categoryId
        })
    }

    if (isFeatured !== null) {
        andConditions.push({
            isFeatured : isFeatured
        })
    }

    if (avgRating) {
        andConditions.push({
            avgRating : {
                gte : avgRating
            }
        })
    }

    if (totalReviews) {
        andConditions.push({
            totalReviews : {
                gte : totalReviews
            }
        })
    }


    const result = await prisma.tutorProfiles.findMany({
        take: limit,
        skip,
        where : {
            AND : andConditions
        },
        orderBy: {
            [sortBy]: sortOrder,
        },
        include : {
            user : true,
        }
    })

      const total = await prisma.tutorProfiles.count({
            where: {
                AND: andConditions,
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


export const tutorService = {getAllTutors}