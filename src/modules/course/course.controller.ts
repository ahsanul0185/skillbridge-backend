import type { NextFunction, Request, Response } from "express";
import { courseService } from "./course.service";
import { prisma } from "../../lib/prisma";

const getInstituteId = async (userId: string) => {
    const profile = await prisma.instituteProfile.findUnique({ where: { userId }});
    if (!profile) throw new Error("Institute profile not found for this user");
    return profile.id;
};

const getMentorId = async (userId: string) => {
    const profile = await prisma.mentorProfile.findUnique({ where: { userId }});
    if (!profile) throw new Error("Mentor profile not found for this user");
    return profile.id;
};

const getPublicCourses = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await courseService.getPublicCourses(req.query);
        res.status(200).json({ success: true, message: "Courses retrieved", data: result });
    } catch (error) {
        next(error);
    }
};

const getCourseDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await courseService.getCourseDetails(req.params.courseId as string);
        res.status(200).json({ success: true, message: "Course details retrieved", data: result });
    } catch (error) {
        next(error);
    }
};

const getInstituteCourses = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const instituteId = await getInstituteId(req.user!.id as string);
        const result = await courseService.getInstituteCourses(instituteId, req.query);
        res.status(200).json({ success: true, message: "Institute courses retrieved", data: result });
    } catch (error) {
        next(error);
    }
};

const createCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const instituteId = await getInstituteId(req.user!.id as string);
        const result = await courseService.createCourse(instituteId, req.body);
        res.status(201).json({ success: true, message: "Course created successfully", data: result });
    } catch (error) {
        next(error);
    }
};

const updateCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const instituteId = await getInstituteId(req.user!.id as string);
        const result = await courseService.updateCourse(instituteId, req.params.courseId as string, req.body);
        res.status(200).json({ success: true, message: "Course updated successfully", data: result });
    } catch (error) {
        next(error);
    }
};

const deleteCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const instituteId = await getInstituteId(req.user!.id as string);
        const result = await courseService.deleteCourse(instituteId, req.params.courseId as string);
        res.status(200).json({ success: true, message: "Course deleted successfully", data: result });
    } catch (error) {
        next(error);
    }
};

const getAssignedCourses = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const mentorId = await getMentorId(req.user!.id as string);
        const result = await courseService.getAssignedCourses(mentorId, req.query);
        res.status(200).json({ success: true, message: "Assigned courses retrieved", data: result });
    } catch (error) {
        next(error);
    }
};

const getCourseRoster = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const mentorId = await getMentorId(req.user!.id as string);
        const result = await courseService.getCourseRoster(mentorId, req.params.courseId as string, req.query);
        res.status(200).json({ success: true, message: "Course roster retrieved", data: result });
    } catch (error) {
        next(error);
    }
};

const getEnrolledCourses = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await courseService.getEnrolledCourses(req.user!.id as string, req.query);
        res.status(200).json({ success: true, message: "Enrolled courses retrieved", data: result });
    } catch (error) {
        next(error);
    }
};

const dropCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await courseService.dropCourse(req.user!.id as string, req.params.courseId as string);
        res.status(200).json({ success: true, message: "Dropped course successfully", data: result });
    } catch (error) {
        next(error);
    }
};

export const courseController = {
    getPublicCourses,
    getCourseDetails,
    getInstituteCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    getAssignedCourses,
    getCourseRoster,
    getEnrolledCourses,
    dropCourse
};
