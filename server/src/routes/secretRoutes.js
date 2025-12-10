import express from "express";
import { createSecret, getSecret } from "../controllers/secretController.js";

const secretRouter = express.Router();

secretRouter.post("/create", createSecret);

secretRouter.get("/:slug", getSecret);

export default secretRouter;
