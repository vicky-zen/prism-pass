export interface NotificationDetails {
    deviceToken: string[] | null,
    emailId: string | null,
    mobileNumber: string | null,
    userId: string,
    userName: string;
    otherDetail?: object;
    color?: string;
}

export interface TemplateContent {
    push: { body: string, subject: string; image: string; },
    email: { body: string, subject: string; },
    sms: { message: string; };
}

export interface UserAppNotificationType {
    title: string,
    body: string,
    deviceToken: string[];
    image?: string;
    color?: string;
}

export interface UserEmailNotificationType {
    sub: string,
    body: string,
    emailId: string[];
}

export interface UserMobileNotificationType {
    message: string;
    mobileNo: string;
}


export interface EmailSettings {
    auth: {
        pass: string;
        user: string;
        encryption: string;
    };
    from: string;
    host: string;
    port: number;
    fromName: string;
}

export enum NotificationType {
    OTPEmail = 1,
    PasswordChanged,
    ForgetPassword,
    NewPostAdmin,
    UpdatePostToAdmin,
    UpdatePostToUser,
    AdminStatusChanged
}


export enum NotificationTemplate {
    OTPEmail = "otp_email",
    PasswordChanged = "password_changed",
    ForgetPassword = "forget_password",
    NewPostAdmin = "new_post_admin",
    UpdatePostToAdmin = "update_post_to_admin",
    UpdatePostToUser = "update_post_to_user",
    AdminStatusChanged = "admin_status_changed"
}

export interface SendEmailNotificationOTPReq {
    emailId: string,
    userId: string,
    otp: string;
}

export interface SendEmailNotification extends NotificationDetails {
    emailId: string,
    userId: string,
    otp: string;
}

export interface SendPasswordChangedReq {
    userId: string,
    emailId: string,
    firstName: string | null,
    lastName: string | null;
}

export type SendPasswordChangedNotification = NotificationDetails;


export interface SendForgetPasswordReq {
    userId: string,
    emailId: string,
    firstName: string | null,
    lastName: string | null;
    link: string;
}

export interface SendForgetPasswordNotification extends NotificationDetails {
    link: string;
}
