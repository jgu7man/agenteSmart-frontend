import { UserInterface } from '../auth.service';

export class UserAuth {
    logged: boolean
    user
    constructor (
        user?: UserInterface,
    ) {
        this.logged = false
        this.user = user     
    }

}