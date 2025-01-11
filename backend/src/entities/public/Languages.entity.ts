import * as Typeorm from "typeorm";
import * as Entity from "../index.js";

@Typeorm.Index("languages_pkey", ["languageCode"], { unique: true })
@Typeorm.Entity("languages", { schema: "public" })
export class Languages {
  @Typeorm.Column("text", { primary: true, name: "language_code" })
  languageCode: string;

  @Typeorm.Column("text", { name: "language_name", nullable: true })
  languageName: string | null;

  @Typeorm.OneToMany(
    () => Entity.ErrorTexts,
    (errorTexts) => errorTexts.languageCode2
  )
  errorTexts: Entity.ErrorTexts[];
}
