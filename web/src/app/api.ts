const API_BASE_URL = process.env.API_BASE_URL!;

export const test = async () => {
    const response = await fetch(API_BASE_URL);
    return await response.text();
};
export const login = async () => {};
export const uploadData = async () => {};

export const createNewSession = async () => {};
export const getLastSession = async () => {};
export const getSessionById = async () => {};
export const getAllSessions = async () => {};