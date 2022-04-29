import * as WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';

type Timer = ReturnType<typeof setTimeout>
type Interval = ReturnType<typeof setInterval>

interface extendedWS extends WebSocket
{
    connectionID: string;
}

interface Chatter
{
    name: string;
}

interface MessageBody
{
    message: string;
    sender: string;
}

enum MessageType  
{
    PING = "ping",
    sendChat = "sendChat",
    joinChat = "joinChat",
}

interface clientMessage
{
    type: MessageType;
    body: MessageBody;
}

export default class SocketService 
{
    private wss: WebSocket.Server;
    private responseTimers: Map<string, Timer>; //A timer for each connection, the passed in callback will be run if the timer elapses. 
    private pingIntervals : Map<string, Interval>; //An interval for each connection, the passed in callback will be run every X seconds.
    private chatters : Map<string, Chatter>; //A map of all connections, keyed by connectionID.

    constructor(_wss: WebSocket.Server)
    {
        this.wss = _wss;
        this.responseTimers = new Map<string, Timer>();
        this.pingIntervals = new Map<string, Interval>();
        this.chatters = new Map<string, Chatter>();
    };


    public init()
    {
        
        this.wss.on('connection', (ws: extendedWS) =>
        {
            this.decorateWebSocket(ws);

            //For a new connection, set up a timer to ping the client to check if it's still alive. 
            let pingInterval: Interval = setInterval(() => 
            {
                this.keepAlive(ws);
            }, 15000);
            
            //Store the ping interval so when we find the connection is disconnected we can end the interval,
            //there wont be any point checking if we already know it's disconnected.
            this.pingIntervals.set(ws.connectionID, pingInterval);

            ws.on('message', (_message: string) =>
            {

                _message = _message.toString();

                if (_message === 'pong')
                {
                    this.achnowledgePing(ws.connectionID);
                    return;
                };

                let message: clientMessage = JSON.parse(_message);

                switch (message.type)
                {
                    case MessageType.joinChat:
                        this.joinChat(ws, message.body);
                        break;
                    case MessageType.sendChat:
                        this.chat(message.body, ws);
                        break;
                    default:
                        console.log('> Unknown message type: ', message.type);
                        break;
                };

            });

            ws.on('close', () =>
            {

                console.log('connection closed: ', ws.connectionID);
                this.removeConnection(ws);
            });

        });
    };

    private joinChat(ws: extendedWS, body: MessageBody)
    {
        let connection: Chatter = {
            name: body.sender
        };

        this.chatters.set(ws.connectionID, connection);
        return;
    };

    // Check if the WS has been decorated with a connectionID if not add one!
    private decorateWebSocket(ws: extendedWS)
    {
        if (typeof (ws.connectionID) === 'undefined')
        {
            ws.connectionID = uuidv4();
            console.log('Connection established for the first time, decorating connection with the following connectionID: ', ws.connectionID);
        };
    };
    
    private keepAlive(ws: extendedWS)
    {
        console.log('Pinging client with connectionID : ', ws.connectionID);
        ws.send('ping');
        
        let websocketTimeout: Timer  = setTimeout(() => 
        {
   
            console.log('Connection timed out ', ws.connectionID);
            this.removeConnection(ws);

        }, 5000);

        this.responseTimers.set(ws.connectionID, websocketTimeout);
    };


    private achnowledgePing(connectionID: string)
    {
        console.log('Acknowledging response of connectionID : ', connectionID);
        let responseTimer: Timer = this.responseTimers.get(connectionID)!;
        if (typeof(responseTimer) !== 'undefined')
        {
            clearTimeout(responseTimer);
        };

    };

    private removeConnection = (ws: extendedWS) =>
    {
        let timedOutInterval: Interval = this.pingIntervals.get(ws.connectionID)!;
                        
        clearInterval(timedOutInterval);

        //As the connection has timed out, we no longer need the interval to call this function to send a ping.
        this.pingIntervals.delete(ws.connectionID);

        //We can also remove this from the responseTimers map.
        this.responseTimers.delete(ws.connectionID);

    };

    private chat(_messageBody: MessageBody, ws: extendedWS)
    {
        console.log('Sending message to all clients: ', _messageBody.message);
        // this.addConnection(_message.sender, ws);
        this.wss.clients.forEach((client: any) =>
        {
            if (client.connectionID !== ws.connectionID)
            {
                let broadcastMessage: clientMessage = {
                    type: MessageType.sendChat,
                    body: _messageBody
                };
                client.send(JSON.stringify(broadcastMessage));
            };
        });
    };
};