import * as Entity from "../entities/index.js";
import { AppDataSource } from "../server.js";

export const getUserSettingByUserId = async (id: string) => {
  return await AppDataSource.getRepository(
    Entity.UserNotificationSettings
  ).findOne({
    where: {
      userId: id
    },
    select: {
      emailNotificationEnabled: true,
      appNotificationEnabled: true,
      userId: true
    }
  });
};

export const saveUserNotification = async (
  notification: Entity.UserNotification
) => {
  return await AppDataSource.getRepository(Entity.UserNotification).save(
    notification
  );
};

export const getUserNotificationId = async (
  id: string
): Promise<Entity.UserNotification | null> => {
  return AppDataSource.getRepository(Entity.UserNotification).findOneBy({
    id
  });
};
