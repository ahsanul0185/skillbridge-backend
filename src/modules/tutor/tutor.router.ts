import { Router } from "express";
import { tutorController } from "./tutor.controller";
import { auth } from "../../middlewares/auth";
import { UserRoles } from "../../../generated/prisma/enums";

const router = Router();

router.get("/", tutorController.getAllTutors);
router.get("/:tutorId", tutorController.getTutorById);

router.put("/update", auth(UserRoles.TUTOR), tutorController.updateTutor)
router.put("/subjects", auth(UserRoles.TUTOR), tutorController.updateTutorSubjects)

router.delete("/subjects/:subjectId", auth(UserRoles.TUTOR), tutorController.deleteTutorSubject)


export const tutorRouter = router; 