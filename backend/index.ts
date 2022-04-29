import * as WebSocket from 'ws';
import { config } from './config';
import { Collection } from 'mongodb';
import { DatabaseComponent } from './services/DatabaseService';
import SocketService from './services/SocketService';


let main = async () => {
  

  // let database = new DatabaseComponent(config);
  // await database.connect();

  // let userCollection: Collection<User> = await database.getCollection('users');

  // let api = new APIComponent(config, userCollection);
  // api.init();
  // api.start();
  const wss: WebSocket.Server = new WebSocket.Server({ port: 7070 });

  let socketService = new SocketService(wss);

  socketService.init();
  
};

main();