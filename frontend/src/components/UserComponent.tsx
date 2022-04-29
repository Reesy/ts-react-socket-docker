import React from 'react';
import { User, UserAPI } from '../apis/UserAPI';
import '../styles/UserComponent.css';
import UsersDisplayComponent from './UsersDisplayComponent';

interface UserComponentProps
{

};

interface UserComponentState
{
    name: string;
    email: string;
    users: User[];
};

export default class UserComponent extends React.Component<UserComponentProps, UserComponentState>
{   

    userAPI: UserAPI ; 

    constructor(props: UserComponentProps)
    {
        super(props);
        this.state = {
            name: '',
            email: '',
            users: []
        };

        this.handleNameInputChange = this.handleNameInputChange.bind(this);
        this.handleEmailInputChange = this.handleEmailInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleGetUsers = this.handleGetUsers.bind(this);

        this.userAPI = new UserAPI();
    };

    handleNameInputChange(event: React.ChangeEvent<HTMLInputElement>)
    {
        this.setState({ 'name': event.target.value });
    };

    handleEmailInputChange(event: React.ChangeEvent<HTMLInputElement>)
    {
        this.setState({ 'email': event.target.value });
    };

    handleGetUsers(event: React.MouseEvent<HTMLButtonElement, MouseEvent>)
    {
        this.userAPI.getUsers()
            .then(_users => {
                this.setState({ users: _users });
                console.log(_users);
            })
            .catch(error => {
                console.log(error);
            }
        );
    };

    handleSubmit(event: React.FormEvent<HTMLFormElement>)
    {
        event.preventDefault();
        this.userAPI.postUser(this.state.name, this.state.email)
            .then(response => {
                console.log("The response is: ", response);
            })  
            .catch(error => {
                console.log("The error is : ", error );
            });
    };

    render(): React.ReactNode
    {

        return (
            <div className="User-main">
                <form className="User-form"  onSubmit={this.handleSubmit}>
                    <label>
                        <input type="text" name="name" placeholder="Name" value={this.state.name} onChange={this.handleNameInputChange} />
                    </label>
                    <label>
                        <input type="text" name="name" placeholder="Email" value={this.state.email} onChange={this.handleEmailInputChange} />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
                <div className="User-info">
                    <p>Name: {this.state.name}</p>
                    <p>Email: {this.state.email}</p>
                </div>
                <button onClick={this.handleGetUsers}> Get Users </button>

                <UsersDisplayComponent users={this.state.users}/>
            </div>
        )
    }
};

