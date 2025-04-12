import { Job } from "bullmq";
import { config } from "dotenv";
import { createTransport } from "nodemailer";
// import { Attachment } from "nodemailer/lib/mailer";

import * as Entity from "../../entities/index.js";
import * as Middleware from "../../middleware/index.js";
import * as Model from "../../models/index.js";
import * as Repo from "../../repository/index.js";

config();

class NotificationHandler {
  public async notificationJobHandler(job: Job) {
    try {
      Middleware.logger.info("notification job process start", {
        id: job.data
      });

      const data = await Repo.getUserNotificationId(job.data);
      if (!data) throw Error(`Job Not found JobId: ${job.data}`);

      await Promise.allSettled([
        this.processAppMessage(data),
        this.processEmail(data),
        this.processMobileMessage(data)
      ]);
    } catch (error) {
      Middleware.logger.error("notification job process error", {
        id: job.data
      });
    }
  }

  public async notificationHandler(notificationId: string) {
    try {
      Middleware.logger.info("notification job process start", {
        id: notificationId
      });

      const data = await Repo.getUserNotificationId(notificationId);
      if (!data) throw Error(`Job Not found JobId: ${notificationId}`);

      await Promise.allSettled([
        this.processAppMessage(data),
        this.processEmail(data),
        this.processMobileMessage(data)
      ]);
    } catch (error) {
      Middleware.logger.error("notification job process error", {
        id: notificationId
      });
    }
  }

  private async processAppMessage(
    notification: Entity.UserNotification
  ): Promise<void> {
    try {
      throw Error("App Message not implement");
    } catch (err) {
      Middleware.logger.error("Error on processEmail", {
        err: err.message,
        data: {
          id: notification.id
        }
      });
      await this.updateUserNotificationErrorMessage(notification.id, err);
    }
  }

  private async updateUserNotificationErrorMessage(id: string, error: object) {
    const notification = new Entity.UserNotification();
    notification.id = id;
    notification.ref = error;
    notification.failureAt = new Date();
    await Repo.saveUserNotification(notification);
  }

  private async processEmail(notification: Entity.UserNotification) {
    try {
      if (!notification.emailNotification) return;
      const res = await this.processEmailDataAndSent(
        notification.emailNotification
      );
      await this.updatePushMsgJobData(notification.id, res.isSent, res.res);
    } catch (err) {
      Middleware.logger.error("Error on processEmail", {
        err: err.message,
        data: {
          id: notification.id
        }
      });
      await this.updateUserNotificationErrorMessage(notification.id, err);
    }
  }

  private async updatePushMsgJobData(
    id: string,
    status: boolean,
    ref: object | null
  ) {
    const notification = new Entity.UserNotification();
    notification.id = id;
    if (status) {
      notification.successAt = new Date();
      notification.isSent = true;
    }
    notification.ref = ref;
    await Repo.saveUserNotification(notification);
  }

  private async processEmailDataAndSent(
    emailNotification: Model.UserEmailNotificationType
  ) {
    const response: {
      isSent: boolean;
      res: object | null;
    } = {
      isSent: false,
      res: null
    };
    try {
      const transport = createTransport({
        service: "gmail",
        secure: true,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD
        }
      });
      // const attachments: Attachment[] = [];

      const res = await transport.sendMail({
        from: `${process.env.EMAIL_FROMNAME} <${process.env.EMAIL_FROM}>`,
        to: emailNotification.emailId.join(","),
        cc: [],
        bcc: [],
        subject: emailNotification.sub,
        html: emailNotification.body,
        attachments: []
      });
      response.isSent = true;
      response.res = res;

      return response;
    } catch (err) {
      response.res = err.message;
      return response;
    }
  }

  private async processMobileMessage(
    notification: Entity.UserNotification
  ): Promise<void> {
    try {
      if (!notification.mobileNotification || !notification.mobileNo) return;

      throw Error("Mobile Message Not Implement");
    } catch (err) {
      Middleware.logger.error("Error on processSms", {
        err: err.message,
        data: {
          id: notification.id
        }
      });
      await this.updateUserNotificationErrorMessage(notification.id, err);
    }
  }
}

export async function notificationJobHandler(job: Job) {
  const notification = new NotificationHandler();
  await notification.notificationJobHandler(job);
}

export async function notificationHandler(notificationId: string) {
  const notification = new NotificationHandler();
  await notification.notificationHandler(notificationId);
}
