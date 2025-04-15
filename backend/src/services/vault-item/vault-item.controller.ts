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
    const uniqueVaultIds = [...new Set(req.items.map((item) => item.vaultId))];

    for (const vaultId of uniqueVaultIds) {
      const vault = await Repo.getVaultByIdAndUser(
        this.authToken.userId,
        vaultId
      );

      if (!vault)
        throw new Error(`Vault ${vaultId} does not belong to the user`);
    }

    const grouped = req.items.reduce((acc, item) => {
      const key = `${item.vaultId}:${item.type}`;
      if (!acc[key])
        acc[key] = { ids: [], vaultId: item.vaultId, type: item.type };
      acc[key].ids.push(item.id);
      return acc;
    }, {} as Record<string, { ids: string[]; vaultId: string; type: Model.VaultType }>);

    return await Repo.handleVaultItemsAction(
      Object.values(grouped),
      this.authToken.userId,
      action
    );
  }

  private async validateVaultItemOperationReq(
    req: Model.IVaultItemOperationReq
  ) {
    const schema: Yup.ObjectSchema<Model.IVaultItemOperationReq> =
      Yup.object().shape({
        items: Yup.array()
          .of(
            Yup.object({
              id: Yup.string().uuid().required(),
              type: Yup.mixed<Model.VaultType>()
                .oneOf(Object.values(Model.VaultType))
                .required(),
              vaultId: Yup.string().uuid().required()
            })
          )
          .min(1)
          .required()
      });

    await schema.validate(req);
  }

  public async pinOrUnpinItems(
    req: Model.IPinItemsReq
  ): Promise<Model.IPinItemsRes> {
    await this.validatePinReq(req);

    const uniqueVaultIds = [...new Set(req.items.map((item) => item.vaultId))];

    for (const vaultId of uniqueVaultIds) {
      const vault = await Repo.getVaultByIdAndUser(
        this.authToken.userId,
        vaultId
      );
      if (!vault)
        throw new Error(`Vault ${vaultId} does not belong to the user`);
    }

    const grouped = req.items.reduce((acc, item) => {
      const key = `${item.vaultId}:${item.type}`;
      if (!acc[key])
        acc[key] = { ids: [], vaultId: item.vaultId, type: item.type };
      acc[key].ids.push(item.id);
      return acc;
    }, {} as Record<string, { ids: string[]; vaultId: string; type: Model.VaultType }>);

    const isUpdated = await Repo.handleVaultItemsPinAction(
      Object.values(grouped),
      this.authToken.userId,
      req.isPin
    );

    return { isUpdated };
  }

  private async validatePinReq(req: Model.IPinItemsReq) {
    const schema: Yup.ObjectSchema<Model.IPinItemsReq> = Yup.object().shape({
      isPin: Yup.boolean().required(),
      items: Yup.array()
        .of(
          Yup.object({
            id: Yup.string().uuid().required(),
            type: Yup.mixed<Model.VaultType>()
              .oneOf(Object.values(Model.VaultType))
              .required(),
            vaultId: Yup.string().uuid().required()
          })
        )
        .min(1)
        .required()
    });

    await schema.validate(req);
  }
}
