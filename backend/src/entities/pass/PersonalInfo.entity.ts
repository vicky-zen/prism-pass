import * as Typeorm from "typeorm";

@Typeorm.Index("personal_info_facebook_id_key", ["facebookId"], { unique: true })
@Typeorm.Index("personal_info_gmail_id_key", ["gmailId"], { unique: true })
@Typeorm.Index("personal_info_pkey", ["id"], { unique: true })
@Typeorm.Index("personal_info_instagram_id_key", ["instagramId"], { unique: true })
@Typeorm.Index("personal_info_license_number_key", ["licenseNumber"], { unique: true })
@Typeorm.Index("personal_info_linked_in_key", ["linkedIn"], { unique: true })
@Typeorm.Index("personal_info_passport_number_key", ["passportNumber"], {
  unique: true,
})
@Typeorm.Index("personal_info_personal_website_key", ["personalWebsite"], {
  unique: true,
})
@Typeorm.Index("personal_info_reddit_username_key", ["redditUsername"], {
  unique: true,
})
@Typeorm.Index("personal_info_social_security_number_key", ["socialSecurityNumber"], {
  unique: true,
})
@Typeorm.Index("personal_info_work_email_key", ["workEmail"], { unique: true })
@Typeorm.Index("personal_info_work_id_key", ["workId"], { unique: true })
@Typeorm.Entity("personal_info", { schema: "pass" })
export class PersonalInfo {
  @Typeorm.Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id: string;

  @Typeorm.Column("character varying", { name: "title", length: 100 })
  title: string;

  @Typeorm.Column("character varying", { name: "first_name", length: 100 })
  firstName: string;

  @Typeorm.Column("character varying", {
    name: "middle_name",
    nullable: true,
    length: 100,
  })
  middleName: string | null;

  @Typeorm.Column("character varying", {
    name: "last_name",
    nullable: true,
    length: 100,
  })
  lastName: string | null;

  @Typeorm.Column("character varying", {
    name: "full_name",
    nullable: true,
    length: 100,
  })
  fullName: string | null;

  @Typeorm.Column("character varying", { name: "email", length: 100 })
  email: string;

  @Typeorm.Column("character varying", { name: "mobile", length: 15 })
  mobile: string;

  @Typeorm.Column("date", { name: "birth_date", nullable: true })
  birthDate: string | null;

  @Typeorm.Column("enum", {
    name: "gender",
    nullable: true,
    enum: ["male", "female", "other", "not_to_say"],
  })
  gender: "male" | "female" | "other" | "not_to_say" | null;

  @Typeorm.Column("character varying", {
    name: "org_name",
    nullable: true,
    length: 255,
  })
  orgName: string | null;

  @Typeorm.Column("character varying", {
    name: "street_address",
    nullable: true,
    length: 255,
  })
  streetAddress: string | null;

  @Typeorm.Column("character varying", { name: "floor", nullable: true, length: 50 })
  floor: string | null;

  @Typeorm.Column("character varying", { name: "city", nullable: true, length: 100 })
  city: string | null;

  @Typeorm.Column("character varying", { name: "state", nullable: true, length: 100 })
  state: string | null;

  @Typeorm.Column("character varying", {
    name: "postal_code",
    nullable: true,
    length: 20,
  })
  postalCode: string | null;

  @Typeorm.Column("character varying", { name: "country", nullable: true, length: 100 })
  country: string | null;

  @Typeorm.Column("character varying", { name: "county", nullable: true, length: 100 })
  county: string | null;

  @Typeorm.Column("character varying", {
    name: "social_security_number",
    nullable: true,
    unique: true,
    length: 11,
  })
  socialSecurityNumber: string | null;

  @Typeorm.Column("character varying", {
    name: "passport_number",
    nullable: true,
    unique: true,
    length: 20,
  })
  passportNumber: string | null;

  @Typeorm.Column("character varying", {
    name: "license_number",
    nullable: true,
    unique: true,
    length: 20,
  })
  licenseNumber: string | null;

  @Typeorm.Column("character varying", {
    name: "phone_number",
    nullable: true,
    length: 15,
  })
  phoneNumber: string | null;

  @Typeorm.Column("character varying", {
    name: "personal_website",
    nullable: true,
    unique: true,
    length: 255,
  })
  personalWebsite: string | null;

  @Typeorm.Column("character varying", {
    name: "linked_in",
    nullable: true,
    unique: true,
    length: 255,
  })
  linkedIn: string | null;

  @Typeorm.Column("character varying", {
    name: "reddit_username",
    nullable: true,
    unique: true,
    length: 100,
  })
  redditUsername: string | null;

  @Typeorm.Column("character varying", {
    name: "facebook_id",
    nullable: true,
    unique: true,
    length: 100,
  })
  facebookId: string | null;

  @Typeorm.Column("character varying", {
    name: "instagram_id",
    nullable: true,
    unique: true,
    length: 100,
  })
  instagramId: string | null;

  @Typeorm.Column("character varying", {
    name: "gmail_id",
    nullable: true,
    unique: true,
    length: 100,
  })
  gmailId: string | null;

  @Typeorm.Column("character varying", { name: "company", nullable: true, length: 255 })
  company: string | null;

  @Typeorm.Column("character varying", {
    name: "job_title",
    nullable: true,
    length: 255,
  })
  jobTitle: string | null;

  @Typeorm.Column("character varying", {
    name: "work_id",
    nullable: true,
    unique: true,
    length: 255,
  })
  workId: string | null;

  @Typeorm.Column("character varying", {
    name: "work_phone_number",
    nullable: true,
    length: 15,
  })
  workPhoneNumber: string | null;

  @Typeorm.Column("character varying", {
    name: "work_email",
    nullable: true,
    unique: true,
    length: 100,
  })
  workEmail: string | null;

  @Typeorm.Column("enum", {
    name: "type",
    nullable: true,
    enum: ["login", "card", "note", "identity", "alias"],
    default: () => "'identity'.e_pass_type",
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
