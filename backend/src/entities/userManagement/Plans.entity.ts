import * as Typeorm from "typeorm";
import * as Entity from "../index.js";

@Typeorm.Index("plans_pkey", ["planId"], { unique: true })
@Typeorm.Entity("plans", { schema: "user_management" })
export class Plans {
  @Typeorm.PrimaryGeneratedColumn({ type: "bigint", name: "plan_id" })
  planId: string;

  @Typeorm.Column("text", { name: "plan_name" })
  planName: string;

  @Typeorm.Column("integer", { name: "max_projects" })
  maxProjects: number;

  @Typeorm.Column("boolean", { name: "project_count_includes_shared" })
  projectCountIncludesShared: boolean;

  @Typeorm.Column("integer", { name: "max_readonly_projects" })
  maxReadonlyProjects: number;

  @Typeorm.Column("integer", { name: "max_shared_projects" })
  maxSharedProjects: number;

  @Typeorm.Column("integer", { name: "max_assignees" })
  maxAssignees: number;

  @Typeorm.Column("boolean", { name: "is_active", default: () => "true" })
  isActive: boolean;

  @Typeorm.OneToMany(() => Entity.UserProfile, (userProfile) => userProfile.plan)
  userProfiles: Entity.UserProfile[];
}
