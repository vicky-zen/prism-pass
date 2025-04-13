import * as Yup from "yup";
import * as Common from "../../common/index.js";
import * as Entity from "../../entities/index.js";
import * as Repo from "../../repository/index.js";
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
      id: Yup.string().uuid().nullable().defined(),
      vaultId: Yup.string().uuid().required(),
      title: Yup.string().required().max(100),
      userName: Yup.string().defined().nullable().max(100),
      email: Yup.string().defined().nullable().email().max(100),
      password: Yup.string().required().max(255),
      websites: Yup.array()
        .of(Yup.string().url().max(255).defined())
        .defined()
        .nullable(),
      note: Yup.string().nullable().max(250).defined(),
      isPinned: Yup.boolean().required()
    });

    await schema.validate(req, { abortEarly: false });
  }

  private getSaveLoginInstance(req: Model.ISaveLoginReq) {
    const login = new Entity.Login();
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
    login.createBy = this.authToken.userId;
    login.createdAt = new Date();
    login.deletedAt = null;
    login.type = "login";

    return login;
  }
}
