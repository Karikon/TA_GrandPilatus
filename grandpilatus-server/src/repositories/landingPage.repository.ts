import { LandingPage } from "../models/LandingPage";
import { Campaign } from "../models/Campaign";

// Data-Access-Layer: all Mongoose queries for landing pages.
export const LandingPageRepository = {
    async create(data: object) {
        return LandingPage.create(data);
    },

    // Sort newest first to match the UI default order.
    async findAll() {
        return LandingPage.find().sort({ createdAt: -1 }).lean();
    },

    async findById(id: string) {
        return LandingPage.findById(id).lean();
    },

    async update(id: string, data: object) {
        return LandingPage.findByIdAndUpdate(id, data, { new: true }).lean();
    },

    async delete(id: string) {
        return LandingPage.findByIdAndDelete(id);
    },

    // Returns how many campaigns still reference this landing page (used for integrity checks).
    async countCampaignReferences(id: string): Promise<number> {
        return Campaign.countDocuments({ landingPage: id });
    },
};
