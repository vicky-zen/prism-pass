import * as Typeorm from "typeorm";
import * as Entity from "../index.js";
import * as Type from "../../models/index.js";

@Typeorm.Index("user_profile_pkey", ["userId"], { unique: true })
@Typeorm.Entity("user_profile", { schema: "user_management" })
export class UserProfile {
  @Typeorm.Column("uuid", {
    primary: true,
    name: "user_id",
    default: () => "gen_random_uuid()"
  })
  userId: string;

  @Typeorm.Column("text", { name: "email" })
  email: string;

  @Typeorm.Column("text", { name: "first_name", nullable: true })
  firstName: string | null;

  @Typeorm.Column("text", { name: "last_name", nullable: true })
  lastName: string | null;

  @Typeorm.Column("text", { name: "token" })
  token: string;

  @Typeorm.Column("timestamp with time zone", {
    name: "created_at",
    default: () => "now()"
  })
  createdAt: Date;

  @Typeorm.Column("text", { name: "auth_provider", nullable: true })
  authProvider: string | null;

  @Typeorm.Column("bigint", { name: "timezone_id", nullable: true })
  timezoneId: string | null;

  @Typeorm.Column("boolean", {
    name: "is_active",
    nullable: true,
    default: () => "true"
  })
  isActive: boolean | null;

  @Typeorm.Column("text", { name: "password_hash", nullable: true })
  passwordHash: string | null;

  @Typeorm.Column("integer", { name: "user_type", nullable: true })
  userType: number | null;

  @Typeorm.Column("integer", { name: "gender", nullable: true })
  gender: number | null;

  @Typeorm.Column("citext", { name: "address", nullable: true })
  address: string | null;

  @Typeorm.Column("citext", { name: "mobile_number", nullable: true })
  mobileNumber: string | null;

  @Typeorm.Column("timestamp with time zone", {
    name: "deleted_at",
    nullable: true
  })
  deletedAt: Date | null;

  @Typeorm.OneToMany(
    () => Entity.UserDevices,
    (userDevices) => userDevices.user
  )
  userDevices: Entity.UserDevices[];

  @Typeorm.OneToMany(
    () => Entity.SignInOtpHistory,
    (signInOtpHistory) => signInOtpHistory.user
  )
  signInOtpHistories: Entity.SignInOtpHistory[];

  @Typeorm.OneToMany(
    () => Entity.UserNotificationSettings,
    (userNotificationSettings) => userNotificationSettings.user
  )
  userNotificationSettings: Entity.UserNotificationSettings[];

  @Typeorm.OneToMany(
    () => Entity.UserNotification,
    (userNotifications) => userNotifications.user
  )
  userNotifications: Entity.UserNotification[];

  @Typeorm.OneToMany(
    () => Entity.UserPermissions,
    (userPermissions) => userPermissions.updatedBy2
  )
  userPermissions: Entity.UserPermissions[];

  @Typeorm.ManyToOne(() => Entity.Plans, (plans) => plans.userProfiles)
  @Typeorm.JoinColumn([{ name: "plan_id", referencedColumnName: "planId" }])
  plan: Type.Relation<Entity.Plans>;

  @Typeorm.ManyToOne(
    () => Entity.UserRoles,
    (userRoles) => userRoles.userProfiles
  )
  @Typeorm.JoinColumn([{ name: "role_id", referencedColumnName: "roleId" }])
  role: Type.Relation<Entity.UserRoles>;

  @Typeorm.OneToMany(
    () => Entity.UserSignInOtpHistory,
    (userSignInOtpHistory) => userSignInOtpHistory.user
  )
  userSignInOtpHistories: Entity.UserSignInOtpHistory[];
}
