import { IRequest } from "../wrappers/IRequest";
import { IRequestOptions } from "../wrappers/IRequestOptions";
import request from "../wrappers/request";

export interface User 
{
    name: string,
    email: string
}
export class UserAPI
{
    private UserRequest : IRequest; 
    
    private getUsersAPI = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/api/v1/users` : '/api/v1/users'; 
    private postUserAPI = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/api/v1/user` : '/api/v1/user'; 

    constructor()
    {
        this.UserRequest = new request();
        console.log('getUsersAPI using: ', this.getUsersAPI);
        console.log('postUserAPI using: ', this.postUserAPI);
    };

    async getUsers()
    {
        const options: IRequestOptions =
        {
            method: "GET",

        }

        const uri = this.getUsersAPI;
        
        let serverResponse = await this.UserRequest.get(uri, options);  
        let users: Array<User> = serverResponse.data;
        return users;
      
    };

    async postUser(_name: string, _email: string)
    {

        let newUser: User = 
        {
            name: _name,
            email: _email
        };

        const options: IRequestOptions =
        {
            headers: {
                "Content-Type": "application/json"
            }
        }

        const uri = this.postUserAPI;

        let response = await this.UserRequest.post(uri, newUser, options);
        return response;
    };


};