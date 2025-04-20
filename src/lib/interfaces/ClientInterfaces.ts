export interface CreateClientRequest {
    name: string;
    facebookAdAccounts: string[];
    // tiktokAdAccounts: string[];
}

export interface CreateClientFacebookAdAccountRequest {
    adAccountId: string;
}