import * as Typeorm from "typeorm";
import * as Entity from "../index.js";

@Typeorm.Index("countries_pkey", ["countryId"], { unique: true })
@Typeorm.Entity("countries", { schema: "public" })
export class Countries {
  @Typeorm.Column("bigint", { primary: true, name: "country_id" })
  countryId: string;

  @Typeorm.Column("citext", { name: "name", nullable: true })
  name: string | null;

  @Typeorm.Column("citext", { name: "iso_3_code", nullable: true })
  iso_3Code: string | null;

  @Typeorm.Column("citext", { name: "iso_2_code", nullable: true })
  iso_2Code: string | null;

  @Typeorm.Column("citext", { name: "numeric_code", nullable: true })
  numericCode: string | null;

  @Typeorm.Column("citext", { name: "phone_code", nullable: true })
  phoneCode: string | null;

  @Typeorm.Column("citext", { name: "capital", nullable: true })
  capital: string | null;

  @Typeorm.Column("citext", { name: "currency", nullable: true })
  currency: string | null;

  @Typeorm.Column("citext", { name: "currency_name", nullable: true })
  currencyName: string | null;

  @Typeorm.Column("citext", { name: "currency_symbol", nullable: true })
  currencySymbol: string | null;

  @Typeorm.Column("citext", { name: "latitude", nullable: true })
  latitude: string | null;

  @Typeorm.Column("citext", { name: "longitude", nullable: true })
  longitude: string | null;

  @Typeorm.Column("citext", { name: "region", nullable: true })
  region: string | null;

  @Typeorm.OneToMany(() => Entity.Cities, (cities) => cities.country)
  cities: Entity.Cities[];

  @Typeorm.OneToMany(() => Entity.States, (states) => states.country)
  states: Entity.States[];

  @Typeorm.OneToMany(() => Entity.Timezones, (timezones) => timezones.country)
  timezones: Entity.Timezones[];
}
