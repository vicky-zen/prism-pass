export interface IVaultItemOperationReq {
  items: { id: string; type: VaultType; vaultId: string }[];
}

export type IDeleteItemsReq = IVaultItemOperationReq;

export interface IDeleteItemsRes {
  isDeleted: boolean;
}

export type IRestoreItemsReq = IVaultItemOperationReq;

export interface IRestoreItemsRes {
  isRestored: boolean;
}

export type IPermanentDeleteItemsReq = IVaultItemOperationReq;

export interface IPermanentDeleteItemsRes {
  isDeleted: boolean;
}

export interface IPinItemsReq extends IVaultItemOperationReq {
  isPin: boolean;
}

export interface IPinItemsRes {
  isUpdated: boolean;
}

export enum VaultType {
  login = "login",
  card = "card",
  note = "note",
  identity = "identity",
  alias = "alias"
}
