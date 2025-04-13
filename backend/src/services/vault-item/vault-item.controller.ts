import * as Yup from "yup";
import * as Model from "./vault-item.model.js";
import { AuthToken } from "../../models/api.js";
import * as Repo from "../../repository/index.js";

export class VaultItemController {
  constructor(private authToken: AuthToken) {}

  public async softDeleteItems(
    req: Model.IDeleteItemsReq
  ): Promise<Model.IDeleteItemsRes> {
    await this.validateVaultItemOperationReq(req);

    const isDeleted = await this.performVaultItemAction(req, "soft-delete");
    return { isDeleted };
  }

  public async restoreItems(
    req: Model.IRestoreItemsReq
  ): Promise<Model.IRestoreItemsRes> {
    await this.validateVaultItemOperationReq(req);

    const isRestored = await this.performVaultItemAction(req, "restore");
    return { isRestored };
  }

  public async permanentlyDeleteItems(
    req: Model.IPermanentDeleteItemsReq
  ): Promise<Model.IPermanentDeleteItemsRes> {
    await this.validateVaultItemOperationReq(req);

    const isDeleted = await this.performVaultItemAction(
      req,
      "permanent-delete"
    );
    return { isDeleted };
  }

  private async performVaultItemAction(
    req: Model.IVaultItemOperationReq,
    action: "soft-delete" | "restore" | "permanent-delete"
  ): Promise<boolean> {
    const vault = await Repo.getVaultByIdAndUser(
      this.authToken.userId,
      req.vaultId
    );

    if (!vault) throw new Error("Vault does not belong to the user");

    const grouped = req.items.reduce((acc, item) => {
      if (!acc[item.type]) acc[item.type] = [];
      acc[item.type].push(item.id);
      return acc;
    }, {} as Record<Model.VaultType, string[]>);

    return await Repo.handleVaultItemsAction(
      grouped,
      req.vaultId,
      this.authToken.userId,
      action
    );
  }

  private async validateVaultItemOperationReq(
    req: Model.IVaultItemOperationReq
  ) {
    const schema: Yup.ObjectSchema<Model.IVaultItemOperationReq> =
      Yup.object().shape({
        vaultId: Yup.string().uuid().required(),
        items: Yup.array()
          .of(
            Yup.object({
              id: Yup.string().uuid().required(),
              type: Yup.mixed<Model.VaultType>()
                .oneOf(Object.values(Model.VaultType))
                .required()
            })
          )
          .min(1)
          .required()
      });

    await schema.validate(req, { abortEarly: false });
  }
}
