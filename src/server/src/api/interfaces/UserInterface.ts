export interface UserInterface {
    _id: string;
    name: string;
    username: string;
    bod: string;
    phone_number: string;
    telegram: {
        id: string;
        username: string;
    };
    discord: string;
    time_zone: string;
    start_date: number;
    allow_public: boolean;
    deleted_at: Date;
}
