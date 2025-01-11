import * as Typeorm from "typeorm";
import * as Entity from "../index.js";
import * as Type from "../../models/index.js";

@Typeorm.Index("user_devices_pkey", ["deviceId"], { unique: true })
@Typeorm.Entity("user_devices", { schema: "user_management" })
export class UserDevices {
  @Typeorm.PrimaryGeneratedColumn({ type: "bigint", name: "device_id" })
  deviceId: string;

  @Typeorm.Column("text", { name: "device_type" })
  deviceType: string;

  @Typeorm.Column("text", { name: "device_token" })
  deviceToken: string;

  @Typeorm.Column("boolean", { name: "is_active", default: () => "true" })
  isActive: boolean;

  @Typeorm.Column("timestamp with time zone", {
    name: "created_at",
    default: () => "now()"
  })
  createdAt: Date;

  @Typeorm.Column("timestamp with time zone", {
    name: "updated_at",
    nullable: true
  })
  updatedAt: Date | null;

  @Typeorm.Column("integer", { name: "reason", nullable: true })
  reason: number | null;

  @Typeorm.Column("timestamp with time zone", {
    name: "deleted_at",
    nullable: true
  })
  deletedAt: Date | null;

  @Typeorm.ManyToOne(
    () => Entity.UserProfile,
    (userProfile) => userProfile.userDevices,
    {
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    }
  )
  @Typeorm.JoinColumn([{ name: "user_id", referencedColumnName: "userId" }])
  user: Type.Relation<Entity.UserProfile>;
}
