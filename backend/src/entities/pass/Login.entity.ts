import * as Typeorm from "typeorm";
import { Relation } from "../../models/index.js";
import { Vault } from "./Vault.entity.js";
import { EncryptedTransformer } from "../../encryption/encryption.js";
import { VaultType } from "../../services/vault-item/vault-item.model.js";

@Typeorm.Index("login_pkey", ["id"], { unique: true })
@Typeorm.Entity("login", { schema: "pass" })
export class Login {
  @Typeorm.Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()"
  })
  id: string;

  @Typeorm.Column("character varying", { name: "title", length: 100 })
  title: string;

  @Typeorm.Column("character varying", {
    name: "user_name",
    nullable: true,
    length: 255,
    transformer: EncryptedTransformer
  })
  userName: string | null;

  @Typeorm.Column("character varying", {
    name: "email",
    nullable: true,
    length: 255,
    transformer: EncryptedTransformer
  })
  email: string | null;

  @Typeorm.Column("character varying", {
    name: "password",
    length: 255,
    transformer: EncryptedTransformer
  })
  password: string;

  @Typeorm.Column("varchar", { name: "websites", nullable: true, array: true })
  websites: string[] | null;

  @Typeorm.Column("character varying", {
    name: "note",
    nullable: true,
    length: 250
  })
  note: string | null;

  @Typeorm.Column("enum", {
    name: "pass_strength",
    enum: ["vulnerable", "weak", "strong"]
  })
  passStrength: "vulnerable" | "weak" | "strong";

  @Typeorm.Column("enum", {
    name: "type",
    nullable: true,
    enum: ["login", "card", "note", "identity", "alias"],
    default: () => "'login'.e_pass_type"
  })
  type: VaultType | null;

  @Typeorm.Column("boolean", { name: "is_pinned", default: () => "false" })
  isPinned: boolean;

  @Typeorm.Column("uuid", { name: "created_by" })
  createdBy: string;

  @Typeorm.CreateDateColumn({
    name: "created_at",
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
    name: "updated_at",
    type: "timestamp with time zone"
  })
  updatedAt: Date;

  @Typeorm.DeleteDateColumn({
    name: "deleted_at",
    type: "timestamp with time zone",
    nullable: true
  })
  deletedAt: Date | null;

  @Typeorm.ManyToOne(() => Vault, (vault) => vault.logins)
  @Typeorm.JoinColumn([{ name: "vault_id", referencedColumnName: "id" }])
  vault: Relation<Vault>;
}
