
import React from 'react';
import { SocketAPI } from '../apis/SocketAPI';

interface ChatComponentProps
{

};

interface ChatcomponentState
{
    Chatters: string[],
    Messages: string[],
    Name: string;
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
        this.handleJoinClick = this.handleJoinClick.bind(this);
        this.handleSendClick = this.handleSendClick.bind(this);
        this.state = {
            Name: "",
            Chatters: [],
            Messages: []
        };

        this.SocketAPI = new SocketAPI();
        this.SocketAPI.addListener(this.ChatSocketHandler);
        this.JoinChat('blah');
    };
    
    render(): React.ReactNode
    {
        let nameInput;

        if (this.state.Name == "")
        {
            nameInput = 
            <div>
                <input type="text" placeholder="Enter name" id="name-input" />
                <button onClick={this.handleJoinClick}> Join chat </button>
            </div>
        }
        else
        {
            nameInput =
            <div>
                <p>{this.state.Name} : </p><input type="text" placeholder="Enter message" id="message-input" />
                <button onClick={this.handleSendClick}> Send message</button>
            </div>
        }

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
                        {this.state.Messages.map((message, index) =>
                            <li key={index}>{message}</li>
                        )}
                    </ul>
                    {nameInput}
                </div>
            </div>
        );
    };

    private handleJoinClick(e: React.MouseEvent<HTMLButtonElement>): void
    {
        let inputElement : HTMLInputElement = document.getElementById('name-input') as HTMLInputElement;

        if (typeof(inputElement) !== 'undefined' && inputElement !== null)
        {
            this.setState({
                Name: inputElement.value
            });
        };

    };

    private handleSendClick(e: React.MouseEvent<HTMLButtonElement>): void
    {
        let inputElement : HTMLInputElement = document.getElementById('message-input') as HTMLInputElement;

        if (typeof(inputElement) !== 'undefined' && inputElement !== null)
        {
            let message = 
            {
                type: MessageType.sendChat,
                body: 
                {
                    name: this.state.Name,
                    message: inputElement.value
                }
            };

            this.SocketAPI.send(JSON.stringify(message));
            this.handleChatEntry(message.body);
            return;
        };

    };


    private JoinChat(name: string): void
    {   
        let message = {
            type: MessageType.joinChat,
            body: {
                sender: name
            }
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
                this.handleChatEntry(message.body);
                break;
            default:
                console.log("Unknown message type", JSON.stringify(message, null, 2));
                break;
        };

    }

    private handleChatEntry(messageBody: any)
    {
        let message = messageBody.name + ": " + messageBody.message;
        let currentMessages = this.state.Messages;
        currentMessages.push(message);
        this.setState({
            Messages: currentMessages
        });
    };

};
