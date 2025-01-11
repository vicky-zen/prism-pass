import { RedisOptions } from "bullmq";
import { config } from "dotenv";
import handlebars from "handlebars";

import { QueueRedis } from "../../common/index.js";
import { logger } from "../../middleware/index.js";
import { getFullName } from "../../utils/index.js";

import * as Entity from "../../entities/index.js";
import * as Repo from "../../repository/index.js";
import * as Model from "./notification.model.js";

import { notificationJobHandler } from "./processor.notification.js";

config();

const queueName = process.env.QUEUE_REDIS_KEY_PREFIX + "-Notification";
const rateLimiterPerSec = Number(process.env.QUEUE_RATE_LIMIT_PER_SEC || 100);

const conn: RedisOptions = {
  host: process.env.QUEUE_REDIS_HOST,
  port: Number(process.env.QUEUE_REDIS_PORT),
  password: process.env.QUEUE_REDIS_PASSWORD
};

const queueRedis = new QueueRedis(conn, queueName);
queueRedis.addWorker(notificationJobHandler, rateLimiterPerSec);

export class NotificationController {
  private async addNotification(
    details: Model.NotificationDetails,
    template: Model.TemplateContent,
    type: Model.NotificationType
  ) {
    const processedTemplate = await this.processTemplate(template, details);
    if (
      processedTemplate.userMobileNotification ||
      processedTemplate.userEmailNotification ||
      processedTemplate.userSmsNotification
    ) {
      let userNotification = this.getNewUserNotificationInstance(
        processedTemplate.userEmailNotification || null,
        processedTemplate.userMobileNotification || null,
        processedTemplate.userSmsNotification || null,
        details,
        type
      );
      userNotification = await Repo.saveUserNotification(userNotification);
      queueRedis.addJob(
        userNotification.id,
        userNotification.id
      );
      return;
    }
  }

  private getNewUserNotificationInstance(
    UserEmailNotification: Model.UserEmailNotificationType | null,
    userAppNotifications: Model.UserAppNotificationType | null,
    userSmsNotifications: Model.UserMobileNotificationType | null,
    notificationDetails: Model.NotificationDetails,
    notificationType: Model.NotificationType
  ) {
    const userNotification = new Entity.UserNotification();
    userNotification.user = new Entity.UserProfile();

    userNotification.user.userId = notificationDetails.userId;
    userNotification.emailNotification = UserEmailNotification;
    userNotification.appNotification = userAppNotifications;
    userNotification.mobileNotification = userSmsNotifications;
    userNotification.emailId = notificationDetails.emailId;
    userNotification.mobileNo = notificationDetails.mobileNumber;
    userNotification.otherDetails = notificationDetails.otherDetail
      ? notificationDetails.otherDetail
      : null;
    userNotification.notificationType = notificationType;
    return userNotification;
  }

  private renderHtml<T>(html: string, data: T) {
    return handlebars.compile(html)(data);
  }

  private async processTemplate(
    content: Model.TemplateContent,
    detail: Model.NotificationDetails
  ) {
    let userMobileNotification: Model.UserAppNotificationType | undefined =
      undefined;
    let userEmailNotification: Model.UserEmailNotificationType | undefined =
      undefined;
    let userSmsNotification: Model.UserMobileNotificationType | undefined =
      undefined;
    let isEmailEnabled = false;
    let isMobileEnabled = true;
    if (detail.userId) {
      let notificationSettings = await Repo.getUserSettingByUserId(
        detail.userId
      );
      if (notificationSettings) {
        isEmailEnabled = notificationSettings.emailNotificationEnabled;
        isMobileEnabled = notificationSettings.appNotificationEnabled;
      }
    }
    if (detail.deviceToken && detail.deviceToken.length && isMobileEnabled) {
      const mobNotificationBody = this.renderHtml(content.push.body, detail);
      const mobNotificationTitle = this.renderHtml(
        content.push.subject,
        detail
      );
      const mobNotificationImage = this.renderHtml(content.push.image, detail);
      userMobileNotification = this.getUserMobileNotification(
        mobNotificationTitle,
        mobNotificationBody,
        detail.deviceToken,
        mobNotificationImage,
        detail.color
      );
    }
    if (detail.emailId && isEmailEnabled) {
      const emailNotificationBody = this.renderHtml(content.email.body, detail);
      const emailNotificationSub = this.renderHtml(
        content.email.subject,
        detail
      );
      userEmailNotification = this.getUserEmailNotification(
        emailNotificationSub,
        emailNotificationBody,
        [detail.emailId]
      );
    }

    return {
      userMobileNotification,
      userEmailNotification,
      userSmsNotification
    };
  }

