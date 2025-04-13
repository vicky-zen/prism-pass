import * as Typeorm from "typeorm";
import { EncryptedTransformer } from "../../encryption/encryption.js";
import { Relation } from "../../models/index.js";
import { VaultType } from "../../services/vault-item/vault-item.model.js";
import { Vault } from "./Vault.entity.js";

@Typeorm.Index("card_pkey", ["id"], { unique: true })
@Typeorm.Entity("card", { schema: "pass" })
export class Card {
  @Typeorm.Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()"
  })
  id: string;

  @Typeorm.Column("character varying", { name: "title", length: 100 })
  title: string;

  @Typeorm.Column("character varying", {
    name: "holder_name",
    length: 100,
    transformer: EncryptedTransformer
  })
  holderName: string;

  @Typeorm.Column("character varying", {
    name: "card_number",
    length: 19,
    transformer: EncryptedTransformer
  })
  cardNumber: string;

  @Typeorm.Column("character varying", {
    name: "card_type",
    nullable: true,
    length: 20
  })
  cardType: string | null;

  @Typeorm.Column("date", {
    name: "expiration_date",
    transformer: EncryptedTransformer
  })
  expirationDate: string;

  @Typeorm.Column("character", {
    name: "security_code",
    length: 3,
    transformer: EncryptedTransformer
  })
  securityCode: string;

  @Typeorm.Column("character", {
    name: "pin",
    length: 6,
    transformer: EncryptedTransformer
  })
  pin: string;

  @Typeorm.Column("character varying", {
    name: "note",
    nullable: true,
    length: 250
  })
  note: string | null;

  @Typeorm.Column("enum", {
    name: "type",
    nullable: true,
    enum: ["login", "card", "note", "identity", "alias"],
    default: () => "'card'.e_pass_type"
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

  @Typeorm.ManyToOne(() => Vault, (vault) => vault.cards)
  @Typeorm.JoinColumn([{ name: "vault_id", referencedColumnName: "id" }])
  vault: Relation<Vault>;
}
