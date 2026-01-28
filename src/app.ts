import { toNodeHandler } from "better-auth/node";
import express from "express";
import { auth } from "./lib/auth";
import { userRouter } from "./modules/user/user.router";
import { tutorRouter } from "./modules/tutor/tutor.router";
import errorHandler from "./middlewares/errorHandler";
import { notFound } from "./middlewares/notFound";
import { categoryRouter } from "./modules/category/category.router";

const app = express();

app.all("/api/auth/{*any}", toNodeHandler(auth));
app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/tutors", tutorRouter);
app.use("/api/categories", categoryRouter);

app.get("/", (_, res) => {
    res.json("Welcome to Skillbridge server")
})


app.use(errorHandler);
app.use(notFound);


export default app