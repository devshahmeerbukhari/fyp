import { Router } from "express";
import { getNorthernDestinations } from "../controllers/destinations.controller.js";

const router = Router();

router.get("/northern", getNorthernDestinations);

export default router;