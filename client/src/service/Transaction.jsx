import { getAPI } from "./BaseService";

// Tüm işlemleri getirme fonksiyonu
export const getAllTransactions = async () => {
  try {
    const response = await getAPI("/api/transactions");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Belirli bir filtreye göre işlemleri getirme fonksiyonu
export const getFilteredTransactions = async (filterType, filterValue) => {
  try {
    const response = await getAPI(`/api/transactions/filter?filterType=${filterType}&filterValue=${filterValue}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
