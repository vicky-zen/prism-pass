import * as Typeorm from "typeorm";
import { Card } from "./Card.entity.js";
import { Login } from "./Login.entity.js";
import { Note } from "./Note.entity.js";
import { PersonalInfo } from "./PersonalInfo.entity.js";

@Typeorm.Index("vault_pkey", ["id"], { unique: true })
@Typeorm.Entity("vault", { schema: "pass" })
export class Vault {
  @Typeorm.Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()"
  })
  id: string;

  @Typeorm.Column("character varying", { name: "title", length: 100 })
  title: string;

  @Typeorm.Column("text", { name: "color" })
  color: string;

  @Typeorm.Column("text", { name: "icon" })
  icon: string;

  @Typeorm.CreateDateColumn({
    name: "createAt",
    type: "timestamp with time zone"
  })
  createdAt: Date;

  @Typeorm.Column("timestamp with time zone", {
    name: "updatedAt",
    default: () => "CURRENT_TIMESTAMP"
  })
  updatedAt: Date;

  @Typeorm.Column("character varying", { name: "createBy" })
  createBy: string;

  @Typeorm.DeleteDateColumn({
    name: "deleteAt",
    type: "timestamp with time zone",
    nullable: true
  })
  deletedAt: Date | null;

  @Typeorm.OneToMany(() => Card, (card) => card.vault)
  cards: Card[];

  @Typeorm.OneToMany(() => Login, (login) => login.vault)
  logins: Login[];

  @Typeorm.OneToMany(() => Note, (note) => note.vault)
  notes: Note[];

  @Typeorm.OneToMany(() => PersonalInfo, (personalInfo) => personalInfo.vault)
  personalInfos: PersonalInfo[];
}
