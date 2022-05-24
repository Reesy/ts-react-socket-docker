
import React from 'react';
import { SocketAPI } from '../apis/SocketAPI';
import "../styles/ChatComponent.css"
interface ChatComponentProps
{

};

interface Chatter
{
    name: string;
}
interface ChatcomponentState
{
    Chatters: Chatter[],
    Messages: string[],
    Name: string;
}

enum MessageType  
{
    PING = "ping",
    sendChat = "sendChat",
    joinChat = "joinChat",
    chatUpdate = "chatUpdate"
}

export default class ChatComponent extends React.Component<ChatComponentProps, ChatcomponentState>
{

    private SocketAPI: SocketAPI;

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo)
    {
        console.log(error);
    }
    constructor(props: ChatComponentProps)
    {
        super(props);
        this.ChatSocketHandler = this.ChatSocketHandler.bind(this);
        this.handleJoinClick = this.handleJoinClick.bind(this);
        this.handleSendClick = this.handleSendClick.bind(this);
        this.updateMembersList = this.updateMembersList.bind(this);
        this.state = {
            Name: "",
            Chatters: [],
            Messages: []
        };

        this.SocketAPI = new SocketAPI();
        this.SocketAPI.addListener(this.ChatSocketHandler);
        // this.JoinChat('blah');
    };
    
    render(): React.ReactNode
    {
        let nameInput;

        if (this.state.Name === "")
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

        // let chattersList;

        // if (this.state.Chatters.length > 0)
        // {
        //     for (let i = 0; i < this.state.Chatters.length; i++)
        //     {
        //         // chattersList += <li> chatter <li/>
        //     };
        // };
     
        return (
            <div className="chatcomponent">
                {/* <h1 className="chatcomponent__header" >Chat</h1> */}
                <div className="chat">
                    <h2 className="chat__header">Chatters</h2>   
                    {this.state.Chatters.map((chatter, index) => 
                        <p className="chat__element">
                            {chatter.name}
                        </p>
                    )}
                </div>
                <div className="messages">
                    <h2 className="messages_header">Messages</h2>
                        {this.state.Messages.map((message, index) =>
                            <p className="messages__element" key={index}>{message}</p>
                        )}
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
            this.JoinChat(inputElement.value);
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
            case MessageType.chatUpdate:
                this.updateMembersList(message.body);
                break;
            default:
                console.log("Unknown message type", JSON.stringify(message, null, 2));
                break;
        };

    }
    private updateMembersList(chatters: any): void
    {
        this.setState({
            Chatters: chatters.memberList
        });
        console.log(chatters);
    };

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
