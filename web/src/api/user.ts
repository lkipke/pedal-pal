import { Buffer } from 'buffer';
import { User } from './types';
import { API_BASE_URL, fetchWithAuth } from './common';

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
  const authString = Buffer.from(username + ':' + password).toString('base64');

  const response = await fetchWithAuth(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + authString,
    },
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
    user: userInfo,
  };
};

export const logout = async () => {
  await fetchWithAuth(`${API_BASE_URL}/logout`, {
    method: 'POST',
  });
};

export const getUserFromStoredCredentials = async () => {
  const response = await fetchWithAuth(`${API_BASE_URL}/user`);
  if (!response.ok) {
    return undefined;
  }

  return (await response.json()) as User;
};