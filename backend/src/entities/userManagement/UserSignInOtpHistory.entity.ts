import * as Typeorm from "typeorm";
import * as Entity from "../index.js";
import * as Type from "../../models/index.js";

@Typeorm.Index("user_sign_in_otp_history_pkey", ["otpId"], { unique: true })
@Typeorm.Entity("user_sign_in_otp_history", { schema: "user_management" })
export class UserSignInOtpHistory {
  @Typeorm.PrimaryGeneratedColumn({ type: "integer", name: "otp_id" })
  otpId: number;

  @Typeorm.Column("text", { name: "otp_code" })
  otpCode: string;

  @Typeorm.Column("boolean", { name: "is_valid", default: () => "true" })
  isValid: boolean;

  @Typeorm.Column("integer", { name: "attempts", default: () => "0" })
  attempts: number;

  @Typeorm.Column("timestamp without time zone", {
    name: "created_at",
    default: () => "now()"
  })
  createdAt: Date;

  @Typeorm.Column("timestamp without time zone", { name: "expires_at" })
  expiresAt: Date;

  @Typeorm.Column("citext", { name: "email" })
  email: string;

  @Typeorm.Column("boolean", { name: "is_logged_in", default: () => "false" })
  isLoggedIn: boolean;

  @Typeorm.ManyToOne(
    () => Entity.UserProfile,
    (userProfile) => userProfile.userSignInOtpHistories
  )
  @Typeorm.JoinColumn([{ name: "user_id", referencedColumnName: "userId" }])
  user: Type.Relation<Entity.UserProfile>;
}
