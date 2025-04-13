import * as Typeorm from "typeorm";
import * as Entity from "../index.js";
import * as Type from "../../models/index.js";

@Typeorm.Index("sign_in_otp_history_p_key", ["id"], { unique: true })
@Typeorm.Entity("sign_in_otp_history", { schema: "user_management" })
export class SignInOtpHistory {
  @Typeorm.Column("text", { name: "otp" })
  otp: string;

  @Typeorm.Column("boolean", { name: "is_valid", default: () => "true" })
  isValid: boolean;

  @Typeorm.Column("integer", { name: "no_of_times_tried", default: () => "0" })
  noOfTimesTried: number;

  @Typeorm.Column("timestamp with time zone", {
    name: "create_at",
    default: () => "now()"
  })
  createdAt: Date;

  @Typeorm.Column("timestamp with time zone", { name: "expire_at" })
  expireAt: Date;

  @Typeorm.PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Typeorm.Column("citext", { name: "email_id" })
  emailId: string;

  @Typeorm.Column("boolean", { name: "is_login", default: () => "false" })
  isLogin: boolean;

  @Typeorm.ManyToOne(
    () => Entity.UserProfile,
    (userProfile) => userProfile.signInOtpHistories
  )
  @Typeorm.JoinColumn([{ name: "user_id", referencedColumnName: "userId" }])
  user: Type.Relation<Entity.UserProfile>;
}
