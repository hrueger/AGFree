import { Router } from "express";
import auth from "./auth";
import groups from "./groups";
import user from "./user";

const routes = Router();

routes.use("/auth", auth);
routes.use("/groups", groups);
routes.use("/users", user);

export default routes;
