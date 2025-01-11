import * as Typeorm from "typeorm";

@Typeorm.Index("captcha_token_usage_pkey", ["jwtToken"], { unique: true })
@Typeorm.Entity("captcha_token_usage", { schema: "log" })
export class CaptchaTokenUsage {
  @Typeorm.Column("text", { primary: true, name: "jwt_token" })
  jwtToken: string;

  @Typeorm.Column("timestamp with time zone", {
    name: "created_at",
    default: () => "now()",
  })
  createdAt: Date;
}
