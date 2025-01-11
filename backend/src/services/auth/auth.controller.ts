import * as Yup from "yup";
import * as Common from "../../common/index.js";
import * as Entity from "../../entities/index.js";
import * as Repo from "../../repository/auth.js";
import * as Utils from "../../utils/index.js";
import * as Model from "./auth.model.js";

export class AuthController {
  public async createUser(
    req: Model.ICreateUserReq,
    ip: string | string[] | undefined
  ) {
    await this.validateCreateUserReq(req);

    const isUserExist = await Repo.findUser(req.email);
    if (isUserExist && isUserExist.deletedAt)
      throw {
        errCode: ["USER002"]
      };

    const user = await this.getCreateUserObj(req, isUserExist?.userId);
    const userOTP = this.signWithOTPInstance(user.userId);
    const activity = await this.getActivityInstance(ip, req.email, user.userId);

    await Repo.saveUserAndUserOTP(user, userOTP, activity);
  }

  private async validateCreateUserReq(req: Model.ICreateUserReq) {
    const schema: Yup.ObjectSchema<Model.ICreateUserReq> = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required().min(8)
    });

    await schema.validate(req);
  }

  private async getCreateUserObj(req: Model.ICreateUserReq, userId?: string) {
    const user = new Entity.UserProfile();
    user.userId = userId ?? Utils.generateUUId();
    user.email = req.email;
    user.passwordHash = await Common.hashPassword(req.password);
    user.deletedAt = null;
    user.token = "";

    return user;
  }

  private signWithOTPInstance(userId: string): Entity.SignInOtpHistory {
    const otpHistory = new Entity.SignInOtpHistory();

    otpHistory.user = new Entity.UserProfile();
    otpHistory.user.userId = userId;
    otpHistory.otp = Utils.generateOTP();
    otpHistory.expireAt = this.addDateSec();

    return otpHistory;
  }

  private addDateSec(): Date {
    const date = new Date();
    date.setSeconds(date.getSeconds() + 1200);
    return date;
  }

  private async getActivityInstance(
    ip: string | string[] | undefined,
    email: string,
    userId: string,
    isLoginSuccess = false,
    isCaptchaEntered = false
  ): Promise<Entity.UserLoginActivities> {
    const activity = new Entity.UserLoginActivities();
    activity.userId = userId;
    activity.email = email;
    activity.isCaptchaEntered = isCaptchaEntered;
    activity.isLoginSuccessful = isLoginSuccess;

    const ipDetails = await Utils.getIpDetail(ip);

    if (ipDetails) {
      activity.ipAddress = ipDetails.ip;
      activity.ipCity = ipDetails.city;
      activity.ipCountry = ipDetails.country_code;
      activity.ipRegion = ipDetails.region;
    }

    return activity;
  }
}
