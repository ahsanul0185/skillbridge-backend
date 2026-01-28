import { toNodeHandler } from "better-auth/node";
import express from "express";
import { auth } from "./lib/auth";
import { userRouter } from "./modules/user/user.router";

const app = express();

app.all("/api/auth/{*any}", toNodeHandler(auth));
app.use(express.json());

app.use("/api/user", userRouter)

app.get("/", (_, res) => {
    res.json("Welcome to Skillbridge server")
})

export default app