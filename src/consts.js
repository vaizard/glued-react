export const endpoint = "https://gdev.industra.space";
export const authenticatorOptions = {

    tokenEndpoint: "https://id.industra.space/auth/realms/T1/protocol/openid-connect/token",
    authorizationEndpoint: "https://id.industra.space/auth/realms/t1/protocol/openid-connect/auth",
    endSessionEndpoint: "https://id.industra.space/auth/realms/t1/protocol/openid-connect/logout",
    // logoutRedirectUri: "someuri", // Optional, by default the window.location. Here you can server-side cleanup, for example unset cookies, if your server set any.
    clientId: "new-client-2",
    // redirectUri: "someUri" // Optional, by default the window.location. This is the page where authenticator.checkLogin() is called
};
