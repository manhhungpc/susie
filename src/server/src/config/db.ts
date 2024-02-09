import { connect, set } from "mongoose";
import { serverConfig } from "@config/app";

export const dbConnection = async () => {
    const dbConfig = {
        url: serverConfig.MONGO_PATH,
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
    };

    if (serverConfig.NODE_ENV !== "production") {
        // set("debug", true);
    }

    try {
        await connect(dbConfig.url);
        console.log("Connected to mongo!");
    } catch (err) {
        console.log("Caught! Cannot connect to mongodb: ", err);
    }
};
