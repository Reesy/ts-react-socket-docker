
import React from 'react';
import { User } from '../apis/UserAPI';
import '../styles/UsersDisplayComponent.css';

interface UsersDisplayComponentProps
{
    users: User[];
};

interface UsersDisplayComponentState
{

};

export default class UsersDisplayComponent extends React.Component<UsersDisplayComponentProps, UsersDisplayComponentState>
{   

    render(): React.ReactNode
    {
        const users = this.props.users.map(user => (
            <li key={user.email}>
                <br />
                <p>Name: {user.name}</p>
                <p>Email: {user.email}</p>
            </li>
        ));

        return (
            <div>
                <h1>Users: </h1>
                <ul className="User-list">
                    {users}
                </ul>
    
            </div>
        )
    }

}