import * as Typeorm from "typeorm";

@Typeorm.Index("user_login_activities_pkey", ["activityId"], { unique: true })
@Typeorm.Index("idx_user_login_activities_email", ["email"], {})
@Typeorm.Index("idx_user_login_activities_user_id", ["userId"], {})
@Typeorm.Entity("user_login_activities", { schema: "user_management" })
export class UserLoginActivities {
  @Typeorm.PrimaryGeneratedColumn({ type: "bigint", name: "activity_id" })
  activityId: string;

  @Typeorm.Column("uuid", { name: "user_id", default: () => "gen_random_uuid()" })
  userId: string;

  @Typeorm.Column("timestamp with time zone", {
    name: "created_at",
    default: () => "now()",
  })
  createdAt: Date;

  @Typeorm.Column("boolean", { name: "is_login_successful", nullable: true })
  isLoginSuccessful: boolean | null;

  @Typeorm.Column("boolean", { name: "is_captcha_entered", nullable: true })
  isCaptchaEntered: boolean | null;

  @Typeorm.Column("text", { name: "ip_address", nullable: true })
  ipAddress: string | null;

  @Typeorm.Column("citext", { name: "ip_country", nullable: true })
  ipCountry: string | null;

  @Typeorm.Column("citext", { name: "ip_city", nullable: true })
  ipCity: string | null;

  @Typeorm.Column("citext", { name: "ip_region", nullable: true })
  ipRegion: string | null;

  @Typeorm.Column("citext", { name: "email", nullable: true })
  email: string | null;
}
