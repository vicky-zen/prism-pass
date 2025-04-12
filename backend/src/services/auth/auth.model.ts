export interface ILoginOrRegisterUserReq {
  email: string;
  password: string;
}

export interface ILoginOrRegisterUserRes {
  isOTPSent: boolean;
}

export interface IVerifyUserOTPReq {
  email: string;
  otp: string;
}

export interface IVerifyUserOTPRes {
  authorization: string;
}

export interface IResendOTPReq {
  email: string;
}

export interface IResendOTPRes {
  isResent: boolean;
}
