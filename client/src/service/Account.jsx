import { patchAPI, postAPI, putAPI } from "./BaseService";

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

export const deleteAccount = async (accountID, accountToTransfer) => {
  try {
    const response = await putAPI(`/api/accounts/${accountID}`, {
      accountToTransfer: accountToTransfer,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createAccount = async (account, type) => {
  if (type === "Deposit") {
    const response = await postAPI("api/accounts/deposit-accounts", account);
    return response;
  } else if (type === "Checking") {
    const response = await postAPI("api/accounts/checking-accounts", account);
    return response;
  }
};
