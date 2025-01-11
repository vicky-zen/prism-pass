import * as Typeorm from "typeorm";
import * as Entity from "../index.js";
import * as Type from "../../models/index.js";

@Typeorm.Index("idx_user_permissions_module_code", ["moduleCode"], {})
@Typeorm.Index("unique_permission", ["moduleCode", "userRoleName"], {
  unique: true
})
@Typeorm.Index("user_permissions_pkey", ["permissionId"], { unique: true })
@Typeorm.Index("idx_user_permissions_updated_by", ["updatedBy"], {})
@Typeorm.Entity("user_permissions", { schema: "user_management" })
export class UserPermissions {
  @Typeorm.PrimaryGeneratedColumn({ type: "integer", name: "permission_id" })
  permissionId: number;

  @Typeorm.Column("json", {
    name: "permission_data",
    nullable: true,
    default: {}
  })
  permissionData: object | null;

  @Typeorm.Column("text", { name: "user_role_name", unique: true })
  userRoleName: string;

  @Typeorm.Column("uuid", {
    name: "updated_by",
    default: () => "gen_random_uuid()"
  })
  updatedBy: string;

  @Typeorm.Column("timestamp with time zone", {
    name: "updated_at",
    nullable: true,
    default: () => "now()"
  })
  updatedAt: Date | null;

  @Typeorm.Column("text", { name: "module_code", nullable: true, unique: true })
  moduleCode: string | null;

  @Typeorm.ManyToOne(
    () => Entity.UserProfile,
    (userProfile) => userProfile.userPermissions
  )
  @Typeorm.JoinColumn([{ name: "updated_by", referencedColumnName: "userId" }])
  updatedBy2: Type.Relation<Entity.UserProfile>;

  @Typeorm.ManyToOne(
    () => Entity.UserRoles,
    (userRoles) => userRoles.userPermissions
  )
  @Typeorm.JoinColumn([
    { name: "user_role_name", referencedColumnName: "roleName" }
  ])
  userRoleName2: Type.Relation<Entity.UserRoles>;
}
