import * as Typeorm from "typeorm";
import * as Entity from "../index.js";
import * as Type from "../../models/index.js";

@Typeorm.Index("error_texts_pkey", ["errorCode", "languageCode"], {
  unique: true
})
@Typeorm.Index("idx_error_texts_language_code", ["languageCode"], {})
@Typeorm.Entity("error_texts", { schema: "public" })
export class ErrorTexts {
  @Typeorm.Column("citext", { primary: true, name: "error_code" })
  errorCode: string;

  @Typeorm.Column("text", { primary: true, name: "language_code" })
  languageCode: string;

  @Typeorm.Column("text", { name: "error_message" })
  errorMessage: string;

  @Typeorm.Column("citext", { name: "module_name", nullable: true })
  moduleName: string | null;

  @Typeorm.Column("enum", {
    name: "severity_level",
    enum: ["INFO", "WARNING", "ERROR", "CRITICAL"]
  })
  severityLevel: "INFO" | "WARNING" | "ERROR" | "CRITICAL";

  @Typeorm.Column("integer", { name: "http_status_code" })
  httpStatusCode: number;

  @Typeorm.ManyToOne(
    () => Entity.Languages,
    (languages) => languages.errorTexts
  )
  @Typeorm.JoinColumn([
    { name: "language_code", referencedColumnName: "languageCode" }
  ])
  languageCode2: Type.Relation<Entity.Languages>;
}
