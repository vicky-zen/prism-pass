import * as Yup from "yup";
import * as Common from "../../common/index.js";
import * as Entity from "../../entities/index.js";
import * as Repo from "../../repository/index.js";
import { evaluatePasswordStrength } from "../../utils/passwordChecker.js";
import { VaultType } from "../vault-item/vault-item.model.js";
import * as Model from "./login.model.js";

export class LoginController {
  constructor(private authToken: Common.AuthToken) {}

  public async saveLogin(
    req: Model.ISaveLoginReq
  ): Promise<Model.ISaveLoginRes> {
    await this.validateSaveLoginReq(req);

    if (req.id) {
      const existing = await Repo.findLoginById(
        this.authToken.userId,
        req.id,
        req.vaultId
      );
      if (!existing) throw new Error("Login with given ID does not exist");
    }

    const login = this.getSaveLoginInstance(req);
    const isSaved = await Repo.saveLoginDetails(login);

    return { isSaved };
  }

  private async validateSaveLoginReq(req: Model.ISaveLoginReq) {
    const schema: Yup.ObjectSchema<Model.ISaveLoginReq> = Yup.object().shape({
      id: Yup.string()
        .uuid("Invalid UUID")
        .nullable()
        .defined("ID is required"),
      vaultId: Yup.string()
        .uuid("Invalid Vault ID")
        .required("Vault ID is required"),
      title: Yup.string()
        .required("Title is required")
        .max(100, "Max 100 chars"),
      userName: Yup.string()
        .nullable()
        .max(100, "Max 100 chars")
        .defined("Username is required"),
      email: Yup.string()
        .nullable()
        .email("Invalid email")
        .max(100, "Max 100 chars")
        .defined("Email is required"),
      password: Yup.string()
        .required("Password is required")
        .max(255, "Max 255 chars"),
      websites: Yup.array()
        .of(
          Yup.string()
            .url("Invalid URL")
            .max(255, "Max 255 chars")
            .defined("Website URL is required")
        )
        .nullable()
        .defined("Websites list is required"),
      note: Yup.string()
        .nullable()
        .max(250, "Max 250 chars")
        .defined("Note is required"),
      isPinned: Yup.boolean().required("Pinned status required")
    });

    await schema.validate(req);
  }

  private getSaveLoginInstance(req: Model.ISaveLoginReq) {
    const login = new Entity.Login();
    const vault = new Entity.Vault();
    vault.id = req.vaultId;

    if (req.id) {
      login.id = req.id;
      login.updatedAt = new Date();
    }
    login.title = req.title;
    login.password = req.password;
    login.email = req.email;
    login.userName = req.userName;
    login.websites = req.websites;
    login.note = req.note;
    login.isPinned = req.isPinned;
    login.createdBy = this.authToken.userId;
    login.createdAt = new Date();
    login.deletedAt = null;
    login.type = VaultType.login;
    login.vault = vault;
    login.passStrength = evaluatePasswordStrength(req.password);

    return login;
  }
}
