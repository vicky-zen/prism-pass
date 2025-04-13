import * as Yup from "yup";
import * as Common from "../../common/index.js";
import * as Entity from "../../entities/index.js";
import * as Repo from "../../repository/index.js";
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
        id: Yup.string().uuid().nullable().defined(),
        title: Yup.string().required().max(100),
        firstName: Yup.string().required().max(100),
        middleName: Yup.string().nullable().max(100).defined(),
        lastName: Yup.string().nullable().max(100).defined(),
        fullName: Yup.string().nullable().max(100).defined(),
        email: Yup.string().email().required().max(100),
        mobile: Yup.string().required().max(15),
        birthDate: Yup.string()
          .nullable()
          .matches(/^\d{4}-\d{2}-\d{2}$/, {
            message: "Birth date must be in YYYY-MM-DD format",
            excludeEmptyString: true
          })
          .defined(),
        gender: Yup.mixed<any>()
          .defined()
          .nullable()
          .oneOf(["male", "female", "other", "not_to_say", null]),
        orgName: Yup.string().nullable().max(255).defined(),
        streetAddress: Yup.string().nullable().max(255).defined(),
        floor: Yup.string().nullable().max(50).defined(),
        city: Yup.string().nullable().max(100).defined(),
        state: Yup.string().nullable().max(100).defined(),
        postalCode: Yup.string().nullable().max(20).defined(),
        country: Yup.string().nullable().max(100).defined(),
        county: Yup.string().nullable().max(100).defined(),
        socialSecurityNumber: Yup.string().nullable().max(11).defined(),
        passportNumber: Yup.string().nullable().max(20).defined(),
        licenseNumber: Yup.string().nullable().max(20).defined(),
        phoneNumber: Yup.string().nullable().max(15).defined(),
        personalWebsite: Yup.string().nullable().max(255).defined(),
        linkedIn: Yup.string().nullable().max(255).defined(),
        redditUsername: Yup.string().nullable().max(100).defined(),
        facebookId: Yup.string().nullable().max(100).defined(),
        instagramId: Yup.string().nullable().max(100).defined(),
        gmailId: Yup.string().nullable().max(100).defined(),
        company: Yup.string().nullable().max(255).defined(),
        jobTitle: Yup.string().nullable().max(255).defined(),
        workId: Yup.string().nullable().max(255).defined(),
        workPhoneNumber: Yup.string().nullable().max(15).defined(),
        workEmail: Yup.string().nullable().max(100).defined(),
        isPinned: Yup.boolean().required(),
        vaultId: Yup.string().uuid().required()
      });

    await schema.validate(req, { abortEarly: false });
  }

  private buildPersonalInfoEntity(req: Model.ISavePersonalInfoReq) {
    const info = new Entity.PersonalInfo();

    if (req.id) {
      info.id = req.id;
      info.updatedAt = new Date();
    }

    Object.assign(info, req);

    info.createBy = this.authToken.userId;
    info.vault = { id: req.vaultId } as any;
    info.deletedAt = null;
    info.createdAt = new Date();
    info.type = "identity";

    return info;
  }
}
