
let endpoint, authenticatorOptions;


if (process.env.NODE_ENV !== 'production') {
    endpoint = "https://gdev.industra.space";
    authenticatorOptions = {
        tokenEndpoint: "https://id.industra.space/auth/realms/T1/protocol/openid-connect/token",
        authorizationEndpoint: "https://id.industra.space/auth/realms/t1/protocol/openid-connect/auth",
        endSessionEndpoint: "https://id.industra.space/auth/realms/t1/protocol/openid-connect/logout",
        // logoutRedirectUri: "someuri", // Optional, by default the window.location. Here you can server-side cleanup, for example unset cookies, if your server set any.
        clientId: "new-client-2",
        // redirectUri: "someUri" // Optional, by default the window.location. This is the page where authenticator.checkLogin() is called
    };

} else {
    endpoint = process.env.REACT_APP_ENDPOINT;
    authenticatorOptions = {
        tokenEndpoint: process.env.REACT_APP_AUTH_TOKEN_ENDPOINT,
        authorizationEndpoint: process.env.REACT_APP_AUTH_ENDPOINT,
        endSessionEndpoint: process.env.REACT_APP_AUTH_ENDSESSION_ENDPOINT,
        clientId: process.env.REACT_APP_AUTH_CLIENT_ID,
    };

}


export { endpoint, authenticatorOptions }