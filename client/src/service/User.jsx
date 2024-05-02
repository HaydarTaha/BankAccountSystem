import { getAPI } from "./BaseService";

export const getUserAccounts = async (userID) => {
  try {
    const response = await getAPI(`/api/users/${userID}/accounts`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserRole = async (userID) => {
  try {
    const response = await getAPI(`/api/users/${userID}/role`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getNameSurname = async (userID) => {
  try {
    const response = await getAPI(`/api/users/${userID}/name-surname`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
