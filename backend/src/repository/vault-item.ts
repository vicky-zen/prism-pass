import * as Typeorm from "typeorm";
import { Card, Login, Note, PersonalInfo, Vault } from "../entities/index.js";
import { AppDataSource } from "../server.js";
import { VaultType } from "../services/vault-item/vault-item.model.js";

export function getEntityClassByType(type: VaultType) {
  switch (type) {
    case VaultType.login:
      return Login;
    case VaultType.card:
      return Card;
    case VaultType.note:
      return Note;
    case VaultType.identity:
      return PersonalInfo;
    default:
      throw new Error(`Unsupported vault item type: ${type}`);
  }
}

export async function handleVaultItemsAction(
  groups: { vaultId: string; type: VaultType; ids: string[] }[],
  userId: string,
  action: "soft-delete" | "restore" | "permanent-delete"
): Promise<boolean> {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    for (const group of groups) {
      const entityClass = getEntityClassByType(group.type);
      await processVaultItems(
        entityClass,
        group.vaultId,
        group.ids,
        userId,
        action,
        queryRunner
      );
    }

    await queryRunner.commitTransaction();
    return true;
  } catch (err) {
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    await queryRunner.release();
  }
}

export async function processVaultItems<
  T extends {
    id: string;
    deletedAt: Date | null;
    vault: Vault;
    createdBy: string;
  }
>(
  EntityClass: Typeorm.EntityTarget<T>,
  vaultId: string,
  ids: string[],
  userId: string,
  action: "soft-delete" | "restore" | "permanent-delete",
  queryRunner: Typeorm.QueryRunner
): Promise<void> {
  const repo: Typeorm.Repository<T> =
    queryRunner.manager.getRepository(EntityClass);

  const whereClause = {
    id: Typeorm.In(ids),
    vault: { id: vaultId },
    createdBy: userId
  } as Typeorm.FindOptionsWhere<T>;

  const items = await repo.find({
    where: whereClause,
    withDeleted: true
  });

  if (items.length !== ids.length) {
    throw new Error("Some items do not belong to the user or the given vault");
  }

  if (action === "soft-delete") {
    await repo.softRemove(items);
  } else if (action === "restore") {
    await repo.recover(items);
  } else if (action === "permanent-delete") {
    await repo.remove(items);
  }
}

export async function handleVaultItemsPinAction(
  groups: { vaultId: string; type: VaultType; ids: string[] }[],
  userId: string,
  isPin: boolean
): Promise<boolean> {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    for (const group of groups) {
      const entityClass = getEntityClassByType(group.type);
      await processPinItems(
        entityClass,
        group.vaultId,
        group.ids,
        userId,
        isPin,
        queryRunner
      );
    }

    await queryRunner.commitTransaction();
    return true;
  } catch (err) {
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    await queryRunner.release();
  }
}

export async function processPinItems<
  T extends {
    id: string;
    vault: Vault;
    createdBy: string;
    isPinned?: boolean;
  }
>(
  EntityClass: Typeorm.EntityTarget<T>,
  vaultId: string,
  ids: string[],
  userId: string,
  isPin: boolean,
  queryRunner: Typeorm.QueryRunner
): Promise<void> {
  const repo: Typeorm.Repository<T> =
    queryRunner.manager.getRepository(EntityClass);

  const items = await repo.find({
    where: {
      id: Typeorm.In(ids),
      vault: { id: vaultId },
      createdBy: userId
    } as Typeorm.FindOptionsWhere<T>
  });

  if (items.length !== ids.length) {
    throw new Error("Some items do not belong to the user or vault");
  }

  for (const item of items) {
    (item as any).isPinned = isPin;
  }

  await repo.save(items);
}
