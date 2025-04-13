export interface ISaveLoginReq {
  id: string | null;
  title: string;
  userName: string | null;
  email: string | null;
  password: string;
  websites: string[] | null;
  note: string | null;
  isPinned: boolean;
  vaultId: string;
}

export interface ISaveLoginRes {
  isSaved: boolean;
}

export enum PasswordStrength {
  vulnerable = "vulnerable",
  weak = "weak",
  strong = "strong"
}
