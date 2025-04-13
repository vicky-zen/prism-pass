import * as Entity from "../../entities/index.js";

export interface ISaveVaultReq {
  id: string | null;
  title: string;
  color: string;
  icon: string;
}

export interface ISaveVaultRes {
  isSaved: boolean;
}

export interface IGetVaultByIdReq {
  id: string;
}

export interface IGetVaultByIdRes {
  vault: Entity.Vault;
  cards: Entity.Card[];
  logins: Entity.Login[];
  notes: Entity.Note[];
  personalInfos: Entity.PersonalInfo[];
  cardCount: number;
  loginCount: number;
  noteCount: number;
  personalInfoCount: number;
}

export interface IGetActiveVaultsRes {
  vaults: {
    vault: Entity.Vault;
    totalItems: number;
  }[];
}

export interface IDeleteVaultReq {
  id: string;
}

export interface IDeleteVaultRes {
  isDeleted: boolean;
}
