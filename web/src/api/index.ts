import { Buffer } from 'buffer';
import merge from 'lodash.merge';
import { BluetoothData } from './bluetooth';
import { Session, User } from './types';

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
  const baseOptions: RequestInit = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (options.method === 'GET') {
    baseOptions.headers = {};
  }

  return fetch(path, merge(baseOptions, options));
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

export const getLastSession = async (): Promise<Session | null> => {
  const response = await fetchWithAuth(`${API_BASE_URL}/session/most_recent`);
  return response.ok ? await response.json() : null;
};

interface SessionById {
  session: Session;
  data: BluetoothData[];
}

export const getSessionById = async (sessionId: string): Promise<Session | null> => {
  const response = await fetchWithAuth(`${API_BASE_URL}/session/${sessionId}`);
  return response.ok ? await response.json() : null;
};

export const createSession = async (sessionName: string) => {
  const response = await fetchWithAuth(`${API_BASE_URL}/session/create`, {
    method: 'POST',
    body: JSON.stringify({
      name: sessionName,
    }),
  });
  return response.ok ? await response.json() : null;
};

export const renameSession = async (sessionName: string) => {
  const response = await fetchWithAuth(`${API_BASE_URL}/session/create`, {
    method: 'POST',
    body: JSON.stringify({
      name: sessionName,
    }),
  });
  return response.ok ? await response.json() : null;
};

export const uploadMetric = async (metricData: BluetoothData[], sessionId: string) => {
  let uploadData = metricData.map(data => ({
    ...data,
    timestamp: data.time,
    sessionId
  }));

  const response = await fetchWithAuth(`${API_BASE_URL}/metric`, {
    method: 'POST',
    body: JSON.stringify(uploadData),
  });

  if (!response.ok) {
    let message = await response.json();
    return {
      success: false,
      ...message
    }
  }

  return { success: true };
};

export const getAllSessions = async () => {};
