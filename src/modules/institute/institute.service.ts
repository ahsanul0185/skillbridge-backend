import { prisma } from "../../lib/prisma";
import crypto from "crypto";
import { sendEmail } from "../../utils/email";
import { envVars } from "../../config/env";
import { UserRoles } from "../../../generated/prisma/client";
import paginationSortingHelper from "../../utils/paginationHelper";

const getOverview = async (instituteId: string) => {
    return await prisma.$transaction(async (tx) => {
        const totalMentors = await tx.mentorProfile.count({ where: { instituteId } });
        const totalCourses = await tx.course.count({ where: { instituteId } });
        const totalEnrollments = await tx.courseEnrollment.count({
            where: { course: { instituteId } }
        });
        
        return { totalMentors, totalCourses, totalEnrollments };
    });
};

const listMentors = async (instituteId: string, query: any) => {
    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(query);
    const total = await prisma.mentorProfile.count({ where: { instituteId } });
    const data = await prisma.mentorProfile.findMany({
        where: { instituteId },
        include: { user: { select: { name: true, email: true, image: true, phone: true } } },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder }
    });
    
    return {
        data,
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
    };
};

const inviteMentor = async (instituteId: string, email: string, name: string) => {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new Error("User already exists with this email");
    }

    const institute = await prisma.instituteProfile.findUnique({ where: { id: instituteId }});
    if (!institute) throw new Error("Institute not found");

    const token = crypto.randomBytes(32).toString("hex");
    const identifier = `invite:mentor:${instituteId}:${email}`;

    await prisma.verification.deleteMany({
        where: { identifier }
    });

    await prisma.verification.create({
        data: {
            id: crypto.randomUUID(),
            identifier,
            value: token,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        },
    });

    const inviteUrl = `${envVars.APP_URL}/accept-invite?token=${token}&email=${encodeURIComponent(email)}&role=${UserRoles.MENTOR}&name=${encodeURIComponent(name)}`;

    await sendEmail({
        to: email,
        subject: "You're Invited to be a Mentor",
        templateName: "invite",
        templateData: {
            invitedName: name,
            roleName: "Mentor",
            inviterName: institute.name,
            inviteUrl,
        },
    });

    return { message: "Invitation sent successfully" };
};

const updateMentorProfile = async (instituteId: string, mentorId: string, data: any) => {
    const mentor = await prisma.mentorProfile.findFirst({
        where: { id: mentorId, instituteId }
    });

    if (!mentor) throw new Error("Mentor not found or doesn't belong to this institute");

    return await prisma.mentorProfile.update({
        where: { id: mentorId },
        data: {
            title: data.title,
            bio: data.bio,
            expertise: data.expertise
        }
    });
};

const removeMentor = async (instituteId: string, mentorId: string) => {
    const mentor = await prisma.mentorProfile.findFirst({
        where: { id: mentorId, instituteId }
    });
    if (!mentor) throw new Error("Mentor not found or doesn't belong to this institute");

    await prisma.mentorProfile.delete({ where: { id: mentorId } });
    return { message: "Mentor removed successfully" };
};

export const instituteService = {
  getOverview,
  listMentors,
  inviteMentor,
  updateMentorProfile,
  removeMentor
};
