import { MongoClientOptions, MongoClient, Collection, Db } from 'mongodb';
import { config } from './config';

class DatabaseComponent 
{

    private mongoURI: string;
    private options: MongoClientOptions;
    private mongoClient: MongoClient;
    private database: Db; 

    constructor(_config: config) 
    {
        this.mongoURI = `mongodb://${config.dbhost}:${config.dbport}`;
        this.options = 
        {
            auth: 
            {
                username: config.dbuser,
                password: config.dbpassword
            }
        };

        this.mongoClient = new MongoClient(this.mongoURI, this.options);
        this.database = this.mongoClient.db(config.dbname);
    };


    public async connect(): Promise<MongoClient>
    {
        return await this.mongoClient.connect();
    };

    public async close(): Promise<void>
    {
        return await this.mongoClient.close();
    };

    public async dropDatabase(): Promise<boolean>
    {
        return await this.database.dropDatabase();
    };

    public async getCollection<Type>(_collectionName: string): Promise<Collection<Type>>
    {
       return await this.database.collection<Type>(_collectionName);
    };

};

export { DatabaseComponent };