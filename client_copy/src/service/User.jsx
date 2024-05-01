import { getAPI } from "./BaseService";

export const getUserAccounts = async (userID) => {
  try {
    const response = await getAPI(`/api/users/${userID}/accounts`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllUserIbans = async () => {
  try {
    const response = await getAPI("/api/users/accounts");
    const users = response.data.data;
    const IBANs = users.map((user) => user.iban); // Her bir kullanıcının userID'sini alın
    return IBANs;
  } catch (error) {
    throw error;
  }
};

// Kullanıcının adını ve soyadını getiren fonksiyon
export const getNameSurname = async (userID) => {
  try {
    const response = await getAPI(`/api/users/${userID}/name-surname`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
