import * as Typeorm from "typeorm";
import * as Entity from "../index.js";
import * as Type from "../../models/index.js";

@Typeorm.Index("timezones_pkey", ["timezoneId"], { unique: true })
@Typeorm.Entity("timezones", { schema: "public" })
export class Timezones {
  @Typeorm.PrimaryGeneratedColumn({ type: "integer", name: "timezone_id" })
  timezoneId: number;

  @Typeorm.Column("citext", { name: "timezone_name", nullable: true })
  timezoneName: string | null;

  @Typeorm.Column("integer", { name: "gmt_offset", nullable: true })
  gmtOffset: number | null;

  @Typeorm.Column("citext", { name: "gmt_offset_name", nullable: true })
  gmtOffsetName: string | null;

  @Typeorm.Column("citext", { name: "abbreviation", nullable: true })
  abbreviation: string | null;

  @Typeorm.ManyToOne(() => Entity.Countries, (countries) => countries.timezones)
  @Typeorm.JoinColumn([
    { name: "country_id", referencedColumnName: "countryId" }
  ])
  country: Type.Relation<Entity.Countries>;
}
