
import { resolve } from "path"
import { config as dotEnvConfig } from "dotenv"

if (typeof(process.env.MONGO_HOST) !== "undefined")
{
    console.log(`MONGO_HOST env var was set by the host machine as: ${process.env.MONGO_HOST}, any MONGO_HOST property in an .env file will be skipped.`)
};

if (typeof(process.env.MONGO_PORT) !== "undefined")
{
    console.log(`MONGO_PORT env var was set by the host machine as: ${process.env.MONGO_PORT}, any MONGO_PORT property in an .env file will be skipped.`)
};

if (typeof(process.env.MONGO_ROOT_USER) !== "undefined")
{
    console.log(`MONGO_ROOT_USER env var was set by the host machine as: ${process.env.MONGO_ROOT_USER}, any MONGO_ROOT_USER property in an .env file will be skipped.`)
};

if (typeof(process.env.MONGO_ROOT_PASSWORD) !== "undefined")
{
    console.log(`MONGO_ROOT_PASSWORD env var was set by the host machine as: ${process.env.MONGO_ROOT_PASSWORD}, any MONGO_ROOT_PASSWORD property in an .env file will be skipped.`)
};

//This will attempt to grab properties from an .env file if it exists. Any properties already set in the environment will take precedence.
let dotEnvConfigPath: string = resolve(__dirname, "../../.env");
dotEnvConfig({ path: dotEnvConfigPath }); 

if (typeof(process.env.MONGO_ROOT_USER) === "undefined") 
{
    throw new Error("MONGO_ROOT_USER environment var is not set in either the host environment or the .env file");
};

if (typeof(process.env.MONGO_ROOT_PASSWORD) === "undefined") 
{
    throw new Error("MONGO_ROOT_PASSWORD environment var is not set in either the host environment or the .env file");
};

if (typeof(process.env.MONGO_HOST) === "undefined")
{
    throw new Error("MONGO_HOST environment var is not set in either the host environment or the .env file");
};

if (typeof(process.env.MONGO_PORT) === "undefined")
{
    throw new Error("MONGO_PORT environment var is not set in either the host environment or the .env file");
};

export class config {
    public static port: number = 8000;
    public static dbuser: any = process.env.MONGO_ROOT_USER;
    public static dbpassword: any = process.env.MONGO_ROOT_PASSWORD;
    public static dbhost: any = process.env.MONGO_HOST;
    public static dbport: any = process.env.MONGO_PORT;
    public static dbname: string = "ts_mongo_tdd_users";
    public static dbcollection: string = "users";
}