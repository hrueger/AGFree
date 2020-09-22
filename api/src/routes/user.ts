import { Router } from "express";
import UserController from "../controllers/UserController";
import { checkJwt } from "../middlewares/checkJwt";

const router = Router();

router.get("/", [checkJwt], UserController.listAll);
router.post("/", UserController.newUser);
router.post("/edit", [checkJwt], UserController.editCurrent);
// router.delete("/:id([0-9]+)", [checkJwt], UserController.deleteUser);

export default router;
