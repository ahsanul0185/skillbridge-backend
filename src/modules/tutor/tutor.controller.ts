import type { NextFunction, Request, Response } from "express";
import { tutorService } from "./tutor.service";

const getAllTutors = async (req : Request, res : Response, next : NextFunction) => {
    try {
        
        const filters = {
            search : req.query.search ? req.query.search as string : null,
            hourlyRate : req.query.hourlyRate ? Number(req.query.hourlyRate) as number : null,
            categoryId : req.query.categoryId ? req.query.categoryId as string : null,
            avgRating : req.query.avgRating ? Number(req.query.avgRating) as number : null,
            totalReviews : req.query.totalReviews ? Number(req.query.totalReviews) as number : null
        }

       const result = await tutorService.getAllTutors(filters);
       return res.status(200).json({success : true, message : "Tutors data retrieved successfully", data : result})
    } catch (e) {
       next(e)
    }
}


export const tutorController = {getAllTutors}