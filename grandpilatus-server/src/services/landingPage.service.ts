import { LandingPageRepository } from "../repositories/landingPage.repository";

// Typed error so the controller can map it to HTTP 409 without string-matching.
export class LandingPageInUseError extends Error {
    constructor() {
        super("Landing page is in use by campaigns");
        this.name = "LandingPageInUseError";
    }
}

// Business logic for landing pages.
export const LandingPageService = {
    async create(data: object) {
        return LandingPageRepository.create(data);
    },

    async list() {
        return LandingPageRepository.findAll();
    },

    async getById(id: string) {
        return LandingPageRepository.findById(id);
    },

    async update(id: string, data: object) {
        return LandingPageRepository.update(id, data);
    },

    // Block deletion when campaigns still reference this page (referential integrity).
    async delete(id: string) {
        const refCount = await LandingPageRepository.countCampaignReferences(id);
        if (refCount > 0) throw new LandingPageInUseError();
        return LandingPageRepository.delete(id);
    },
};