  private getUserMobileNotification(
    title: string,
    body: string,
    deviceToken: string[],
    image: string,
    color?: string
  ): Model.UserAppNotificationType {
    return {
      body,
      deviceToken,
      title,
      image,
      color
    };
  }

  private getUserEmailNotification(
    sub: string,
    body: string,
    emailId: string[]
  ): Model.UserEmailNotificationType {
    return {
      body,
      emailId,
      sub
    };
  }

  private getUseSmsNotification(
    message: string,
    mobileNo: string
  ): Model.UserMobileNotificationType {
    return {
      message,
      mobileNo
    };
  }

  private async getTemplateContent(templateId: string) {
    const template = await Repo.getTemplateById(templateId);

    if (!template) throw Error("template Missing");

    const templateContent: Model.TemplateContent = {
      email: {
        body: template.emailBody ?? "",
        subject: template.emailSubject ?? ""
      },
      push: {
        body: template.pushSubject ?? "",
        subject: template.pushBody ?? "",
        image: ""
      },
      sms: {
        message: ""
      }
    };
    return templateContent;
  }

  // notification functions
  public async sendOTP(req: Model.SendEmailNotificationOTPReq) {
    try {
      const template = await this.getTemplateContent(
        Model.NotificationTemplate.OTPEmail
      );

      const notification = this.getSendEmailOTPDetail(req);

      await this.addNotification(
        notification,
        template,
        Model.NotificationType.OTPEmail
      );
    } catch (err) {
      logger.error("error on sentNotification", { message: err.message });
    }
  }

  private getSendEmailOTPDetail(
    req: Model.SendEmailNotificationOTPReq
  ): Model.SendEmailNotification {
    return {
      deviceToken: [],
      emailId: req.emailId,
      mobileNumber: null,
      userId: req.userId,
      userName: "User",
      otp: req.otp
    };
  }

  public async sendPasswordChanged(req: Model.SendPasswordChangedReq) {
    try {
      const template = await this.getTemplateContent(
        Model.NotificationTemplate.PasswordChanged
      );

      const notification = this.sendPasswordChangedDetail(req);

      await this.addNotification(
        notification,
        template,
        Model.NotificationType.PasswordChanged
      );
    } catch (err) {
      logger.error("error on sentNotification", { message: err.message });
    }
  }

  private sendPasswordChangedDetail(
    req: Model.SendPasswordChangedReq
  ): Model.SendPasswordChangedNotification {
    return {
      deviceToken: [],
      emailId: req.emailId,
      mobileNumber: null,
      userId: req.userId,
      userName: getFullName(req.firstName, req.lastName)
    };
  }

  public async sendForgetPassword(req: Model.SendForgetPasswordReq) {
    try {
      const template = await this.getTemplateContent(
        Model.NotificationTemplate.ForgetPassword
      );

      const notification = this.sendForgetPasswordDetail(req);

      await this.addNotification(
        notification,
        template,
        Model.NotificationType.ForgetPassword
      );
    } catch (err) {
      logger.error("error on sentNotification", { message: err.message });
    }
  }

  private sendForgetPasswordDetail(
    req: Model.SendForgetPasswordReq
  ): Model.SendForgetPasswordNotification {
    return {
      deviceToken: [],
      link: req.link,
      emailId: req.emailId,
      mobileNumber: null,
      userId: req.userId,
      userName: getFullName(req.firstName, req.lastName)
    };
  }
}
