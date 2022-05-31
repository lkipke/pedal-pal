import merge from 'lodash.merge';

const LOCAL_STORAGE_KEY = 'pedalpal';

export const getLocalStorage = () => {
  const values = window.localStorage.getItem(LOCAL_STORAGE_KEY) || '{}';
  return JSON.parse(values);
};

export const setLocalStorage = (newVal: Record<string, any>) => {
  const storage = getLocalStorage();
  window.localStorage.setItem(LOCAL_STORAGE_KEY, merge(storage, newVal));
};

export const storeAuthToken = (token: string) => {
  setLocalStorage({ auth: { sessionToken: token } });
};

export const getAuthToken = (): string | undefined => {
  return getLocalStorage().auth?.sessionToken;
};
