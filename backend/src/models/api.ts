export enum Status {
  Success = "Success",
  Error = "Error",
}

export enum UserType {
  User = 0,
}

declare module "express" {
  interface Request {
    authToken: AuthToken;
  }
}

export class AuthToken {
  userId: string;
  userName: string;
  email: string;
  isResetPassword: boolean;
}

export enum APIErrorCode {
  jwt = "jwt",
  validationError = "validationError",
}

export class API_Response<T, U> {
  status: Status;
  error: U[];
  errorCode: string;
  data: T;
  permission?: {
    Read: boolean;
    Write: boolean;
    Approve: boolean;
    Delete: boolean;
  };
}

export const DefaultLanguage = "en";
