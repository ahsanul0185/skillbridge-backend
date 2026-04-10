import { Router } from "express";
import { UserRoles } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { mentorController } from "./mentor.controller";
import { updateMentorProfileZodSchema } from "./mentor.validation";

const router = Router();
router.get("/overview", auth(UserRoles.MENTOR), mentorController.getOverview);
router.put("/update", auth(UserRoles.MENTOR), validateRequest(updateMentorProfileZodSchema), mentorController.updateProfile);

export const mentorRouter = router;
