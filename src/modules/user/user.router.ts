import { Router } from "express";
import { userController } from "./user.controller";
import { UserRoles } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { uploadProfilePhoto } from "../../config/multer.config";

const router = Router();

router.get("/me", auth(UserRoles.STUDENT, UserRoles.TUTOR, UserRoles.ADMIN), userController.getUser)
router.put("/update", auth(UserRoles.STUDENT, UserRoles.TUTOR, UserRoles.ADMIN), uploadProfilePhoto, userController.updateUserData)

router.get("/student/stats", auth(UserRoles.STUDENT), userController.getStudentStats)
router.get("/admin/analytics", auth(UserRoles.ADMIN), userController.getAdminAnalytics)

router.get("/list", auth(UserRoles.ADMIN, UserRoles.MODERATOR), userController.listUsers)
router.put("/ban/:userId", auth(UserRoles.ADMIN, UserRoles.MODERATOR), userController.updateUserStatus)

export const userRouter = router; 