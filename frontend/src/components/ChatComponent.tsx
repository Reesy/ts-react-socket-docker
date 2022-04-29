
import React from 'react';

interface ChatComponentProps
{

};

interface ChatcomponentState
{
    Chatters: string[],
    Messages: string[]
}

export default class ChatComponent extends React.Component<ChatComponentProps, ChatcomponentState>
{
    constructor(props: ChatComponentProps)
    {
        super(props);
        this.state = {
            Chatters: [],
            Messages: []
        };
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
                </div>
            </div>
        );
    };
};
