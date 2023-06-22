// Temp workaround
import Authenticator from "@zelitomas/authentica.js";
import {authenticatorOptions} from "./consts";

const isUserLoggedIn = () => !!localStorage.getItem("access_token");

export default class Authentication extends EventTarget {

    constructor() {
        super();
        this.authenticator = new Authenticator(authenticatorOptions)
    }

    isUserLoggedIn = () => isUserLoggedIn();

    logout = () => this.authenticator.logout();
    login = () => this.authenticator.initiateLogin();

    authenticatedFetch = async (resource, init) => {
        let response = await this.authenticator.authenticatedFetch(resource, init);
        if(response.status === 401) {
            //token is expired and cannot be refreshed, raise event
            this.dispatchEvent(new Event("accessTokensExpired"))
        }
        return response
    }
}