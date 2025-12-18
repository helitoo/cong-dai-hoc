import fetchWrapper from "@/lib/http-client";

import type { Credentials } from "@/lib/types/auth/credentials";

export const signin = (credentials: Credentials) =>
  fetchWrapper("POST", "/api/auth/signin", credentials);

export const signup = (credentials: Credentials) =>
  fetchWrapper("POST", "/api/auth/signup", credentials);

export const signout = () => fetchWrapper("POST", "/api/auth/signout");

export const authme = () => fetchWrapper("GET", "/api/auth/me");
