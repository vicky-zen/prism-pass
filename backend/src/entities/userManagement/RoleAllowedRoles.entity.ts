import * as Typeorm from "typeorm";
import * as Entity from "../index.js";
import * as Type from "../../models/index.js";

@Typeorm.Index("role_allowed_roles_pkey", ["allowedRoleId", "roleId"], {
  unique: true
})
@Typeorm.Entity("role_allowed_roles", { schema: "user_management" })
export class RoleAllowedRoles {
  @Typeorm.Column("bigint", { primary: true, name: "role_id" })
  roleId: string;

  @Typeorm.Column("bigint", { primary: true, name: "allowed_role_id" })
  allowedRoleId: string;

  @Typeorm.ManyToOne(
    () => Entity.UserRoles,
    (userRoles) => userRoles.roleAllowedRoles
  )
  @Typeorm.JoinColumn([
    { name: "allowed_role_id", referencedColumnName: "roleId" }
  ])
  allowedRole: Type.Relation<Entity.UserRoles>;

  @Typeorm.ManyToOne(
    () => Entity.UserRoles,
    (userRoles) => userRoles.roleAllowedRoles2
  )
  @Typeorm.JoinColumn([{ name: "role_id", referencedColumnName: "roleId" }])
  role: Type.Relation<Entity.UserRoles>;
}
