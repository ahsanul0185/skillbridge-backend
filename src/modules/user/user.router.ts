import { Router } from "express";
import { UserController } from "./user.controller";
import { UserRoles } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";

const router = Router();

router.get("/me", auth(UserRoles.STUDENT, UserRoles.TUTOR, UserRoles.ADMIN),UserController.getUser)

export const userRouter = router; 