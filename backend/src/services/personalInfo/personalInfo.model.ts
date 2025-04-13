export interface ISavePersonalInfoReq {
  id: string | null;
  title: string;
  firstName: string;
  middleName?: string | null;
  lastName?: string | null;
  fullName?: string | null;
  email: string;
  mobile: string;
  birthDate?: string | null;
  gender?: Gender;
  orgName?: string | null;
  streetAddress?: string | null;
  floor?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country?: string | null;
  county?: string | null;
  socialSecurityNumber?: string | null;
  passportNumber?: string | null;
  licenseNumber?: string | null;
  phoneNumber?: string | null;
  personalWebsite?: string | null;
  linkedIn?: string | null;
  redditUsername?: string | null;
  facebookId?: string | null;
  instagramId?: string | null;
  gmailId?: string | null;
  company?: string | null;
  jobTitle?: string | null;
  workId?: string | null;
  workPhoneNumber?: string | null;
  workEmail?: string | null;
  isPinned: boolean;
  vaultId: string;
}

export interface ISavePersonalInfoRes {
  isSaved: boolean;
}

export type Gender = "male" | "female" | "other" | "not_to_say" | null;
