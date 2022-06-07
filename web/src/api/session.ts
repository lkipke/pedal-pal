import { BluetoothData } from '../utils/bluetooth';
import { Session } from './types';
import { API_BASE_URL, fetchWithAuth } from './common';

export const getLastSession = async (): Promise<Session | null> => {
  const response = await fetchWithAuth(`${API_BASE_URL}/session/most_recent`);
  return response.ok ? await response.json() : null;
};

interface SessionById {
  session: Session;
  data: BluetoothData[];
}

export const getSessionById = async (
  sessionId: string
): Promise<SessionById | null> => {
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

export const deleteSession = async (sessionId: string) => {
  await fetchWithAuth(`${API_BASE_URL}/session/${sessionId}`, {
    method: 'DELETE',
  });
};

interface GetSessionsSuccess {
  success: true;
  sessions: Session[];
  total: number;
}

interface GetSessionsFailure {
  success: false;
  errorCode: 'ALL_SESSIONS_RETRIEVED' | 'UNKNOWN';
  errorMsg: string;
}

export const getSessions = async (
  pageSize: number,
  pageOffset: number
): Promise<GetSessionsSuccess | GetSessionsFailure> => {
  const response = await fetchWithAuth(
    `${API_BASE_URL}/session/sessions?pageSize=${pageSize}&pageOffset=${pageOffset}`
  );

  if (!response.ok) {
    return {
      success: false,
      errorCode: response.status === 404 ? 'ALL_SESSIONS_RETRIEVED' : 'UNKNOWN',
      errorMsg: response.statusText
    };
  }

  let { sessions, total } = await response.json() as {
    sessions: Session[];
    total: number;
  };

  return {
    success: true,
    sessions,
    total
  };
};

export const renameSession = async (sessionName: string) => {};
