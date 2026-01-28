import type { TutorProfilesWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma"


type FilterItems = {
    search : string | null;
    hourlyRate : number | null;
    categoryId  : string | null;
    avgRating : number | null;
    totalReviews : number | null;
}

const getAllTutors = async ({search, hourlyRate, categoryId, avgRating, totalReviews} : FilterItems) => {
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
        where : {
            AND : andConditions
        },
        include : {
            user : true,
        }
    })
    return result
}


export const tutorService = {getAllTutors}