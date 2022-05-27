const API_BASE_URL = process.env.REACT_APP_API_BASE_URL!;

export const test = async () => {
    console.log(API_BASE_URL);
    console.log(process.env)
    const response = await fetch(`${API_BASE_URL}/api`);
    return await response.text();
};
export const login = async () => {};
export const uploadData = async () => {};

export const createNewSession = async () => {};
export const getLastSession = async () => {};
export const getSessionById = async () => {};
export const getAllSessions = async () => {};