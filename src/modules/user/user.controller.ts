import type { NextFunction, Request, Response } from "express";
import { UserService } from "./user.service";
import type { User } from "../../../generated/prisma/client";


const getUser = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const result = await UserService.getUser(req.user as User)
        return res.status(200).json({success : true, message : "User data retrieved successfully", data : result})
    } catch (e) {
        next(e)
    }
}



export const UserController = {getUser}