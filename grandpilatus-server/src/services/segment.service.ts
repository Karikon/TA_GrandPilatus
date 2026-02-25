import { SegmentRepository } from "../repositories/segment.repository";

// Business logic for customer segments (currently thin – delegates straight to the repository).
export const SegmentService = {
    async create(data: object) {
        // Populate customers immediately so the caller gets the full object in one round-trip.
        const seg = await SegmentRepository.create(data);
        return (seg as any).populate("customers");
    },

    async list() {
        return SegmentRepository.findAll();
    },

    async getById(id: string) {
        return SegmentRepository.findById(id);
    },

    async update(id: string, data: object) {
        return SegmentRepository.update(id, data);
    },

    async delete(id: string) {
        return SegmentRepository.delete(id);
    },
};
