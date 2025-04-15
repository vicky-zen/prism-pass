import { IsNull } from "typeorm";
import { Card, Login, Note, PersonalInfo, Vault } from "../entities/index.js";
import { AppDataSource } from "../server.js";

export async function saveVault(vaultDetails: Vault): Promise<boolean> {
  const saved = await AppDataSource.getRepository(Vault).save(vaultDetails);
  return !!saved;
}

export async function getVaultByIdAndUser(
  userId: string,
  vaultId: string
): Promise<Vault | null> {
  return AppDataSource.getRepository(Vault).findOne({
    where: {
      createdBy: userId,
      id: vaultId,
      deletedAt: IsNull()
    }
  });
}

export async function getAllActiveVaultsByUser(createdBy: string): Promise<
  (Vault & {
    cardCount: number;
    loginCount: number;
    noteCount: number;
    pInfoCount: number;
  })[]
> {
  const vaults = await AppDataSource.getRepository(Vault).find({
    where: {
      createdBy,
      deletedAt: IsNull()
    },
    order: {
      title: "ASC"
    }
  });

  const cardRepo = AppDataSource.getRepository(Card);
  const loginRepo = AppDataSource.getRepository(Login);
  const noteRepo = AppDataSource.getRepository(Note);
  const pInfoRepo = AppDataSource.getRepository(PersonalInfo);

  const results = await Promise.all(
    vaults.map(async (vault) => {
      const [cardCount, loginCount, noteCount, pInfoCount] = await Promise.all([
        cardRepo.count({
          where: {
            createdBy,
            vault: { id: vault.id },
            deletedAt: IsNull()
          }
        }),
        loginRepo.count({
          where: {
            createdBy,
            vault: { id: vault.id },
            deletedAt: IsNull()
          }
        }),
        noteRepo.count({
          where: {
            createdBy,
            vault: { id: vault.id },
            deletedAt: IsNull()
          }
        }),
        pInfoRepo.count({
          where: {
            createdBy,
            vault: { id: vault.id },
            deletedAt: IsNull()
          }
        })
      ]);

      return {
        ...vault,
        cardCount,
        loginCount,
        noteCount,
        pInfoCount
      };
    })
  );

  return results;
}

export async function moveItemsToVault(
  userId: string,
  fromVaultId: string,
  toVaultId: string
): Promise<void> {
  const repoList = [Card, Login, Note, PersonalInfo];

  for (const entity of repoList) {
    await AppDataSource.getRepository(entity)
      .createQueryBuilder()
      .update()
      .set({ vault: { id: toVaultId } })
      .where(
        "vaultId = :fromVaultId AND createdBy = :userId AND deletedAt IS NULL",
        { fromVaultId, userId }
      )
      .execute();
  }
}

export async function deleteVault(
  userId: string,
  vault: Vault
): Promise<boolean> {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    await queryRunner.manager.save(vault);

    await queryRunner.manager.softDelete(Login, {
      vault: { id: vault.id },
      createdBy: userId
    });

    await queryRunner.manager.softDelete(Card, {
      vault: { id: vault.id },
      createdBy: userId
    });

    await queryRunner.manager.softDelete(Note, {
      vault: { id: vault.id },
      createdBy: userId
    });

    await queryRunner.manager.softDelete(PersonalInfo, {
      vault: { id: vault.id },
      createdBy: userId
    });

    await queryRunner.commitTransaction();
    return true;
  } catch (err) {
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    await queryRunner.release();
  }
}
