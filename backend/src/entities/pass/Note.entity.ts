import * as Typeorm from "typeorm";
import { Relation } from "../../models/index.js";
import { Vault } from "./Vault.entity.js";
import { VaultType } from "../../services/vault-item/vault-item.model.js";

@Typeorm.Index("note_pkey", ["id"], { unique: true })
@Typeorm.Entity("note", { schema: "pass" })
export class Note {
  @Typeorm.Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()"
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
    default: () => "'note'.e_pass_type"
  })
  type: VaultType | null;

  @Typeorm.Column("boolean", { name: "is_pinned", default: () => "false" })
  isPinned: boolean;

  @Typeorm.Column("uuid", { name: "create_by" })
  createBy: string;

  @Typeorm.CreateDateColumn({
    name: "createAt",
    type: "timestamp with time zone"
  })
  createdAt: Date;

  @Typeorm.Column("integer", {
    name: "modified_count",
    nullable: true,
    default: () => "1"
  })
  modifiedCount: number | null;

  @Typeorm.UpdateDateColumn({
    name: "updateAt",
    type: "timestamp with time zone"
  })
  updatedAt: Date;

  @Typeorm.DeleteDateColumn({
    name: "deleteAt",
    type: "timestamp with time zone",
    nullable: true
  })
  deletedAt: Date | null;

  @Typeorm.ManyToOne(() => Vault, (vault) => vault.notes)
  @Typeorm.JoinColumn([{ name: "vault_id", referencedColumnName: "id" }])
  vault: Relation<Vault>;
}
