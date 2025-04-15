import * as Yup from "yup";
import * as Common from "../../common/index.js";
import * as Entity from "../../entities/index.js";
import * as Repo from "../../repository/index.js";
import * as Model from "./vault.model.js";

export class VaultController {
  constructor(private authToken: Common.AuthToken) {}

  public async saveVault(
    req: Model.ISaveVaultReq
  ): Promise<Model.ISaveVaultRes> {
    await this.validateSaveVaultReq(req);

    if (req.id) {
      const existing = await Repo.getVaultByIdAndUser(
        this.authToken.userId,
        req.id
      );
      if (!existing) throw new Error("Vault not found");
    }

    const vault = this.buildVaultEntity(req);
    const isSaved = await Repo.saveVault(vault);

    return { isSaved };
  }

  private async validateSaveVaultReq(req: Model.ISaveVaultReq) {
    const schema: Yup.ObjectSchema<Model.ISaveVaultReq> = Yup.object().shape({
      id: Yup.string()
        .uuid("Invalid UUID")
        .nullable()
        .defined("ID is required"),
      title: Yup.string()
        .required("Title is required")
        .max(100, "Max 100 chars"),
      color: Yup.string().required("Color is required"),
      icon: Yup.string().required("Icon is required")
    });

    await schema.validate(req);
  }

  private buildVaultEntity(req: Model.ISaveVaultReq): Entity.Vault {
    const vault = new Entity.Vault();

    if (req.id) {
      vault.id = req.id;
      vault.updatedAt = new Date();
    }

    vault.title = req.title;
    vault.color = req.color;
    vault.icon = req.icon;
    vault.createdBy = this.authToken.userId;
    vault.createdAt = new Date();
    vault.deletedAt = null;

    return vault;
  }

  public async getActiveVaults(): Promise<Model.IGetActiveVaultsRes> {
    const vaults = await Repo.getAllActiveVaultsByUser(this.authToken.userId);

    const result = vaults.map((v) => {
      const { cardCount, loginCount, noteCount, pInfoCount, ...vault } = v;

      return {
        vault,
        totalItems: cardCount + loginCount + noteCount + pInfoCount
      };
    });

    return { vaults: result };
  }

  public async deleteVault(
    req: Model.IDeleteVaultReq
  ): Promise<Model.IDeleteVaultRes> {
    if (!req.id) throw new Error("Vault ID is required");

    const vault = await Repo.getVaultByIdAndUser(this.authToken.userId, req.id);
    if (!vault || vault.deletedAt)
      throw new Error("Vault not found or already deleted");

    vault.deletedAt = new Date();
    vault.updatedAt = new Date();

    const isDeleted = await Repo.deleteVault(this.authToken.userId, vault);

    return { isDeleted };
  }

  public async getVaultById(id: string): Promise<Model.IGetVaultByIdRes> {
    if (!id) throw new Error("Vault ID is required");

    const vault = await Repo.getVaultByIdAndUser(this.authToken.userId, id);
    if (!vault || vault.deletedAt)
      throw new Error("Vault not found or deleted");

    const [cards, logins, notes, personalInfos] = await Promise.all([
      Repo.getActiveCardsByVaultId(this.authToken.userId, id),
      Repo.getActiveLoginsByVaultId(this.authToken.userId, id),
      Repo.getActiveNotesByVaultId(this.authToken.userId, id),
      Repo.getActivePersonalInfosByVaultId(this.authToken.userId, id)
    ]);

    return {
      vault,
      cards,
      logins,
      notes,
      personalInfos,
      cardCount: cards.length,
      loginCount: logins.length,
      noteCount: notes.length,
      personalInfoCount: personalInfos.length
    };
  }

  public async moveItemsToAnotherVault(
    sourceVaultId: string,
    targetVaultId: string
  ): Promise<{ moved: boolean }> {
    const userId = this.authToken.userId;

    const [source, target] = await Promise.all([
      Repo.getVaultByIdAndUser(userId, sourceVaultId),
      Repo.getVaultByIdAndUser(userId, targetVaultId)
    ]);

    if (!source || !target) throw new Error("Source or target vault not found");

    await Repo.moveItemsToVault(userId, sourceVaultId, targetVaultId);

    return { moved: true };
  }
}
