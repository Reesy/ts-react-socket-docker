import { config } from './config';
import { Collection } from 'mongodb';
import { APIComponent } from './APIComponent';
import { DatabaseComponent } from './DatabaseComponent';
import { User } from './interfaces/user';


let main = async () => {
  

  let database = new DatabaseComponent(config);
  await database.connect();

  let userCollection: Collection<User> = await database.getCollection('users');

  let api = new APIComponent(config, userCollection);
  api.init();
  api.start();

};

main();