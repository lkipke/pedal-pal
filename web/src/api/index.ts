import { Buffer } from "buffer";
import { User } from "./types";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL!;

export interface LoginResponseSuccess {
  success: true;
  user: User;
}

export interface LoginResponseFailure {
  success: false;
  status: number;
  statusText: string;
}

export type LoginResponse = LoginResponseSuccess | LoginResponseFailure;

export const login = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  const authString = Buffer.from(username + ":" + password).toString("base64");
  console.log("auth string", authString);

  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      Authorization: "Basic " + authString,
    },
  });

  if (!response.ok) {
    return {
      success: false,
      status: response.status,
      statusText: response.statusText,
    };
  }

  let user: User = await response.json();
  return {
    success: true,
    user,
  };
};

export const getUserFromStoredCredentials = async () => {
  const response = await fetch(`${API_BASE_URL}/user`);
  if (!response.ok) {
    return null;
  }

  return (await response.json()) as User;
};

export const uploadData = async () => {};

export const createNewSession = async () => {};
export const getLastSession = async () => {};
export const getSessionById = async () => {};
export const getAllSessions = async () => {};
