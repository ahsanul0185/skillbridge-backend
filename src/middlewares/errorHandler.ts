import type { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";


function errorHandler (err : any, req : Request, res : Response, next : NextFunction) {
    let statusCode = 500;
    let message = "Internal Servar Error"
    let error = err




    
    if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = 400;
        message = "Missing field or incorrect field type.";
    }

    else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2025") {
            statusCode = 400;
            message = "Record not found.";
        }else if (err.code === "P2002") {
            statusCode = 400;
            message = "Duplicate key error"
        }
        else if (err.code === "P2003") {
            statusCode = 400;
            message = "Foreign key constraint failed."
        }
    }

    else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        statusCode = 500;
        message = "Error occurred during query execution"
    }

    else if (err instanceof Prisma.PrismaClientInitializationError) {
        if (err.errorCode === "P1000") {
            statusCode = 401;
            message = "Authentication error."
        }
        else if (err.errorCode === "P1001") {
            statusCode = 400;
            message = "Cannot connect to the database."
        }
    }






    
    res.status(statusCode).json({success : false, message, error})
}

export default errorHandler