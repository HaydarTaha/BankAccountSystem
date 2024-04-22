import { patchAPI, deleteAPI } from "./BaseService";

export const updateAccountName = async (accountID, accountName) => {
  try {
    const response = await patchAPI(`/api/accounts/${accountID}`, {
      accountName: accountName,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteAccount = async (accountID) => {
  try {
    const response = await deleteAPI(`/api/accounts/${accountID}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
