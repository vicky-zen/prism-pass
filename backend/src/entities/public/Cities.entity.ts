import * as Typeorm from "typeorm";
import * as Entity from "../index.js";
import * as Type from "../../models/index.js";

@Typeorm.Index("cities_pkey", ["cityId"], { unique: true })
@Typeorm.Entity("cities", { schema: "public" })
export class Cities {
  @Typeorm.Column("bigint", { primary: true, name: "city_id" })
  cityId: string;

  @Typeorm.Column("citext", { name: "city_name", nullable: true })
  cityName: string | null;

  @Typeorm.Column("citext", { name: "state_code", nullable: true })
  stateCode: string | null;

  @Typeorm.Column("citext", { name: "latitude", nullable: true })
  latitude: string | null;

  @Typeorm.Column("citext", { name: "longitude", nullable: true })
  longitude: string | null;

  @Typeorm.ManyToOne(() => Entity.Countries, (countries) => countries.cities)
  @Typeorm.JoinColumn([{ name: "country_id", referencedColumnName: "countryId" }])
  country: Type.Relation<Entity.Countries>;

  @Typeorm.ManyToOne(() => Entity.States, (states) => states.cities)
  @Typeorm.JoinColumn([{ name: "state_id", referencedColumnName: "stateId" }])
  state: Type.Relation<Entity.States>;
}
