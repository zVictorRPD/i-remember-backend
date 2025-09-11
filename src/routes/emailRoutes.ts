import { Router } from "express";
import { sendEmails } from "../controllers/emailController";

const router = Router();

router.route('/')
  .get(sendEmails);

export default router;