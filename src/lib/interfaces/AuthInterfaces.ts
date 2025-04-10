import type { OrganizationRole } from "../enums/enums.js";

export interface RegistrationRequestBody {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface TokenSet {
  accessToken: string;
  refreshToken: string;
}

export interface CleanedUser {
  uuid: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles: OrganizationRoles[];
}

export interface OrganizationRoles {
  role: OrganizationRole | undefined;
  organizationUuid: string;
}

export interface CookieOptions {
  maxAge?: number;
  expires?: Date;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: boolean | "lax" | "strict" | "none";
  domain?: string | undefined;
  path?: string;
}
