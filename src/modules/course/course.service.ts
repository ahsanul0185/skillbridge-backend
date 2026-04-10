import { prisma } from "../../lib/prisma";
import paginationSortingHelper from "../../utils/paginationHelper";

export const getPublicCourses = async (query: any) => {
    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(query);
    const total = await prisma.course.count({ where: { isPublished: true } });
    const data = await prisma.course.findMany({
        where: { isPublished: true },
        include: { institute: { select: { name: true, logoUrl: true } }, mentor: { include: { user: { select: { name: true } } } } },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder }
    });
    return { data, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
};

export const getCourseDetails = async (courseId: string) => {
    return await prisma.course.findUniqueOrThrow({
        where: { id: courseId },
        include: { institute: { select: { name: true, logoUrl: true, description: true } }, mentor: { include: { user: { select: { name: true, image: true } } } } }
    });
};

export const getInstituteCourses = async (instituteId: string, query: any) => {
    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(query);
    const total = await prisma.course.count({ where: { instituteId } });
    const data = await prisma.course.findMany({
        where: { instituteId },
        include: { mentor: { include: { user: { select: { name: true } } } }, _count: { select: { enrollments: true } } },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder }
    });
    return { data, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
};

export const createCourse = async (instituteId: string, data: any) => {
    return await prisma.course.create({
        data: {
            instituteId,
            title: data.title,
            description: data.description,
            price: data.price,
            thumbnailUrl: data.thumbnailUrl,
            level: data.level,
            duration: data.duration,
            isPublished: data.isPublished || false,
            categoryId: data.categoryId,
            mentorId: data.mentorId, // optional assign at creation
        }
    });
};

export const updateCourse = async (instituteId: string, courseId: string, data: any) => {
    const course = await prisma.course.findFirst({ where: { id: courseId, instituteId } });
    if (!course) throw new Error("Course not found or access denied");

    return await prisma.course.update({
        where: { id: courseId },
        data
    });
};

export const deleteCourse = async (instituteId: string, courseId: string) => {
    const course = await prisma.course.findFirst({ where: { id: courseId, instituteId } });
    if (!course) throw new Error("Course not found or access denied");

    await prisma.course.delete({ where: { id: courseId } });
    return { message: "Course deleted successfully" };
};

export const getAssignedCourses = async (mentorId: string, query: any) => {
    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(query);
    const total = await prisma.course.count({ where: { mentorId } });
    const data = await prisma.course.findMany({
        where: { mentorId },
        include: { _count: { select: { enrollments: true } } },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder }
    });
    return { data, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
};

export const getCourseRoster = async (mentorId: string, courseId: string, query: any) => {
    const course = await prisma.course.findFirst({ where: { id: courseId, mentorId } });
    if (!course) throw new Error("Course not found or access denied");

    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(query);
    const total = await prisma.courseEnrollment.count({ where: { courseId } });
    const data = await prisma.courseEnrollment.findMany({
        where: { courseId },
        include: { student: { select: { id: true, name: true, email: true, image: true, phone: true } } },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder }
    });
    return { data, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
};

export const getEnrolledCourses = async (studentId: string, query: any) => {
    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(query);
    const total = await prisma.courseEnrollment.count({ where: { studentId } });
    const data = await prisma.courseEnrollment.findMany({
        where: { studentId },
        include: { course: { include: { mentor: { include: { user: { select: { name: true } } } }, institute: { select: { name: true } } } } },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder }
    });
    return { data, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
};

export const dropCourse = async (studentId: string, courseId: string) => {
    const enrollment = await prisma.courseEnrollment.findUnique({
        where: { studentId_courseId: { studentId, courseId } }
    });
    if (!enrollment) throw new Error("Enrollment not found");

    await prisma.courseEnrollment.delete({ where: { id: enrollment.id } });
    return { message: "Course dropped successfully" };
};

export const courseService = {
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
