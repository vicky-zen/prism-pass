import * as Typeorm from "typeorm";

@Typeorm.Index("modules_display_order_u_index", ["displayOrder"], {
  unique: true
})
@Typeorm.Index("modules_pkey", ["id"], { unique: true })
@Typeorm.Index("modules_module_group_idx", ["moduleGroup"], {})
@Typeorm.Entity("modules", { schema: "public" })
export class Modules {
  @Typeorm.Column("text", { primary: true, name: "id" })
  id: string;

  @Typeorm.Column("text", { name: "description", nullable: true })
  description: string | null;

  @Typeorm.Column("text", {
    name: "available_permissions",
    nullable: true,
    array: true
  })
  availablePermissions: string[] | null;

  @Typeorm.Column("text", { name: "title", nullable: true })
  title: string | null;

  @Typeorm.Column("integer", { name: "display_order", nullable: true })
  displayOrder: number | null;

  @Typeorm.Column("citext", { name: "module_group", nullable: true })
  moduleGroup: string | null;
}
