import * as Yup from "yup";
import * as Common from "../../common/index.js";
import * as Entity from "../../entities/index.js";
import * as Repo from "../../repository/index.js";
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
      id: Yup.string().uuid().nullable().defined(),
      vaultId: Yup.string().uuid().required(),
      title: Yup.string().required().max(100),
      note: Yup.string().required().max(250),
      isPinned: Yup.boolean().required()
    });

    await schema.validate(req, { abortEarly: false });
  }

  private getSaveNoteInstance(req: Model.ISaveNoteReq) {
    const note = new Entity.Note();

    if (req.id) {
      note.id = req.id;
      note.updatedAt = new Date();
    }

    note.title = req.title;
    note.note = req.note;
    note.isPinned = req.isPinned;
    note.createBy = this.authToken.userId;
    note.createdAt = new Date();
    note.deletedAt = null;
    note.type = "note";

    return note;
  }
}
