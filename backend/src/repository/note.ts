import { IsNull, Not } from "typeorm";
import { Note } from "../entities/index.js";
import { AppDataSource } from "../server.js";

export async function saveNote(noteDetails: Note): Promise<boolean> {
  const saved = await AppDataSource.getRepository(Note).save(noteDetails);
  return !!saved;
}

export async function findNoteById(
  userId: string,
  noteId: string,
  vaultId: string
): Promise<Note | null> {
  return await AppDataSource.getRepository(Note).findOne({
    where: {
      id: noteId,
      createBy: userId,
      vault: {
        id: vaultId
      },
      deletedAt: IsNull()
    }
  });
}

export async function getActiveNotesByVaultId(
  userId: string,
  vaultId: string
): Promise<Note[]> {
  return AppDataSource.getRepository(Note).find({
    where: {
      vault: { id: vaultId },
      createBy: userId,
      deletedAt: IsNull()
    }
  });
}
