import { LessThan, MoreThan } from "typeorm";
import * as Entity from "../entities/index.js";
import { AppDataSource } from "../server.js";

export async function findUserByEmail(
  email: string
): Promise<Entity.UserProfile | null> {
  const res = await AppDataSource.getRepository(Entity.UserProfile).findOne({
    where: { email }
  });

  return res;
}

export async function saveUserAndUserOTP(
  user: Entity.UserProfile,
  otp: Entity.SignInOtpHistory,
  activity: Entity.UserLoginActivities
) {
  const queryRunner = AppDataSource.createQueryRunner();
  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();

    await queryRunner.manager.getRepository(Entity.UserProfile).save(user);

    await queryRunner.manager.getRepository(Entity.SignInOtpHistory).save(otp);

    await queryRunner.manager
      .getRepository(Entity.UserLoginActivities)
      .save(activity);

    await queryRunner.commitTransaction();
    return true;
  } catch (err) {
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    await queryRunner.release();
  }
}

export async function getValidOTP(userId: string, noOfTimesTried: number) {
  return await AppDataSource.getRepository(Entity.SignInOtpHistory).findOneBy({
    user: {
      userId
    },
    isValid: true,
    expireAt: MoreThan(new Date()),
    noOfTimesTried: LessThan(noOfTimesTried)
  });
}

export async function saveOTP(
  otp: Entity.SignInOtpHistory,
  activity?: Entity.UserLoginActivities
) {
  const queryRunner = AppDataSource.createQueryRunner();
  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();

    await queryRunner.manager.getRepository(Entity.SignInOtpHistory).save(otp);

    if (activity)
      await queryRunner.manager
        .getRepository(Entity.UserLoginActivities)
        .save(activity);

    await queryRunner.commitTransaction();
    return true;
  } catch (err) {
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    await queryRunner.release();
  }
}

export async function updateOTPInValid(userId: string) {
  await AppDataSource.getRepository(Entity.SignInOtpHistory).update(
    { user: { userId } },
    { isValid: false }
  );
}
