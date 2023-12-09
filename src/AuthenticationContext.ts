import * as React from "react";
import Authentication from "./Authentication";

const authenticationContext =  React.createContext<Authentication | null>(null);
export type FetchLikeFunction = (input: (RequestInfo | URL), init?: RequestInit) => Promise<Response>

export default authenticationContext;