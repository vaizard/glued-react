// Temp workaround
// @ts-ignore
import Authenticator from "@zelitomas/authentica.js";
// @ts-ignore
import {authenticatorOptions} from "./consts";
import {FetchLikeFunction} from "./AuthenticationContext";

const isUserLoggedIn = () => !!localStorage.getItem("access_token");

export default class Authentication extends EventTarget {
    private authenticator: Authenticator;

    constructor() {
        super();
        // @ts-ignore
        this.authenticator = new Authenticator(authenticatorOptions)
    }

    isUserLoggedIn = () => isUserLoggedIn();

    logout = () => this.authenticator.logout();
    login = () => this.authenticator.initiateLogin();

    authenticatedFetch: FetchLikeFunction = async (resource, init) => {
        let response = await this.authenticator.authenticatedFetch(resource, init);
        if(response.status === 401) {
            //token is expired and cannot be refreshed, raise event
            this.dispatchEvent(new Event("accessTokensExpired"))
        }
        return response
    }
}