import express from 'express';
import { Collection } from 'mongodb';
import { config } from './config';
import { User } from './interfaces/user';
import cors from 'cors';

class APIComponent 
{
  
  private users: Collection<User>
  public app: express.Application;

  constructor(_config: config, _users: Collection<User>)
  {
    this.app = express();
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cors());
    this.users = _users;
  };


  public async init()
  {
    this.app.post('/api/v1/user', async (req: express.Request, res: express.Response) =>
    {
      let body = req.body;

      if (typeof(body.name) === "undefined" || body.name === "")
      {
        res.status(400).json({ error: 'Name is required.' });
        return;
      };

      if (typeof(body.email) === "undefined" || body.email === "")
      {
        res.status(400).json({ error: 'Email is required.' });
        return;
      };

      if (!this.validateEmail(body.email))
      {
        res.status(400).json({ error: 'Email is not valid.' });
        return;
      };

      let cursor = await this.users.find<User>({ email: body.email }).collation({ locale: 'en', strength: 2 });; 
      let savedUsers: User[] = await cursor.toArray();
      
      if (savedUsers.length > 0)
      {
        res.status(400).json({ error: 'User already exists.' });
        return;
      };
      
      let data: User = 
      {
        name: body.name,
        email: body.email
      };

      await this.users.insertOne(data);

      let responseMessage = `Added user ${data.name} to the database`;
      res.json(responseMessage);
      return;
    });

    this.app.get('/api/v1/users', async (req: express.Request, res: express.Response) =>
    {
      let cursor = this.users.find<User>({},
        {
          projection: { _id: 0, name: 1, email: 1 }
        })
      
      let savedUsers: User[] = await cursor.toArray();
      res.json(savedUsers);
      return;
    });

    this.app.delete('/api/v1/user/:email', async (req: express.Request, res: express.Response) =>
    {
      let email = req.params.email;

      if (!this.validateEmail(email))
      {
        res.status(400).json({ error: 'Email is not valid.' });
        return;
      };

      let cursor = await this.users.find<User>({ email: email }).collation({ locale: 'en', strength: 2 });; 
      let savedUsers: User[] = await cursor.toArray();
    
      if (savedUsers.length === 0)
      {
        res.status(400).json({ error: 'User does not exist.' });
        return;
      };


      await this.users.deleteMany({ email: email }, {collation: { locale: 'en', strength: 2 }});

      res.json(`Deleted account with email '${email}' from the database`);
      return;
    });
  };

  private validateEmail(email: string): boolean
  {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());

  };

  public async start()
  {
    
    this.app.listen(config.port, () =>
    {
      console.log(`Server listening on port ${config.port}`);
    });
    
    return;
  };

};

export { APIComponent };