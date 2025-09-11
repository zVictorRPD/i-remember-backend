import express from "express";
import authRoutes from "../src/routes/authRoutes";
import emailRoutes from "../src/routes/emailRoutes";
import eventRoutes from "../src/routes/eventRoutes";

import cors from "cors";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/emails", emailRoutes);

export default app;
