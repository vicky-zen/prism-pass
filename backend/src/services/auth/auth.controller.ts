import * as Yup from "yup";
import * as Common from "../../common/index.js";
import * as Entity from "../../entities/index.js";
import * as Repo from "../../repository/auth.js";
import * as Utils from "../../utils/index.js";
import { NotificationController } from "../notification/notification.controller.js";
import * as Model from "./auth.model.js";

export class AuthController {
  public async loginOrRegisterUser(
    req: Model.ILoginOrRegisterUserReq,
    ip: string | string[] | undefined
  ): Promise<Model.ILoginOrRegisterUserRes> {
    await this.validateCreateUserReq(req);

    const isUserExist = await Repo.findUserByEmail(req.email);
    if (isUserExist && isUserExist.deletedAt)
      throw {
        errCode: ["USER002"]
      };

    const user = await this.getCreateUserObj(req, isUserExist?.userId);
    const userOTP = this.signWithOTPInstance(user.userId, req.email);
    const activity = await this.getActivityInstance(ip, req.email, user.userId);

    await Repo.saveUserAndUserOTP(user, userOTP, activity);

    const notification = new NotificationController();
    await notification.sendEmailWithOTP({
      emailId: req.email,
      userId: user.userId,
      otp: userOTP.otp
    });

    return { isOTPSent: true };
  }

  private async validateCreateUserReq(req: Model.ILoginOrRegisterUserReq) {
    const schema: Yup.ObjectSchema<Model.ILoginOrRegisterUserReq> =
      Yup.object().shape({
        email: Yup.string().email().required(),
        password: Yup.string().required().min(8)
      });

    await schema.validate(req);
  }

  private async getCreateUserObj(
    req: Model.ILoginOrRegisterUserReq,
    userId?: string
  ) {
    const user = new Entity.UserProfile();
    const userRoles = new Entity.UserRoles();

    user.userId = userId ?? Utils.generateUUId();
    user.email = req.email;
    user.passwordHash = await Common.hashPassword(req.password);
    user.deletedAt = null;
    user.token = "";

    user.role = userRoles;
    user.role.roleId = "2";

    return user;
  }

  private signWithOTPInstance(
    userId: string,
    emailId: string
  ): Entity.SignInOtpHistory {
    const otpHistory = new Entity.SignInOtpHistory();

    otpHistory.user = new Entity.UserProfile();
    otpHistory.user.userId = userId;
    otpHistory.emailId = emailId;
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

  public async verifyOTP(
    req: Model.IVerifyUserOTPReq,
    ip: string | undefined
  ): Promise<Model.IVerifyUserOTPRes> {
    await this.validateVerifyOTPReq(req);
    const user = await Repo.findUserByEmail(req.email);

    if (!user) throw { errCode: ["USER001"] };

    const otp = await Repo.getValidOTP(user.userId, 5);

    if (!otp) throw { errCode: ["OTP001"] };

    if (otp.otp != req.otp) throw { errCode: ["OTP002"] };

    const activity = await this.getActivityInstance(ip, req.email, user.userId);

    otp.isLogin = true;
    otp.isValid = false;

    const payload = this.getAuthTokenPayLoad(user);
    const authorization = Utils.getJWTToken(payload, "email");

    await Repo.saveOTP(otp, activity);
    return { authorization };
  }

  private getAuthTokenPayLoad = (user: Entity.UserProfile) => {
    const payload: Common.AuthToken = {
      email: user.email,
      userId: user.userId,
      userName: Utils.getFullName(user.firstName, user.lastName)
    };

    return payload;
  };

  private validateVerifyOTPReq = async (req: Model.IVerifyUserOTPReq) => {
    const schema: Yup.Schema<Model.IVerifyUserOTPReq> = Yup.object().shape({
      email: Yup.string().required().email(),
      otp: Yup.string().required().matches(Utils.RegExp.otp, "Invalid OTP")
    });

    await schema.validate(req);
  };

  public resendOTP = async (
    req: Model.IResendOTPReq,
    ip: string | undefined
  ): Promise<Model.IResendOTPRes> => {
    await this.validateResendOTPReq(req);

    const user = await Repo.findUserByEmail(req.email);
    if (!user) throw { errCode: ["USER001"] };

    await Repo.updateOTPInValid(user.userId);

    const userOTP = this.signWithOTPInstance(user.userId, req.email);
    const activity = await this.getActivityInstance(ip, req.email, user.userId);

    await Repo.saveOTP(userOTP, activity);

    const notificationController = new NotificationController();

    await notificationController.sendEmailWithOTP({
      emailId: user.email,
      userId: user.userId,
      otp: userOTP.otp
    });

    return { isResent: true };
  };

  private async validateResendOTPReq(req: Model.IResendOTPReq) {
    const schema: Yup.Schema<Model.IResendOTPReq> = Yup.object().shape({
      email: Yup.string().required().email()
    });

    await schema.validate(req);
  }
}
