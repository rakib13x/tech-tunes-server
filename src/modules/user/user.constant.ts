import {
  TSocialPlatform,
  TUserGender,
  TUserRole,
  TUserStatus,
} from "./user.interface";

export const UserRoles: TUserRole[] = ["Admin", "User"];
export const UserStatus: TUserStatus[] = ["Active", "Blocked"];
export const UserGender: TUserGender[] = ["Male", "Female", "Other"] as const;
export const SocialPlatform: TSocialPlatform[] = [
  "Facebook",
  "Instagram",
  "Github",
  "Twitter",
  "Youtube",
  "Linkedin",
];
