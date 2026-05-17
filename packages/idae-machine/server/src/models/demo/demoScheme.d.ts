import type { MachineModel } from '../../../../src/lib/types/machine-model.js';
export declare const demoScheme: MachineModel;
export declare const demoSeed: {
    category: {
        id: number;
        code: string;
        name: string;
        description: string;
    }[];
    location_office: ({
        id: number;
        code: string;
        address: string;
        city: string;
        country: string;
        phone: string;
    } | {
        id: number;
        code: string;
        address: string;
        city: string;
        country: string;
        phone?: undefined;
    })[];
    vehicle: {
        id: number;
        license_plate: string;
        model: string;
        brand: string;
        year: number;
        categoryId: number;
        locationOfficeId: number;
        status: string;
        mileage: number;
    }[];
    customer: ({
        id: number;
        first_name: string;
        last_name: string;
        email: string;
        phone: string;
    } | {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
        phone?: undefined;
    })[];
    rental: {
        id: number;
        vehicleId: number;
        customerId: number;
        start_date: Date;
        end_date: Date;
        price_per_day: number;
        total_price: number;
        status: string;
    }[];
    maintenance: {
        id: number;
        vehicleId: number;
        date: Date;
        type: string;
        cost: number;
        notes: string;
    }[];
};
export default demoSeed;
