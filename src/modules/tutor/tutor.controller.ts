import type { NextFunction, Request, Response } from "express";

const getAllTutors = async (req : Request, res : Response, next : NextFunction) => {
    try {
       
    } catch (e) {
       next(e)
    }
}



export const tutorController = {getAllTutors}