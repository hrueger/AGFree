import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as express from "express";
import * as fs from "fs";
import * as helmet from "helmet";
import * as i18n from "i18n";
import * as path from "path";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { getConfig } from "container-env";
import { Group } from "./entity/Group";
import { User } from "./entity/User";
import routes from "./routes";

const config = getConfig(JSON.parse(fs.readFileSync(path.join(__dirname, "../../container-env.json")).toString()), "/app/agfree-config.json");

i18n.configure({
    // tslint:disable-next-line: no-bitwise
    defaultLocale: config.DEFAULT_LANGUAGE ? config.DEFAULT_LANGUAGE : "en",
    directory: path.join(__dirname, "../assets/i18n"),
    objectNotation: true,
});

// Connects to the Database -> then starts the express
createConnection({
    charset: "utf8mb4",
    cli: {
        entitiesDir: "src/entity",
        migrationsDir: "src/migration",
        subscribersDir: "src/subscriber",
    },
    database: config.DB_NAME,
    entities: [
        User,
        Group,
    ],
    host: config.DB_HOST,
    logging: false,
    migrations: [],
    migrationsRun: true,
    password: config.DB_PASSWORD,
    port: config.DB_PORT,
    synchronize: true,
    type: "mysql",
    username: config.DB_USER,
})
    .then(async (connection) => {
        await connection.query("SET NAMES utf8mb4;");
        await connection.synchronize();
        // eslint-disable-next-line no-console
        console.log("Migrations: ", await connection.runMigrations());
        // Create a new express application instance
        const app = express();

        app.locals.config = config;

        // Call midlewares
        app.use(cors());
        app.use(helmet());
        app.use(bodyParser.json());

        // Set all routes from routes folder
        app.use("/api", routes);

        // Set routes for static built frontend
        app.use("/", express.static("/app/dist/frontend"));
        app.use("*", express.static("/app/dist/frontend/index.html"));

        let port = 80;
        if (process.env.NODE_ENV.trim() == "development") {
            port = 3000;
        }
        app.listen(port, () => {
            // eslint-disable-next-line no-console
            console.log(`Server started on port ${port}!`);
        });
    })
    // eslint-disable-next-line no-console
    .catch((error) => console.log(error));
