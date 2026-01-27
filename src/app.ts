import express from "express";

const app = express();

app.get("/", (_, res) => {
    res.json("Welcome to Skillbridge server")
})

export default app