import * as Yup from "yup";
import * as Common from "../../common/index.js";
import * as Entity from "../../entities/index.js";
import * as Repo from "../../repository/index.js";
import { VaultType } from "../vault-item/vault-item.model.js";
import * as Model from "./note.model.js";

export class NoteController {
  constructor(private authToken: Common.AuthToken) {}

  public async saveNote(req: Model.ISaveNoteReq): Promise<Model.ISaveNoteRes> {
    await this.validateSaveNoteReq(req);

    if (req.id) {
      const existing = await Repo.findNoteById(
        this.authToken.userId,
        req.id,
        req.vaultId
      );
      if (!existing) throw new Error("Note with given ID does not exist");
    }

    const note = this.getSaveNoteInstance(req);
    const isSaved = await Repo.saveNote(note);

    return { isSaved };
  }

  private async validateSaveNoteReq(req: Model.ISaveNoteReq) {
    const schema: Yup.ObjectSchema<Model.ISaveNoteReq> = Yup.object().shape({
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
      note: Yup.string().required("Note is required").max(250, "Max 250 chars"),
      isPinned: Yup.boolean().required("Pinned status is required")
    });

    await schema.validate(req);
  }

  private getSaveNoteInstance(req: Model.ISaveNoteReq) {
    const note = new Entity.Note();
    const vault = new Entity.Vault();
    vault.id = req.vaultId;

    if (req.id) {
      note.id = req.id;
      note.updatedAt = new Date();
    }

    note.title = req.title;
    note.note = req.note;
    note.isPinned = req.isPinned;
    note.createdBy = this.authToken.userId;
    note.createdAt = new Date();
    note.deletedAt = null;
    note.type = VaultType.note;
    note.vault = vault;

    return note;
  }
}
