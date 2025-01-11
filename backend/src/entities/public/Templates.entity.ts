import * as Typeorm from "typeorm";

@Typeorm.Index("templates_pkey", ["templateId"], { unique: true })
@Typeorm.Entity("templates", { schema: "public" })
export class Templates {
  @Typeorm.Column("text", { primary: true, name: "template_id" })
  templateId: string;

  @Typeorm.Column("text", { name: "email_subject", nullable: true })
  emailSubject: string | null;

  @Typeorm.Column("text", { name: "email_body", nullable: true })
  emailBody: string | null;

  @Typeorm.Column("text", { name: "push_subject", nullable: true })
  pushSubject: string | null;

  @Typeorm.Column("text", { name: "push_body", nullable: true })
  pushBody: string | null;

  @Typeorm.Column("boolean", { name: "is_active" })
  isActive: boolean;

  @Typeorm.Column("jsonb", { name: "email_cc_list", nullable: true })
  emailCcList: object | null;

  @Typeorm.Column("citext", { name: "body_template", nullable: true })
  bodyTemplate: string | null;

  @Typeorm.Column("citext", { name: "header_template", nullable: true })
  headerTemplate: string | null;

  @Typeorm.Column("citext", { name: "footer_template", nullable: true })
  footerTemplate: string | null;
}
