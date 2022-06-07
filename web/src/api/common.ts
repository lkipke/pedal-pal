import merge from 'lodash.merge';

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL!;

export async function fetchWithAuth(
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