export interface ISaveCardDetailsReq {
  id: string | null;
  title: string;
  holderName: string;
  cardNumber: string;
  cardType: string | null;
  expirationDate: string;
  securityCode: string;
  pin: string;
  note: string | null;
  isPinned: boolean;
  vaultId: string;
}

export interface ISaveCardDetailsRes {
  isSaved: boolean;
}
