import { Router } from "express";
import UserController from "../controllers/UserController";
import { checkForAdmin } from "../middlewares/checkForAdmin";
import { checkJwt } from "../middlewares/checkJwt";

const router = Router();

router.get("/", [checkJwt], UserController.listAll);
router.post("/", UserController.newUser);
router.post("/edit", [checkJwt], UserController.editCurrent);
router.post("/schedule", [checkJwt], UserController.saveSchedule);
router.get("/schedule", [checkJwt], UserController.getSchedule);
router.post("/:id([0-9]+)/admin", [checkJwt, checkForAdmin], UserController.changeAdminStatus);
router.delete("/:id([0-9]+)", [checkJwt, checkForAdmin], UserController.deleteUser);

export default router;
