import { postAPI } from "./BaseService";

// Yeni bir fatura oluşturma fonksiyonu
export const createInvoice = async (invoiceData) => {
  try {
    // postAPI ile POST isteği gönderiyoruz
    const response = await postAPI("/api/invoices", invoiceData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
