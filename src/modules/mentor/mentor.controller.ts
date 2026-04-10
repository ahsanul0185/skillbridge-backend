import type { NextFunction, Request, Response } from "express";
import { mentorService } from "./mentor.service";

const getOverview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await mentorService.getOverview(req.user!.id as string);
        res.status(200).json({ success: true, message: "Mentor overview retrieved", data: result });
    } catch (e) {
        next(e);
    }
}
const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await mentorService.updateProfile(req.user!.id as string, req.body);
        res.status(200).json({ success: true, message: "Mentor profile updated", data: result });
    } catch (e) {
        next(e);
    }
}

export const mentorController = { getOverview, updateProfile };
