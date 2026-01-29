import type { NextFunction, Request, Response } from "express";
import { userService } from "./user.service";
import type { User } from "../../../generated/prisma/client";
import paginationSortingHelper from "../../utils/paginationHelper";


const getUser = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const result = await userService.getUser(req.user as User)
        return res.status(200).json({success : true, message : "User data retrieved successfully", data : result})
    } catch (e) {
        next(e)
    }
}

const listUsers = async (req : Request, res : Response, next : NextFunction) => {
    try {

        const paginations = paginationSortingHelper(req.query);

        const result = await userService.listUsers(paginations)
        return res.status(200).json({success : true, message : "Users data retrieved successfully", data : result})
    } catch (e) {
        next(e)
    }
}


const updateUserStatus = async (req : Request, res : Response, next : NextFunction) => {
    try {

        if (!req.body?.status) {
            return res.status(400).json({success : false, message : "Status is required"}) 
        }

        const result = await userService.updateUserStatus(req.body.status, req.params.userId as string)

        return res.status(200).json({success : true, message : "User status updated", data : result})
    } catch (e) {
        next(e)
    }
}


const updateUserData = async (req : Request, res : Response, next : NextFunction) => {
    try {

        const result = await userService.updateUserData(req.body, req.user as User)

        return res.status(200).json({success : true, message : "User status updated", data : result})
    } catch (e) {
        next(e)
    }
}






export const userController = {getUser, listUsers, updateUserStatus, updateUserData}