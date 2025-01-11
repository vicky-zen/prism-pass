import * as Typeorm from "typeorm";
import * as Entity from "../index.js";
import * as Type from "../../models/index.js";

@Typeorm.Index("user_notification_settings_pkey", ["userId"], { unique: true })
@Typeorm.Entity("user_notification_settings", { schema: "user_management" })
export class UserNotificationSettings {
  @Typeorm.Column("uuid", {
    primary: true,
    name: "user_id",
    default: () => "gen_random_uuid()"
  })
  userId: string;

  @Typeorm.Column("text", { name: "language_code", default: () => "'en'" })
  languageCode: string;

  @Typeorm.Column("boolean", {
    name: "email_notification_enabled",
    default: () => "true"
  })
  emailNotificationEnabled: boolean;

  @Typeorm.Column("boolean", {
    name: "app_notification_enabled",
    default: () => "true"
  })
  appNotificationEnabled: boolean;

  @Typeorm.Column("integer", { name: "theme_id", default: () => "1" })
  themeId: number;

  @Typeorm.Column("text", { name: "dp_base_url", nullable: true })
  dpBaseUrl: string | null;

  @Typeorm.Column("text", { name: "dp_url_path", nullable: true })
  dpUrlPath: string | null;

  @Typeorm.Column("bigint", { name: "country_id", nullable: true })
  countryId: string | null;

  @Typeorm.OneToOne(
    () => Entity.UserProfile,
    (userProfile) => userProfile.userNotificationSettings
  )
  @Typeorm.JoinColumn([{ name: "user_id", referencedColumnName: "userId" }])
  user: Type.Relation<Entity.UserProfile>;
}
