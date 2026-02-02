import {
    BookingStatus,
  UserRoles,
  UserStatus,
  type User,
} from "../../../generated/prisma/client";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";

type PaginationInput = {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
};

const listUsers = async ({
  page,
  limit,
  sortBy,
  skip,
  sortOrder,
}: PaginationInput) => {
  const total = await prisma.user.count({});

  const result = await prisma.user.findMany({
    take: limit,
    skip,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });
  return {
    data: result,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getUser = async (user: User) => {
  return await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    include: {
      studentReviews: user.role === UserRoles.STUDENT,
      studentBookings: user.role === UserRoles.STUDENT,
      tutorProfile: user.role === UserRoles.TUTOR && {
        include: {
          subjects: {
            include: {
              subject: true,
            },
          },
        },
      },
    },
  });
};

const updateUserData = async (data: Partial<User>, user: User) => {
  const { name, image, phone } = data;

  if (!name && !image && !phone) {
    throw new Error("Invalid input fields");
  }

  const userExists = await prisma.user.findUniqueOrThrow({
    where: {
      id: user.id,
    },
  });

  return await prisma.user.update({
    where: {
      id: userExists.id,
    },
    data: {
      ...(name && { name }),
      ...(image && { image }),
      ...(phone && { phone }),
    },
    select: {
      id: true,
      name: true,
      image: true,
      email: true,
      phone: true,
    },
  });
};

const updateUserStatus = async (status: UserStatus, userId: string) => {
  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      status,
    },
  });
};

const getStudentStats = async (studentId: string) => {
  return await prisma.$transaction(async (tx) => {
    const [
      totalBookings,
      upcomingBookings,
      completedBookings,
      totalSpent,
      totalReviews,
    ] = await Promise.all([
      tx.booking.count({ where: { studentId } }),

      tx.booking.findMany({
        where: { studentId, status: BookingStatus.CONFIRMED },
        take: 5,
        orderBy: {
          createdAt: "asc",
        },
        include: {
          tutor: {
            include: {
              user: {
                select: {
                  name: true,
                  image: true,
                },
              },
            },
          },
          subject: {
            select: {
              name: true,
            },
          },
          availability: {
            select: {
              day: true,
              startTime: true,
              endTime: true,
            },
          },
        },
      }),

      tx.booking.count({
        where: {
          studentId,
          status: BookingStatus.COMPLETED,
        },
      }),

      tx.booking.aggregate({
        where: { studentId },
        _sum: {
          price: true,
        },
      }),

      tx.review.count({
        where: { studentId },
      }),
    ]);

    return {
      totalBookings,
      upcomingBookings,
      completedBookings,
      totalSpent: totalSpent._sum.price || 0,
      totalReviews,
    };
  });
};

const getAdminAnalytics = async () => {
  return await prisma.$transaction(async (tx) => {
    const [
      totalUsers,
      totalStudents,
      totalTutors,
      totalBookings,
      completedBookings,
      totalRevenue,
      totalReviews,
      averageRating
    ] = await Promise.all([
      tx.user.count(),

      tx.user.count({
        where: { role: 'STUDENT' }
      }),
      
      tx.user.count({
        where: { role: 'TUTOR' }
      }),
      
      tx.booking.count(),
      
      tx.booking.count({
        where: { status: 'COMPLETED' }
      }),
      
      tx.booking.aggregate({
        _sum: {
          price: true
        }
      }),
      
      tx.review.count(),
      
      tx.review.aggregate({
        _avg: {
          rating: true
        }
      })
    ]);

    return {
      totalUsers,
      totalStudents,
      totalTutors,
      totalBookings,
      completedBookings,
      totalRevenue: totalRevenue._sum.price || 0,
      totalReviews,
      averageRating: averageRating._avg.rating || 0
    };
  });
};

export const userService = {
  getUser,
  listUsers,
  updateUserStatus,
  updateUserData,
  getStudentStats,
  getAdminAnalytics
};
