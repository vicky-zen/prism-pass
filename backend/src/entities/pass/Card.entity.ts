import * as Typeorm from "typeorm";

@Typeorm.Index("card_pkey", ["id"], { unique: true })
@Typeorm.Entity("card", { schema: "pass" })
export class Card {
  @Typeorm.Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Typeorm.Column("character varying", { name: "title", length: 100 })
  title: string;

  @Typeorm.Column("character varying", { name: "holder_name", length: 100 })
  holderName: string;

  @Typeorm.Column("character varying", { name: "card_number", length: 19 })
  cardNumber: string;

  @Typeorm.Column("character varying", {
    name: "card_type",
    nullable: true,
    length: 20,
  })
  cardType: string | null;

  @Typeorm.Column("date", { name: "expiration_date" })
  expirationDate: string;

  @Typeorm.Column("character", { name: "security_code", length: 3 })
  securityCode: string;

  @Typeorm.Column("character", { name: "pin", length: 3 })
  pin: string;

  @Typeorm.Column("character varying", { name: "note", nullable: true, length: 250 })
  note: string | null;

  @Typeorm.Column("enum", {
    name: "type",
    nullable: true,
    enum: ["login", "card", "note", "identity", "alias"],
    default: () => "'card'.e_pass_type",
  })
  type: "login" | "card" | "note" | "identity" | "alias" | null;

  @Typeorm.Column("boolean", { name: "is_pinned", default: () => "false" })
  isPinned: boolean;

  @Typeorm.Column("uuid", { name: "create_by" })
  createBy: string;

  @Typeorm.Column("timestamp with time zone", {
    name: "create_at",
    nullable: true,
    default: () => "now()",
  })
  createAt: Date | null;

  @Typeorm.Column("integer", {
    name: "modified_count",
    nullable: true,
    default: () => "1",
  })
  modifiedCount: number | null;

  @Typeorm.Column("timestamp with time zone", { name: "update_at", nullable: true })
  updateAt: Date | null;

  @Typeorm.Column("timestamp with time zone", { name: "delete_at", nullable: true })
  deleteAt: Date | null;
}
