# Glued React

Well, this project is not documented *yet*.

React Client / UI for the Glued project.


## Start

```bash
yarn install
npm start
```

## Build
Set following env variables:
 * `REACT_APP_ENDPOINT`
 * `REACT_APP_AUTH_TOKEN_ENDPOINT`
 * `REACT_APP_AUTH_CLIENT_ID`
 * `REACT_APP_AUTH_ENDSESSION_ENDPOINT`
 * `REACT_APP_AUTH_ENDPOINT`

Create correct config in src/config/available and reference it during build

```bash
CONFIG_NAME=industra npm run build 
```


### Tom TODOs
> Tom disagrees. Those are Pavels TODOs ;)
- CSP Nonces
  - slim nonce middleware
  - https://csplite.com/csp250/
  - https://scotthelme.co.uk/csp-nonce-support-in-nginx/
  - https://krvtz.net/posts/easy-nonce-based-content-security-policy-with-nginx.html
  - https://mui.com/guides/content-security-policy/


