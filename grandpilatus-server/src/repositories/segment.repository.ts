import { CustomerSegment } from "../models/CustomerSegment";

// Data-Access-Layer: all Mongoose queries for customer segments.
export const SegmentRepository = {
    async create(data: object) {
        return CustomerSegment.create(data);
    },

    // Sort newest first so the UI shows fresh segments at the top.
    async findAll() {
        return CustomerSegment.find().populate("customers").sort({ createdAt: -1 }).lean();
    },

    async findById(id: string) {
        return CustomerSegment.findById(id).populate("customers").lean();
    },

    async update(id: string, data: object) {
        return CustomerSegment.findByIdAndUpdate(id, data, { new: true }).populate("customers").lean();
    },

    async delete(id: string) {
        return CustomerSegment.findByIdAndDelete(id);
    },
};
