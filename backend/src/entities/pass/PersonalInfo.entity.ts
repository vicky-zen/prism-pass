import * as Typeorm from "typeorm";
import { Vault } from "../index.js";
import { Relation } from "../../models/index.js";
import { EncryptedTransformer } from "../../encryption/encryption.js";
import { VaultType } from "../../services/vault-item/vault-item.model.js";

@Typeorm.Index("personal_info_facebook_id_key", ["facebookId"], {
  unique: true
})
@Typeorm.Index("personal_info_gmail_id_key", ["gmailId"], { unique: true })
@Typeorm.Index("personal_info_pkey", ["id"], { unique: true })
@Typeorm.Index("personal_info_instagram_id_key", ["instagramId"], {
  unique: true
})
@Typeorm.Index("personal_info_license_number_key", ["licenseNumber"], {
  unique: true
})
@Typeorm.Index("personal_info_linked_in_key", ["linkedIn"], { unique: true })
@Typeorm.Index("personal_info_passport_number_key", ["passportNumber"], {
  unique: true
})
@Typeorm.Index("personal_info_personal_website_key", ["personalWebsite"], {
  unique: true
})
@Typeorm.Index("personal_info_reddit_username_key", ["redditUsername"], {
  unique: true
})
@Typeorm.Index(
  "personal_info_social_security_number_key",
  ["socialSecurityNumber"],
  {
    unique: true
  }
)
@Typeorm.Index("personal_info_work_email_key", ["workEmail"], { unique: true })
@Typeorm.Index("personal_info_work_id_key", ["workId"], { unique: true })
@Typeorm.Entity("personal_info", { schema: "pass" })
export class PersonalInfo {
  @Typeorm.Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()"
  })
  id: string;

  @Typeorm.Column("character varying", { name: "title", length: 100 })
  title: string;

  @Typeorm.Column("character varying", { name: "first_name", length: 100 })
  firstName: string;

  @Typeorm.Column("character varying", {
    name: "middle_name",
    nullable: true,
    length: 100
  })
  middleName: string | null;

  @Typeorm.Column("character varying", {
    name: "last_name",
    nullable: true,
    length: 100
  })
  lastName: string | null;

  @Typeorm.Column("character varying", {
    name: "full_name",
    nullable: true,
    length: 100
  })
  fullName: string | null;

  @Typeorm.Column("character varying", {
    name: "email",
    length: 100,
    transformer: EncryptedTransformer
  })
  email: string;

  @Typeorm.Column("character varying", {
    name: "mobile",
    length: 15,
    transformer: EncryptedTransformer
  })
  mobile: string;

  @Typeorm.Column("date", {
    name: "birth_date",
    nullable: true,
    transformer: EncryptedTransformer
  })
  birthDate: string | null;

  @Typeorm.Column("enum", {
    name: "gender",
    nullable: true,
    enum: ["male", "female", "other", "not_to_say"],
    transformer: EncryptedTransformer
  })
  gender: "male" | "female" | "other" | "not_to_say" | null;

  @Typeorm.Column("character varying", {
    name: "org_name",
    nullable: true,
    length: 255,
    transformer: EncryptedTransformer
  })
  orgName: string | null;

  @Typeorm.Column("character varying", {
    name: "street_address",
    nullable: true,
    length: 255,
    transformer: EncryptedTransformer
  })
  streetAddress: string | null;

  @Typeorm.Column("character varying", {
    name: "floor",
    nullable: true,
    length: 50,
    transformer: EncryptedTransformer
  })
  floor: string | null;

  @Typeorm.Column("character varying", {
    name: "city",
    nullable: true,
    length: 100,
    transformer: EncryptedTransformer
  })
  city: string | null;

  @Typeorm.Column("character varying", {
    name: "state",
    nullable: true,
    length: 100,
    transformer: EncryptedTransformer
  })
  state: string | null;

  @Typeorm.Column("character varying", {
    name: "postal_code",
    nullable: true,
    length: 20,
    transformer: EncryptedTransformer
  })
  postalCode: string | null;

  @Typeorm.Column("character varying", {
    name: "country",
    nullable: true,
    length: 100,
    transformer: EncryptedTransformer
  })
  country: string | null;

  @Typeorm.Column("character varying", {
    name: "county",
    nullable: true,
    length: 100,
    transformer: EncryptedTransformer
  })
  county: string | null;

  @Typeorm.Column("character varying", {
    name: "social_security_number",
    nullable: true,
    unique: true,
    length: 11,
    transformer: EncryptedTransformer
  })
  socialSecurityNumber: string | null;

  @Typeorm.Column("character varying", {
    name: "passport_number",
    nullable: true,
    unique: true,
    length: 20,
    transformer: EncryptedTransformer
  })
  passportNumber: string | null;

  @Typeorm.Column("character varying", {
    name: "license_number",
    nullable: true,
    unique: true,
    length: 20,
    transformer: EncryptedTransformer
  })
  licenseNumber: string | null;

  @Typeorm.Column("character varying", {
    name: "phone_number",
    nullable: true,
    length: 15,
    transformer: EncryptedTransformer
  })
  phoneNumber: string | null;

  @Typeorm.Column("character varying", {
    name: "personal_website",
    nullable: true,
    unique: true,
    length: 255,
    transformer: EncryptedTransformer
  })
  personalWebsite: string | null;

  @Typeorm.Column("character varying", {
    name: "linked_in",
    nullable: true,
    unique: true,
    length: 255,
    transformer: EncryptedTransformer
  })
  linkedIn: string | null;

  @Typeorm.Column("character varying", {
    name: "reddit_username",
    nullable: true,
    unique: true,
    length: 100,
    transformer: EncryptedTransformer
  })
  redditUsername: string | null;

  @Typeorm.Column("character varying", {
    name: "facebook_id",
    nullable: true,
    unique: true,
    length: 100,
    transformer: EncryptedTransformer
  })
  facebookId: string | null;

  @Typeorm.Column("character varying", {
    name: "instagram_id",
    nullable: true,
    unique: true,
    length: 100,
    transformer: EncryptedTransformer
  })
  instagramId: string | null;

  @Typeorm.Column("character varying", {
    name: "gmail_id",
    nullable: true,
    unique: true,
    length: 100,
    transformer: EncryptedTransformer
  })
  gmailId: string | null;

  @Typeorm.Column("character varying", {
    name: "company",
    nullable: true,
    length: 255,
    transformer: EncryptedTransformer
  })
  company: string | null;

  @Typeorm.Column("character varying", {
    name: "job_title",
    nullable: true,
    length: 255,
    transformer: EncryptedTransformer
  })
  jobTitle: string | null;

  @Typeorm.Column("character varying", {
    name: "work_id",
    nullable: true,
    unique: true,
    length: 255,
    transformer: EncryptedTransformer
  })
  workId: string | null;

  @Typeorm.Column("character varying", {
    name: "work_phone_number",
    nullable: true,
    length: 15,
    transformer: EncryptedTransformer
  })
  workPhoneNumber: string | null;

  @Typeorm.Column("character varying", {
    name: "work_email",
    nullable: true,
    unique: true,
    length: 100,
    transformer: EncryptedTransformer
  })
  workEmail: string | null;

  @Typeorm.Column("enum", {
    name: "type",
    nullable: true,
    enum: ["login", "card", "note", "identity", "alias"],
    default: () => "'identity'.e_pass_type"
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

  @Typeorm.ManyToOne(() => Vault, (vault) => vault.personalInfos)
  @Typeorm.JoinColumn([{ name: "vault_id", referencedColumnName: "id" }])
  vault: Relation<Vault>;
}
