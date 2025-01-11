import * as Typeorm from "typeorm";

@Typeorm.Index("password_token_usage_pkey", ["jwtToken"], { unique: true })
@Typeorm.Entity("password_token_usage", { schema: "log" })
export class PasswordTokenUsage {
  @Typeorm.Column("text", { primary: true, name: "jwt_token" })
  jwtToken: string;

  @Typeorm.Column("timestamp with time zone", {
    name: "created_at",
    default: () => "now()",
  })
  createdAt: Date;
}
