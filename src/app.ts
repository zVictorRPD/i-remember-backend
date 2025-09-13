import express from "express";
import authRoutes from "../src/routes/authRoutes";
import emailRoutes from "../src/routes/emailRoutes";
import eventRoutes from "../src/routes/eventRoutes";
import { startCron } from "./services/cronService";

import cors from "cors";

const app = express();

startCron();

app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/emails", emailRoutes);

export default app;
