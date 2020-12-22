export interface SendEmail {
    listingId: string;
    subject: string;
    message: string;
}

export interface SendApplication {
    listingId: string;
    roleApplied: string;
}
