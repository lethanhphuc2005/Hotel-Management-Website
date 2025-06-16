export interface Discount {
    _id?: string;
    name: string;
    image: string;
    description: string;
    type: string;
    value: number;
    start_day: Date;
    end_day: Date;
    quantity: number;
    limit: string;
}