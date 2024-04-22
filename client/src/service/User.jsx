import { getAPI } from "./BaseService";

export const getUserAccounts = async (userID) => {
  try {
    const response = await getAPI(`/api/users/${userID}/accounts`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
