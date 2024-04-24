// controllers/Firms.js
import { FirmModel } from "../models/Firms.js";

// Tüm firmaları getiren controller fonksiyonu
export const getAllFirms = async (req, res) => {
  try {
    const firms = await FirmModel.find({});
    res.status(200).json(firms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Belirli bir kritere göre filtrelenmiş firmaları getiren controller fonksiyonu
export const getFilteredFirm = async (req, res) => {
  const { firmname, subscription_id } = req.body; // Filtreleme kriterlerini istek gövdesinden al

  try {
    const filterCriteria = {};

    // Eğer firmname verilmişse, firma adına göre filtrele
    if (firmname) {
      filterCriteria.company_name = firmname;
    }

    // Eğer subscription_id verilmişse, abonelik kimliğine göre filtrele
    if (subscription_id) {
      filterCriteria.subscription_id = subscription_id;
    }

    // Filtreleme işlemini yap ve sonucu döndür
    const filteredFirms = await FirmModel.find(filterCriteria);
    res.status(200).json(filteredFirms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
