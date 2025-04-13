import * as Yup from "yup";
import * as Common from "../../common/index.js";
import * as Entity from "../../entities/index.js";
import * as Repo from "../../repository/index.js";
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
        id: Yup.string().uuid().nullable().defined(),
        vaultId: Yup.string().uuid().required(),
        title: Yup.string().required().max(100),
        holderName: Yup.string().required().max(100),
        cardNumber: Yup.string()
          .required()
          .matches(
            /^\d{13,19}$/,
            "Card number must be between 13 to 19 digits"
          ),
        cardType: Yup.string().nullable().max(20).defined(),
        expirationDate: Yup.string()
          .required()
          .matches(
            /^\d{4}-\d{2}$/,
            "Expiration date must be in YYYY-MM format"
          ),
        securityCode: Yup.string()
          .required()
          .length(3)
          .matches(/^\d{3}$/, "Security code must be exactly 3 digits"),
        pin: Yup.string()
          .required()
          .matches(/^\d{4,6}$/, "PIN must be 4 to 6 digits"),
        note: Yup.string().nullable().max(250).defined(),
        isPinned: Yup.boolean().required()
      });

    await schema.validate(req, { abortEarly: false });
  }

  private getSaveCardDetailsInstance(req: Model.ISaveCardDetailsReq) {
    const card = new Entity.Card();

    if (req.id) {
      card.id = req.id;
      card.updatedAt = new Date();
    }

    card.expirationDate = `${req.expirationDate}-01`;

    card.title = req.title;
    card.holderName = req.holderName;
    card.cardNumber = req.cardNumber;
    card.cardType = req.cardType;
    card.securityCode = req.securityCode;
    card.pin = req.pin;
    card.note = req.note;
    card.isPinned = req.isPinned;
    card.createBy = this.authToken.userId;
    card.createdAt = new Date();
    card.deletedAt = null;
    card.type = "card";

    return card;
  }
}
