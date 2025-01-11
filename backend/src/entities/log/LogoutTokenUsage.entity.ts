import * as Typeorm from "typeorm";

@Typeorm.Index("logout_token_usage_pkey", ["token"], { unique: true })
@Typeorm.Entity("logout_token_usage", { schema: "log" })
export class LogoutTokenUsage {
  @Typeorm.Column("text", { primary: true, name: "token" })
  token: string;

  @Typeorm.Column("timestamp with time zone", {
    name: "created_at",
    default: () => "now()",
  })
  createdAt: Date;
}
