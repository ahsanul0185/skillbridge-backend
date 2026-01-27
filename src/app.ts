import { toNodeHandler } from "better-auth/node";
import express from "express";
import { auth } from "./lib/auth";

const app = express();

app.all("/api/auth/*", toNodeHandler(auth));
app.use(express.json());

app.get("/", (_, res) => {
    res.json("Welcome to Skillbridge server")
})

export default app