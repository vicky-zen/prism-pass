import * as Typeorm from "typeorm";

@Typeorm.Index("note_pkey", ["id"], { unique: true })
@Typeorm.Entity("note", { schema: "pass" })
export class Note {
  @Typeorm.Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Typeorm.Column("character varying", { name: "title", length: 100 })
  title: string;

  @Typeorm.Column("character varying", { name: "note", length: 250 })
  note: string;

  @Typeorm.Column("enum", {
    name: "type",
    nullable: true,
    enum: ["login", "card", "note", "identity", "alias"],
    default: () => "'note'.e_pass_type",
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
