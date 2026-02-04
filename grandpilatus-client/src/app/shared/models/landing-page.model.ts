
export type LandingStatus = 'draft' | 'published';

export interface LandingPage {
    _id?: string;
    title: string;
    bodyHtml: string;
    url: string;
    status: LandingStatus;
    createdAt?: string;
    updatedAt?: string;
}
