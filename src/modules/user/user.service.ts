import { UserRoles, type User } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"

const getUser = async (user : User) => {
    return await prisma.user.findUnique({
        where : {
            id : user.id
        },
        include : {
            tutorProfile : user.role === UserRoles.TUTOR && {
                include : {
                    subjects : {
                        include : {
                            subject : true
                        }
                    },
                    reviews : true,
                    bookings : true,
                    availability : true
                }
            }
        },
        
    })
}


export const UserService = {getUser}