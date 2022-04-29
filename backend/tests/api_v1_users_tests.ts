/**
 * Tests for the API v1 user endpoints.
 * Each file represents a User journey through the application as they work contiguously on a test datastore, which is also generated as per the test. 
 */
import { agent as request } from "supertest"; 
import { expect } from 'chai';
import { describe, it, after, before } from 'mocha';
import { config } from "../config";
import { DatabaseComponent } from "../DatabaseComponent";
import { APIComponent } from "../APIComponent";
import { Collection } from "mongodb";
import { User } from "../interfaces/user";

config.dbname = 'TEST_DB';
config.dbcollection = 'notUsers';


let database = new DatabaseComponent(config);
let userCollection: Collection<User>;
let apiComponent: APIComponent;

const api = "/api/v1/users"; 
const insertApi = "/api/v1/user";

before(async () =>
{   
    try
    {
        userCollection = await database.getCollection('testUsers');
        await database.connect().catch((error) => {console.log('Failed to connect to db', error)});
        //We don't need to start the application, just init. Super test will handle starting and stopping the express app
        apiComponent  = new APIComponent(config, userCollection);
        await apiComponent.init();
    } 
    catch(error)
    {
        console.log("There was an error in spinning up the database" + error);
    }
});

 //write an afterall hook to close the database connection
after(async () => 
{
    //I want to drop the database after all the tests are done
    await database.dropDatabase();
    await database.close();
});

describe(`When I call ${api}`, () => 
{ 

    describe("And I send a valid request", () =>
    {

        describe("And the database has no users", () => 
        {
            
            it("Should return a 200", async () =>
            {
                const response = await request(apiComponent.app)
                    .get(api)
                    .set('Accept', 'application/json');
                expect(response.status).to.eql(200);
                
            });

            it("Should return an empty array", async () =>
            {   
                const response = await request(apiComponent.app)
                    .get(api)
                    .set('Accept', 'application/json');
                expect(response.body).to.eql([]);
            });
        });
        
        describe("And the database has 1 user", () =>
        {

            let requestBody = 
            {
                "name": "Test",
                "email": "test@aol.com"   
            };

            it("Should return an array with 1 user", async () =>
            {
                
                const insertionResponse = await request(apiComponent.app)
                    .post(insertApi)
                    .send(requestBody)
                    .set('Accept', 'application/json');
                
                expect(insertionResponse.status).to.eql(200);
                
                const response = await request(apiComponent.app)
                    .get(api)
                    .set('Accept', 'application/json');

                let expectedData = [{
                    "name": "Test",
                    "email": "test@aol.com"
                }]

                expect(response.status).to.eql(200);
                expect(response.body).to.eql(expectedData);
            });

        });

    });
});
