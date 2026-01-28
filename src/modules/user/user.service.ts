import { UserRoles, type User } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"

const getUser = async (user : User) => {
    return await prisma.user.findUnique({
        where : {
            id : user.id
        },
        include : {
            tutorProfile : user.role === UserRoles.TUTOR
        }
    })
}


export const UserService = {getUser}