export interface ResponseAPI {
    success: boolean;
    status: number;
    message: null | string;
    data: any;
}

export interface User {
    name: string;
    username: string;
    bod: string;
    phone_number: string;
    telegram: {
        id: string;
        username: string;
    };
    discord: string;
    // emotions: Schema.Types.ObjectId[];
    time_zone: string;
    start_date: number;
    allow_public: boolean;
    deleted_at: Date;
}
