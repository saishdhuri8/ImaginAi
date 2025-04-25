import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import cors from "cors"
import userRoute from "./routes/userRoutes.js";


const app = express();
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json())
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))

app.use(userRoute)

app.listen(8000, () => { console.log("Server started") })