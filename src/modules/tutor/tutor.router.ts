import { Router } from "express";
import { tutorController } from "./tutor.controller";

const router = Router();

router.get("/", tutorController.getAllTutors);
router.get("/:tutorId", tutorController.getTutorById);


export const tutorRouter = router; 