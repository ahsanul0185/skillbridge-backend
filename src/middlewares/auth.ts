import type { NextFunction, Request, Response } from "express";
import {auth as betterAuth} from "../lib/auth"
import { UserRoles, type User } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";



export const auth = (...roles : UserRoles[]) => {
    return async (req : Request, res : Response, next : NextFunction) => {
        try {
            const session = await betterAuth.api.getSession({
                headers : req.headers as any,
            })

            if (!session) {
                return res.status(401).json({
                    success : false,
                    message : "Unauthorized"
                })
            }

            req.user = session.user as User;

            if (roles.length > 0 && !roles.includes(req.user.role as UserRoles)) {
                return res.status(403).json({
                    success: false,
                    message: "You don't have permission to perform this action.",
                });
            }

            if (req.user.role === UserRoles.TUTOR) {
                const tutorProfile = await prisma.tutorProfiles.findUnique({
                    where : {
                        userId : req.user.id as string
                    },
                    select : {
                        id : true
                    }
                });
                if (tutorProfile) {
                    req.tutorId = tutorProfile.id
                }
            }

            next();
        } catch (error) {
            next(error)
        }
    }
}
