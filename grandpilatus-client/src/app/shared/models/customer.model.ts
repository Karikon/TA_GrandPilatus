
export interface Address { street?: string; zip?: string; city?: string; country?: string; }

export interface Customer {
    _id: string;
    firstName: string;
    lastName: string;
    age?: number;
    interests?: string[];
    address?: Address;
}

export interface CustomerSegment {
    _id?: string;
    title: string;
    customers: (string | Customer)[];
    createdAt?: string;
    updatedAt?: string;
}

export interface SegmentPayload {
    title: string;
    customers: string[]; // ids only
}
