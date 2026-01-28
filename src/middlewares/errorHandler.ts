import type { NextFunction, Request, Response } from "express";


function errorHandler (err : any, req : Request, res : Response, next : NextFunction) {
    let stausCode = 500;
    let message = "Internal Servar Error"
    let error = err
    
    res.status(stausCode).json({success : false, message, error})
}

export default errorHandler