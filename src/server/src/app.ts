import "reflect-metadata";
import {
    getMetadataArgsStorage,
    useContainer as routingControllersUseContainer,
    useExpressServer,
} from "routing-controllers";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import hpp from "hpp";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Container } from "typedi";
import { serverConfig, dbConnection } from "@config/app";
import { HttpErrorHandler } from "@middlewares/ErrorHandler";
import { logger, stream } from "@utils/logger";
import { routingControllersToSpec } from "routing-controllers-openapi";
import { getFormattedDate } from "@utils/helper";

export class App {
    public app: express.Application;
    public env: string;
    public port: string | number;

    constructor() {
        this.app = express();
        this.env = serverConfig.NODE_ENV || "development";
        this.port = serverConfig.PORT || 13030;

        try {
            this.connectToDatabase();
            this.useContainer();
            this.initializeMiddlewares();
            this.initializeSwagger();
            this.initializeErrorHandling();
            this.registerRoutingControllers();
            this.registerDefaultPage();
        } catch (err) {
            console.log(err);
        }
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`Environment: ${this.env}`);
            console.log(`🚀 App listening on the port ${this.port}`);
        });
    }

    public getServer() {
        return this.app;
    }

    private async connectToDatabase() {
        await dbConnection();
    }

    private initializeMiddlewares() {
        // this.app.use(morgan(LOG_FORMAT, { stream }));
        this.app.use(cors({ origin: serverConfig.ORIGIN, credentials: Boolean(serverConfig.CREDENTIALS) }));
        this.app.use(hpp());
        this.app.use(helmet());
        this.app.use(compression());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cookieParser());
    }

    private registerRoutingControllers() {
        useExpressServer(this.app, {
            validation: { stopAtFirstError: true },
            cors: true,
            classTransformer: true,
            defaultErrorHandler: false,
            routePrefix: serverConfig.routePrefix,
            controllers: [__dirname + serverConfig.controllersDir],
            middlewares: [__dirname + serverConfig.middlewaresDir],
            // authorizationChecker: HasPermission,
        });
    }

    private registerDefaultPage() {
        this.app.get("/", (req, res) => {
            res.json({
                title: "Welcome to Susie the mood tracking bot",
                date: getFormattedDate(new Date()),
            });
        });
    }

    private useContainer() {
        routingControllersUseContainer(Container);
    }

    private initializeSwagger() {
        // Parse routing-controllers classes into OpenAPI spec:
        const storage = getMetadataArgsStorage();

        const options = {
            info: {
                title: "REST API",
                version: "1.0.0",
                description: "Example docs",
            },

            apis: ["swagger.yaml"],
        };

        const specs = routingControllersToSpec(storage, { routePrefix: "/api" }, options);
        this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
    }

    private initializeErrorHandling() {
        // this.app.use(HttpErrorHandler);
    }
}
