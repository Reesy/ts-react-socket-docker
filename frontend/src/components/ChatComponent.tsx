
import React from 'react';
import { SocketAPI } from '../apis/SocketAPI';

interface ChatComponentProps
{

};

interface ChatcomponentState
{
    Chatters: string[],
    Messages: string[]
}

enum MessageType  
{
    PING = "ping",
    sendChat = "sendChat",
    joinChat = "joinChat",
}

export default class ChatComponent extends React.Component<ChatComponentProps, ChatcomponentState>
{

    private SocketAPI: SocketAPI;
    constructor(props: ChatComponentProps)
    {
        super(props);
        this.ChatSocketHandler = this.ChatSocketHandler.bind(this);
        this.state = {
            Chatters: [],
            Messages: []
        };

        this.SocketAPI = new SocketAPI();
        this.SocketAPI.addListener(this.ChatSocketHandler)
    };
    
    render(): React.ReactNode
    {

        return (
            <div>
                <h1>Chat</h1>
                <div>
                    <h2>Chatters</h2>   
                    <ul>
                        {this.state.Chatters.map(chatter =>

                            <li>{chatter}</li>
                        )}
                    </ul>
                </div>
                <div>
                    <h2>Messages</h2>
                    <ul>
                        {this.state.Messages.map(message =>

                            
                            <li>{message}</li>
                        )}
                    </ul>
                    <input type="text" placeholder="Enter name" />
                    <button> Join chat </button>
                </div>
            </div>
        );
    };

    private JoinChat(name: string): void
    {   
        let message = {
            type: MessageType.joinChat,
            name: name
        }
        this.SocketAPI.send(JSON.stringify(message));
    }
    private ChatSocketHandler = (data: any) =>
    {   
        if (data.toString() === 'ping')
        {
            this.SocketAPI.send('pong');
            return;
        };

        let message: any = JSON.parse(data);

        switch (message.type)
        {
            case MessageType.sendChat:
                this.handleReceivingChat(message.body);
                break;
            default:
                console.log("Unknown message type");
                break;
        };

    }

    private handleReceivingChat(message: string)
    {
        this.setState({
            Messages: [...this.state.Messages, message]
        });
    };

};
