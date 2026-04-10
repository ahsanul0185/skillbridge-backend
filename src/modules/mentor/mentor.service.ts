import { prisma } from "../../lib/prisma";

const getOverview = async (userId: string) => {
    return await prisma.$transaction(async (tx) => {
        const profile = await tx.mentorProfile.findUnique({ where: { userId } });
        if (!profile) throw new Error("Mentor profile not found");
        
        const totalCourses = await tx.course.count({ where: { mentorId: profile.id } });
        const enrollmentsCount = await tx.courseEnrollment.count({
            where: { course: { mentorId: profile.id } }
        });

        return { totalCourses, enrollmentsCount, instituteId: profile.instituteId };
    });
};

const updateProfile = async (userId: string, data: any) => {
    return await prisma.mentorProfile.update({
        where: { userId },
        data: {
            title: data.title,
            bio: data.bio,
            expertise: data.expertise
        }
    });
};

export const mentorService = { getOverview, updateProfile };
