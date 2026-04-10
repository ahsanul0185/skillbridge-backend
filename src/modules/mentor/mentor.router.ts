import { Router } from "express";
import { UserRoles } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { mentorController } from "./mentor.controller";

const router = Router();
router.get("/overview", auth(UserRoles.MENTOR), mentorController.getOverview);
router.put("/update", auth(UserRoles.MENTOR), mentorController.updateProfile);

export const mentorRouter = router;
