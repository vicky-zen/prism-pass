import { IRoute } from "../middleware/index.js";
import { AuthRoutes } from "./auth/auth.routes.js";

const routes: IRoute[] = [...AuthRoutes];

export default routes;
