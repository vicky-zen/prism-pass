export interface ISaveNoteReq {
  id: string | null;
  title: string;
  note: string;
  isPinned: boolean;
  vaultId: string;
}

export interface ISaveNoteRes {
  isSaved: boolean;
}
