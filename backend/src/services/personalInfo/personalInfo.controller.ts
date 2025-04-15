import * as Yup from "yup";
import * as Common from "../../common/index.js";
import * as Entity from "../../entities/index.js";
import * as Repo from "../../repository/index.js";
import { VaultType } from "../vault-item/vault-item.model.js";
import * as Model from "./personalInfo.model.js";

export class PersonalInfoController {
  constructor(private authToken: Common.AuthToken) {}

  public async savePersonalInfo(
    req: Model.ISavePersonalInfoReq
  ): Promise<Model.ISavePersonalInfoRes> {
    await this.validateSavePersonalInfoReq(req);

    if (req.id) {
      const existing = await Repo.findPersonalInfo(
        this.authToken.userId,
        req.id,
        req.vaultId
      );
      if (!existing) throw new Error("Personal Info not found");
    }

    const info = this.buildPersonalInfoEntity(req);
    const isSaved = await Repo.savePersonalInfo(info);

    return { isSaved };
  }

  private async validateSavePersonalInfoReq(req: Model.ISavePersonalInfoReq) {
    const schema: Yup.ObjectSchema<Model.ISavePersonalInfoReq> =
      Yup.object().shape({
        id: Yup.string()
          .uuid("Invalid UUID")
          .nullable()
          .defined("ID is required"),
        title: Yup.string()
          .required("Title is required")
          .max(100, "Max 100 chars"),
        firstName: Yup.string()
          .required("First name is required")
          .max(100, "Max 100 chars"),
        middleName: Yup.string()
          .nullable()
          .max(100, "Max 100 chars")
          .defined("Middle name required"),
        lastName: Yup.string()
          .nullable()
          .max(100, "Max 100 chars")
          .defined("Last name required"),
        fullName: Yup.string()
          .nullable()
          .max(100, "Max 100 chars")
          .defined("Full name required"),
        email: Yup.string()
          .email("Invalid email")
          .required("Email is required")
          .max(100, "Max 100 chars"),
        mobile: Yup.string()
          .required("Mobile is required")
          .max(15, "Max 15 digits"),
        birthDate: Yup.string()
          .nullable()
          .matches(/^\d{4}-\d{2}-\d{2}$/, {
            message: "Format: YYYY-MM-DD",
            excludeEmptyString: true
          })
          .defined("Birth date required"),
        gender: Yup.mixed<any>()
          .defined("Gender required")
          .nullable()
          .oneOf(
            ["male", "female", "other", "not_to_say", null],
            "Invalid gender"
          ),
        orgName: Yup.string()
          .nullable()
          .max(255, "Max 255 chars")
          .defined("Org name required"),
        streetAddress: Yup.string()
          .nullable()
          .max(255, "Max 255 chars")
          .defined("Street required"),
        floor: Yup.string()
          .nullable()
          .max(50, "Max 50 chars")
          .defined("Floor required"),
        city: Yup.string()
          .nullable()
          .max(100, "Max 100 chars")
          .defined("City required"),
        state: Yup.string()
          .nullable()
          .max(100, "Max 100 chars")
          .defined("State required"),
        postalCode: Yup.string()
          .nullable()
          .max(20, "Max 20 chars")
          .defined("Postal code required"),
        country: Yup.string()
          .nullable()
          .max(100, "Max 100 chars")
          .defined("Country required"),
        county: Yup.string()
          .nullable()
          .max(100, "Max 100 chars")
          .defined("County required"),
        socialSecurityNumber: Yup.string()
          .nullable()
          .max(11, "Max 11 chars")
          .defined("SSN required")
          .matches(/^\d{3}-\d{2}-\d{4}$/, {
            message: "Format: XXX-XX-XXXX",
            excludeEmptyString: true
          }),
        passportNumber: Yup.string()
          .nullable()
          .max(20, "Max 20 chars")
          .defined("Passport required")
          .matches(/^[A-Za-z0-9]+$/, "Only letters/numbers"),
        licenseNumber: Yup.string()
          .nullable()
          .max(20, "Max 20 chars")
          .defined("License required")
          .matches(/^[A-Za-z0-9]+$/, "Only letters/numbers"),
        phoneNumber: Yup.string()
          .nullable()
          .max(15, "Max 15 digits")
          .defined("Phone required")
          .matches(/^\+?\d{1,15}$/, "Invalid phone number"),
        personalWebsite: Yup.string()
          .nullable()
          .max(255, "Max 255 chars")
          .defined("Website required"),
        linkedIn: Yup.string()
          .nullable()
          .max(255, "Max 255 chars")
          .defined("LinkedIn required"),
        redditUsername: Yup.string()
          .nullable()
          .max(100, "Max 100 chars")
          .defined("Reddit required"),
        facebookId: Yup.string()
          .nullable()
          .max(100, "Max 100 chars")
          .defined("Facebook required"),
        instagramId: Yup.string()
          .nullable()
          .max(100, "Max 100 chars")
          .defined("Instagram required"),
        gmailId: Yup.string()
          .nullable()
          .max(100, "Max 100 chars")
          .defined("Gmail required"),
        company: Yup.string()
          .nullable()
          .max(255, "Max 255 chars")
          .defined("Company required"),
        jobTitle: Yup.string()
          .nullable()
          .max(255, "Max 255 chars")
          .defined("Job title required"),
        workId: Yup.string()
          .nullable()
          .max(255, "Max 255 chars")
          .defined("Work ID required"),
        workPhoneNumber: Yup.string()
          .nullable()
          .max(15, "Max 15 digits")
          .defined("Work phone required"),
        workEmail: Yup.string()
          .nullable()
          .max(100, "Max 100 chars")
          .defined("Work email required"),
        isPinned: Yup.boolean().required("Pinned status required"),
        vaultId: Yup.string()
          .uuid("Invalid UUID")
          .required("Vault ID is required")
      });

    await schema.validate(req);
  }

  private buildPersonalInfoEntity(req: Model.ISavePersonalInfoReq) {
    const info = new Entity.PersonalInfo();
    const vault = new Entity.Vault();
    vault.id = req.vaultId;

    if (req.id) {
      info.id = req.id;
      info.updatedAt = new Date();
    }

    const { id, vaultId, ...rest } = req;
    Object.assign(info, rest);

    info.createdBy = this.authToken.userId;
    info.vault = { id: req.vaultId } as any;
    info.deletedAt = null;
    info.createdAt = new Date();
    info.type = VaultType.identity;
    info.vault = vault;

    return info;
  }
}
