import * as Typeorm from "typeorm";
import * as Type from "../../models/index.js";
import * as Entity from "../index.js";

@Typeorm.Index("user_notification_p_key", ["id"], { unique: true })
@Typeorm.Entity("user_notification", { schema: "user_management" })
export class UserNotification {
  @Typeorm.PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Typeorm.Column("citext", { name: "mobile_no", nullable: true })
  mobileNo: string | null;

  @Typeorm.Column("citext", { name: "email_id", nullable: true })
  emailId: string | null;

  @Typeorm.Column("jsonb", { name: "app_notification", nullable: true })
  appNotification: object | null;

  @Typeorm.Column("jsonb", { name: "email_notification", nullable: true })
  emailNotification: Type.UserEmailNotificationType | null;

  @Typeorm.Column("jsonb", { name: "mobile_notification", nullable: true })
  mobileNotification: object | null;

  @Typeorm.Column("integer", { name: "notification_type" })
  notificationType: number;

  @Typeorm.Column("boolean", {
    name: "is_sent",
    nullable: true,
    default: () => "false"
  })
  isSent: boolean | null;

  @Typeorm.Column("timestamp with time zone", {
    name: "created_at",
    nullable: true,
    default: () => "now()"
  })
  createdAt: Date | null;

  @Typeorm.Column("timestamp with time zone", {
    name: "success_at",
    nullable: true
  })
  successAt: Date | null;

  @Typeorm.Column("json", { name: "ref", nullable: true })
  ref: object | null;

  @Typeorm.Column("boolean", {
    name: "is_user_read",
    nullable: true,
    default: () => "false"
  })
  isUserRead: boolean | null;

  @Typeorm.Column("json", { name: "other_details", nullable: true })
  otherDetails: object | null;

  @Typeorm.Column("timestamp with time zone", {
    name: "failure_at",
    nullable: true
  })
  failureAt: Date | null;

  @Typeorm.ManyToOne(
    () => Entity.UserProfile,
    (userProfile) => userProfile.userNotifications
  )
  @Typeorm.JoinColumn([{ name: "user_id", referencedColumnName: "userId" }])
  user: Type.Relation<Entity.UserProfile>;
}
