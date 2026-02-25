import { Customer } from "../models/Customer";

// Data-Access-Layer: customers are read-only – the source of truth is the ERP system.
export const CustomerRepository = {
    // Sort alphabetically by name so lookups feel natural in the UI.
    async findAll() {
        return Customer.find().sort({ lastName: 1, firstName: 1 }).lean();
    },
};
