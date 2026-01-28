import type { NextFunction, Request, Response } from "express";
import { tutorService } from "./tutor.service";
import paginationSortingHelper from "../../utils/paginationHelper";

const getAllTutors = async (req : Request, res : Response, next : NextFunction) => {
    try {
        
        const filters = {
            search : req.query.search ? req.query.search as string : null,
            hourlyRate : req.query.hourlyRate ? Number(req.query.hourlyRate) as number : null,
            categoryId : req.query.categoryId ? req.query.categoryId as string : null,
            isFeatured : req.query.isFeatured ? (req.query.isFeatured === "true" ? true : req.query.isFeatured === "false" ? false : null) : null,
            avgRating : req.query.avgRating ? Number(req.query.avgRating) as number : null,
            totalReviews : req.query.totalReviews ? Number(req.query.totalReviews) as number : null
        }

            const paginations = paginationSortingHelper(req.query);

       const result = await tutorService.getAllTutors({...filters, ...paginations});
       return res.status(200).json({success : true, message : "Tutors data retrieved successfully", data : result.data, pagination : result.pagination})
    } catch (e) {
       next(e)
    }
}


export const tutorController = {getAllTutors}