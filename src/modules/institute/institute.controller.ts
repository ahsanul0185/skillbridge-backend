import type { NextFunction, Request, Response } from "express";
import { instituteService } from "./institute.service";
import { prisma } from "../../lib/prisma";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";

const getInstituteId = async (userId: string) => {
    const profile = await prisma.instituteProfile.findUnique({ where: { userId }});
    if (!profile) throw new AppError(status.NOT_FOUND, "Institute profile not found for this user");
    return profile.id;
};

const getOverview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const instituteId = await getInstituteId(req.user!.id as string);
        const result = await instituteService.getOverview(instituteId);
        return res.status(200).json({ success: true, message: "Institute overview retrieved", data: result });
    } catch (e) {
        next(e);
    }
};

const listMentors = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const instituteId = await getInstituteId(req.user!.id as string);
        const result = await instituteService.listMentors(instituteId, req.query);
        return res.status(200).json({ success: true, message: "Mentors retrieved successfully", data: result });
    } catch (e) {
        next(e);
    }
};

const inviteMentor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, name } = req.body;
        if (!email || !name) {
            throw new AppError(status.BAD_REQUEST, "Email and name are required");
        }
        const instituteId = await getInstituteId(req.user!.id as string);
        const result = await instituteService.inviteMentor(instituteId, email, name);
        return res.status(200).json({ success: true, message: "Invitation sent successfully", data: result });
    } catch (e) {
        next(e);
    }
};

const updateMentorProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const mentorId = req.params.mentorId as string;
        if (!mentorId) {
            throw new AppError(status.BAD_REQUEST, "Mentor ID is required");
        }
        const instituteId = await getInstituteId(req.user!.id as string);
        const result = await instituteService.updateMentorProfile(instituteId, mentorId, req.body);
        return res.status(200).json({ success: true, message: "Mentor profile updated", data: result });
    } catch (e) {
        next(e);
    }
};

const removeMentor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const mentorId = req.params.mentorId as string;
        if (!mentorId) {
            throw new AppError(status.BAD_REQUEST, "Mentor ID is required");
        }
        const instituteId = await getInstituteId(req.user!.id as string);
        const result = await instituteService.removeMentor(instituteId, mentorId);
        return res.status(200).json({ success: true, message: "Mentor removed", data: result });
    } catch (e) {
        next(e);
    }
};

export const instituteController = {
    getOverview,
    listMentors,
    inviteMentor,
    updateMentorProfile,
    removeMentor
};
