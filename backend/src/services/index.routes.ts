import { IRoute } from "../middleware/index.js";
import { AuthRoutes } from "./auth/auth.routes.js";
import { CardRoutes } from "./card/card.routes.js";
import { LoginRoutes } from "./login/login.routes.js";
import { NoteRoutes } from "./note/note.route.js";
import { PersonalInfoRoutes } from "./personalInfo/personalInfo.routes.js";
import { VaultItemRoutes } from "./vault-item/vault-item.routes.js";
import { VaultRoutes } from "./vault/vault.routes.js";

const routes: IRoute[] = [
  ...AuthRoutes,
  ...VaultRoutes,
  ...VaultItemRoutes,
  ...LoginRoutes,
  ...CardRoutes,
  ...NoteRoutes,
  ...PersonalInfoRoutes
];

export default routes;
