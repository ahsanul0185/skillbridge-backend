import { Router } from "express";
import { UserRoles } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { instituteController } from "./institute.controller";

const router = Router();

router.get("/overview", auth(UserRoles.INSTITUTE), instituteController.getOverview);
router.get("/mentors", auth(UserRoles.INSTITUTE), instituteController.listMentors);
router.post("/mentors/invite", auth(UserRoles.INSTITUTE), instituteController.inviteMentor);
router.put("/mentors/update/:mentorId", auth(UserRoles.INSTITUTE), instituteController.updateMentorProfile);
router.delete("/mentors/delete/:mentorId", auth(UserRoles.INSTITUTE), instituteController.removeMentor);

export const instituteRouter = router;
