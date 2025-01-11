import * as Typeorm from "typeorm";
import * as Entity from "../index.js";
import * as Type from "../../models/index.js";

@Typeorm.Index("states_pkey", ["stateId"], { unique: true })
@Typeorm.Entity("states", { schema: "public" })
export class States {
  @Typeorm.Column("bigint", { primary: true, name: "state_id" })
  stateId: string;

  @Typeorm.Column("citext", { name: "state_name", nullable: true })
  stateName: string | null;

  @Typeorm.Column("citext", { name: "state_code", nullable: true })
  stateCode: string | null;

  @Typeorm.Column("citext", { name: "latitude", nullable: true })
  latitude: string | null;

  @Typeorm.Column("citext", { name: "longitude", nullable: true })
  longitude: string | null;

  @Typeorm.OneToMany(() => Entity.Cities, (cities) => cities.state)
  cities: Entity.Cities[];

  @Typeorm.ManyToOne(() => Entity.Countries, (countries) => countries.states)
  @Typeorm.JoinColumn([
    { name: "country_id", referencedColumnName: "countryId" }
  ])
  country: Type.Relation<Entity.Countries>;
}
