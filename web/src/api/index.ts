import { Buffer } from 'buffer';
import { User } from './types';

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

async function fetchWithAuth(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  return fetch(path, {
    ...options,
    credentials: "include"
  });
}

export const login = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  const authString = Buffer.from(username + ':' + password).toString('base64');

  const response = await fetchWithAuth(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + authString,
    }
  });

  if (!response.ok) {
    return {
      success: false,
      status: response.status,
      statusText: response.statusText,
    };
  }

  let userInfo: User = await response.json();
  return {
    success: true,
    user: userInfo
  };
};

export const getUserFromStoredCredentials = async () => {
  const response = await fetchWithAuth(`${API_BASE_URL}/user`);
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
