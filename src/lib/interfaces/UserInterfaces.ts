export interface SetActiveOrganizationRequest {
  activeOrganizationUuid: string;
}

export interface SetNameRequest {
  firstName: string;
  lastName: string;
}

export interface HandleFacebookLoginRequest {
  code: string;
  redirectUri: string;
}