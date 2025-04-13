import { IsNull } from "typeorm";
import { Card } from "../entities/index.js";
import { AppDataSource } from "../server.js";

export async function saveCardDetails(cardDetails: Card) {
  return !!(await AppDataSource.getRepository(Card).save(cardDetails));
}

export async function findCardDetails(
  userId: string,
  cardId: string,
  vaultId: string
): Promise<Card | null> {
  return await AppDataSource.getRepository(Card).findOne({
    where: {
      id: cardId,
      createBy: userId,
      vault: {
        id: vaultId
      },
      deletedAt: IsNull()
    }
  });
}

export async function getActiveCardsByVaultId(
  userId: string,
  vaultId: string
): Promise<Card[]> {
  return AppDataSource.getRepository(Card).find({
    where: {
      vault: { id: vaultId },
      createBy: userId,
      deletedAt: IsNull()
    }
  });
}
