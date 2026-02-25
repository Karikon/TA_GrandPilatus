import { Campaign } from "../models/Campaign";

// Data-Access-Layer: all Mongoose queries for campaigns are centralised here.
// Controllers and services never touch the model directly.
export const CampaignRepository = {
    async create(data: object) {
        return Campaign.create(data);
    },

    // Populate references so callers receive full segment and landing-page objects.
    async findAll() {
        return Campaign.find().populate(["segments", "landingPage"]).lean();
    },

    async findById(id: string) {
        return Campaign.findById(id).populate(["segments", "landingPage"]);
    },

    async update(id: string, data: object) {
        return Campaign.findByIdAndUpdate(id, data, { new: true }).populate(["segments", "landingPage"]);
    },

    async delete(id: string) {
        return Campaign.findByIdAndDelete(id);
    },
};
