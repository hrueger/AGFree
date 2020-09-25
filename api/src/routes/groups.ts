import { Router } from "express";
import GroupController from "../controllers/GroupController";
import { checkJwt } from "../middlewares/checkJwt";

const router = Router();

router.get("/", [checkJwt], GroupController.listAll);
router.get("/:id", [checkJwt], GroupController.getGroup);
router.post("/", [checkJwt], GroupController.newGroup);
router.delete("/:id", [checkJwt], GroupController.deleteGroup);

export default router;
