import * as Yup from "yup";
import * as Common from "../../common/index.js";
import * as Entity from "../../entities/index.js";
import * as Repo from "../../repository/index.js";
import { VaultType } from "../vault-item/vault-item.model.js";
import * as Model from "./card.model.js";

export class CardController {
  constructor(private authToken: Common.AuthToken) {}

  public async saveCardDetails(
    req: Model.ISaveCardDetailsReq
  ): Promise<Model.ISaveCardDetailsRes> {
    await this.validateSaveCardDetailsReq(req);

    if (req.id) {
      const existing = await Repo.findCardDetails(
        this.authToken.userId,
        req.id,
        req.vaultId
      );
      if (!existing) throw new Error("Card with given ID does not exist");
    }

    const cardDetails = this.getSaveCardDetailsInstance(req);
    const isSaved = await Repo.saveCardDetails(cardDetails);

    return { isSaved };
  }

  private async validateSaveCardDetailsReq(req: Model.ISaveCardDetailsReq) {
    const schema: Yup.ObjectSchema<Model.ISaveCardDetailsReq> =
      Yup.object().shape({
        id: Yup.string()
          .uuid("Invalid UUID")
          .nullable()
          .defined("ID is required"),
        vaultId: Yup.string()
          .uuid("Invalid Vault ID")
          .required("Vault ID is required"),
        title: Yup.string()
          .required("Title is required")
          .max(100, "Max 100 chars"),
        holderName: Yup.string()
          .required("Holder name is required")
          .max(100, "Max 100 chars"),
        cardNumber: Yup.string()
          .required("Card number is required")
          .matches(/^\d{13,19}$/, "Must be 13–19 digits"),
        cardType: Yup.string()
          .nullable()
          .max(20, "Max 20 chars")
          .defined("Card type is required"),
        expirationDate: Yup.string()
          .required("Expiration date is required")
          .matches(/^\d{4}-\d{2}$/, "Format: YYYY-MM"),
        securityCode: Yup.string()
          .required("Security code is required")
          .length(3, "Must be 3 digits")
          .matches(/^\d{3}$/, "Must be 3 digits"),
        pin: Yup.string()
          .required("PIN is required")
          .matches(/^\d{4,6}$/, "Must be 4–6 digits"),
        note: Yup.string()
          .nullable()
          .max(250, "Max 250 chars")
          .defined("Note is required"),
        isPinned: Yup.boolean().required("Pinned status is required")
      });

    await schema.validate(req);
  }

  private getSaveCardDetailsInstance(req: Model.ISaveCardDetailsReq) {
    const card = new Entity.Card();
    const vault = new Entity.Vault();
    vault.id = req.vaultId;

    if (req.id) {
      card.id = req.id;
      card.updatedAt = new Date();
    }

    card.title = req.title;
    card.holderName = req.holderName;
    card.cardNumber = req.cardNumber;
    card.cardType = req.cardType;
    card.securityCode = req.securityCode;
    card.pin = req.pin;
    card.note = req.note;
    card.expirationDate = req.expirationDate;
    card.isPinned = req.isPinned;
    card.createdBy = this.authToken.userId;
    card.createdAt = new Date();
    card.deletedAt = null;
    card.type = VaultType.card;

    card.vault = vault;

    return card;
  }
}
