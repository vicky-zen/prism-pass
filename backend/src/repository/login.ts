import { IsNull, Not } from "typeorm";
import { Login } from "../entities/index.js";
import { AppDataSource } from "../server.js";

export async function saveLoginDetails(loginDetails: Login): Promise<boolean> {
  const saved = await AppDataSource.getRepository(Login).save(loginDetails);
  return !!saved;
}

export async function findLoginById(
  userId: string,
  loginId: string,
  vaultId: string
): Promise<Login | null> {
  return await AppDataSource.getRepository(Login).findOne({
    where: {
      id: loginId,
      vault: {
        id: vaultId
      },
      createBy: userId,
      deletedAt: IsNull()
    }
  });
}

export async function getActiveLoginsByVaultId(
  userId: string,
  vaultId: string
): Promise<Login[]> {
  return AppDataSource.getRepository(Login).find({
    where: {
      vault: { id: vaultId },
      createBy: userId,
      deletedAt: IsNull()
    }
  });
}
