import { IsNull } from "typeorm";
import { PersonalInfo } from "../entities/index.js";
import { AppDataSource } from "../server.js";

export async function savePersonalInfo(info: PersonalInfo): Promise<boolean> {
  const saved = await AppDataSource.getRepository(PersonalInfo).save(info);
  return !!saved;
}

export async function findPersonalInfo(
  userId: string,
  infoId: string,
  vaultId: string
): Promise<PersonalInfo | null> {
  return AppDataSource.getRepository(PersonalInfo).findOne({
    where: {
      id: infoId,
      createdBy: userId,
      vault: {
        id: vaultId
      },
      deletedAt: IsNull()
    }
  });
}

export async function getActivePersonalInfosByVaultId(
  userId: string,
  vaultId: string
): Promise<PersonalInfo[]> {
  return AppDataSource.getRepository(PersonalInfo).find({
    where: {
      vault: { id: vaultId },
      createdBy: userId,
      deletedAt: IsNull()
    },
    order: {
      title: "ASC"
    }
  });
}
