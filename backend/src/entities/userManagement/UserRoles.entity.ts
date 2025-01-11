import * as Typeorm from "typeorm";
import * as Entity from "../index.js";

@Typeorm.Index("user_roles_pkey", ["roleId"], { unique: true })
@Typeorm.Index("user_roles_role_name_key", ["roleName"], { unique: true })
@Typeorm.Entity("user_roles", { schema: "user_management" })
export class UserRoles {
  @Typeorm.PrimaryGeneratedColumn({ type: "bigint", name: "role_id" })
  roleId: string;

  @Typeorm.Column("text", { name: "role_name", unique: true })
  roleName: string;

  @Typeorm.Column("boolean", {
    name: "is_root",
    nullable: true,
    default: () => "false"
  })
  isRoot: boolean | null;

  @Typeorm.OneToMany(
    () => Entity.RoleAllowedRoles,
    (roleAllowedRoles) => roleAllowedRoles.allowedRole
  )
  roleAllowedRoles: Entity.RoleAllowedRoles[];

  @Typeorm.OneToMany(
    () => Entity.RoleAllowedRoles,
    (roleAllowedRoles) => roleAllowedRoles.role
  )
  roleAllowedRoles2: Entity.RoleAllowedRoles[];

  @Typeorm.OneToMany(
    () => Entity.UserPermissions,
    (userPermissions) => userPermissions.userRoleName2
  )
  userPermissions: Entity.UserPermissions[];

  @Typeorm.OneToMany(
    () => Entity.UserProfile,
    (userProfile) => userProfile.role
  )
  userProfiles: Entity.UserProfile[];
}
