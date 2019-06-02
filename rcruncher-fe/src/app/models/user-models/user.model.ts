import { BaseModel } from '../base.model';

export class UserModel implements BaseModel {

    constructor(firstName, lastName, email) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }
    public uid: string = "";
    public firstName: string = "";
    public lastName: string = "";
    public email: string = "";
    public dropboxOAuthToken: string = "";
}