
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
        let messagesHeader;
        if (this.state.Name === "")
        {
            nameInput = 
            <div className="input">
                <input type="text" placeholder="Enter name" id="name-input" className="input__box" />
                <button onClick={this.handleJoinClick} className="input__button"> Join chat </button>
            </div>

            messagesHeader =
            <div>
              <h3 className="messages__header">Messages</h3> 
            </div>
        }
        else
        {
            nameInput =
            <div className="input">
                <input type="text" placeholder="Enter message" id="message-input" className="input__box" />
                <button onClick={this.handleSendClick} className="input__button"> Send message</button>
            </div>

            messagesHeader =
            <div>
                <h3 className="messages__header">Messages</h3> <p className="input__name">Messaging as: {this.state.Name} </p>
            </div>
        }

        return (
            <div className="chatcomponent">
                {/* <h1 className="chatcomponent__header" >Chat</h1> */}
                <div className="chat">
                    <h2 className="chat__header">Online:</h2>   
                    {this.state.Chatters.map((chatter, index) => 
                        <p className="chat__element">
                            {chatter.name}
                        </p>
                    )}
                </div>
                <div className="messages">
                    {messagesHeader}
                        <div className="messages__container">
                            {this.state.Messages.map((message, index) =>
                                <p className="messages__element" key={index}>{message}</p>
                            )}
                        </div>
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
            inputElement.value = "";
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
            inputElement.value = "";
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

        //scroll to bottom
        let messagesContainer = document.getElementsByClassName("messages__container")[0];
        if (typeof(messagesContainer) !== 'undefined' && messagesContainer !== null)
        {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    };

};
