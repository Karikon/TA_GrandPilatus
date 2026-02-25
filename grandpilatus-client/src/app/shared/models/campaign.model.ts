
export interface Campaign {
    _id?: string;
    name: string;
    segmentCriteria?: Record<string, any>;
    segments?: (string | any)[]; // 'any' here to avoid circular dep for now, or import CustomerSegment if strict
    landingPage?: string | any; // 'any' or LandingPage
    schedule?: { startAt?: string; endAt?: string };
    status?: 'draft' | 'scheduled' | 'active' | 'finished';
    metrics?: { sent: number; opened: number; clicked: number };
    createdAt?: string;
}

export interface CampaignPayload {
    name: string;
    segments?: string[];
    landingPage?: string;
    segmentCriteria?: Record<string, any>;
    schedule?: { startAt?: string; endAt?: string };
}

export interface CampaignPerformance {
    campaignId: string;
    name: string;
    deliveryRate: number;
    clickRate: number;
    conversionRate: number;
}
