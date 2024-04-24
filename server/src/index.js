import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cron from 'node-cron';

// Routes
import { userRoutes } from "./routes/User.js";
import { accountRoutes } from "./routes/Account.js";
import { depositOptionRoutes } from "./routes/Deposit_Option.js";
import { invoiceRoutes } from "./routes/Invoices.js";
import { transactionRoutes } from "./routes/Transaction.js";
import { firmRoutes } from "./routes/Firms.js";
// Models
import { UserModel } from "./models/User.js";
import { InvoiceModel } from "./models/Invoices.js";
import { AccountModel } from './models/Account.js';
import { TransactionModel } from './models/Transaction.js';
import { FirmModel } from './models/Firms.js';

// App Config
const app = express();
dotenv.config();

// Middlewares
app.use(express.json());

const corsOptions = {
  credentials: true,
  origin: "http://localhost:3000",
};
app.use(cors(corsOptions));

// Log handler
app.use((req, res, next) => {
  const { method, url, hostname, ip } = req;
  const timestamp = new Date();
  res.on("finish", () => {
    console.log(
      `${timestamp} - ${method} - ${url} - ${hostname} - ${ip} - ${res.statusCode}`
    );
  });
  next();
});

// Middleware to check if user is logged in except for register and login endpoints
app.use((req, res, next) => {
  const { url } = req;
  if (url === "/api/users/register" || url === "/api/users/login") {
    next();
    return;
  }

  const cookie = req.headers.cookie;

  if (!cookie) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Check the userId from the cookie
  const userId = cookie.split("=")[1];
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Convert userId to ObjectId
  const objectId = new mongoose.Types.ObjectId(userId);

  // Check if the user exists in the database
  const user = UserModel.findOne({ _id: objectId });

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/deposit-options", depositOptionRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/firms", firmRoutes);

// Invalid Path Handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Invalid path" });
});

// Error Handler
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Internal Server Error";
  res.status(errorStatus).json({ message: errorMessage });
});

// Connect Database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });


// Frekansı güncelleme fonksiyonu
const updateFrequency = async () => {
  try {
    // Bugünkü tarihi al
    const today = new Date();
    
    // Tüm faturaları al
    const allInvoices = await InvoiceModel.find();

    // Tüm faturalar için döngü oluşturarak frekansları kontrol et ve güncelle
    for (const invoice of allInvoices) {
      // Faturanın tarihini al
      const invoiceDate = invoice.date;

      // Faturanın frekansını dakika cinsinden hesapla
      const differenceInMinutes = Math.ceil((today - invoiceDate) / (1000 * 60));

      // Farka göre frekansı güncelle
      if (differenceInMinutes >= 1) {
        const updatedFrequency = invoice.frequency - (differenceInMinutes - 1);
        invoice.frequency = updatedFrequency > 0 ? updatedFrequency : 0; // Frekansın sıfırdan küçük olmamasını sağla
        await invoice.save();
        console.log(`Invoice ID ${invoice._id} için frekans başarıyla güncellendi: ${invoice.frequency}`);
      } else {
        console.log(`Invoice ID ${invoice._id} için frekans güncelleme gerektirmiyor.`);
      }
    }

    console.log("Tüm faturaların frekansı başarıyla güncellendi.");
  } catch (error) {
    console.error("Frekans güncelleme sırasında bir hata oluştu:", error);
  }
};

// Tüm faturaları kontrol edip, frekansı sıfır olanları işle
const processZeroFrequencyInvoices = async () => {
  try {
    // Tüm faturaları al
    const allInvoices = await InvoiceModel.find({ frequency: 0 });

    // Her bir fatura için işlem yap
    for (const invoice of allInvoices) {

      // Ödenmiş faturaları işleme
      if (invoice.paid === true) {
        console.log(`Invoice ${invoice.invoiceNumber} is already paid. Skipping transaction.`);
        continue; // Ödenmiş faturaları işlemeye devam etme
      }
      if (!invoice.recipient.startsWith("TR")) {

        const senderAccount = await AccountModel.findOne({ accountID: invoice.accountID });
        const recipientAccount = await FirmModel.findOne({ company_name: invoice.recipient });
        // Hesaptan para çekme işlemi
        const senderBalance = parseFloat(senderAccount.balance);
        const invoiceAmount = parseFloat(invoice.amount);
        if (senderBalance >= invoiceAmount) {
          senderAccount.balance -= invoice.amount;
          await senderAccount.save();
          console.log(`Account ${senderAccount.accountID} balance updated: ${senderAccount.balance}`);

          // Faturayı ödenmiş olarak işaretleme
          invoice.paid = true;
          await invoice.save();
          console.log(`Invoice ${invoice.invoiceNumber} paid successfully ${recipientAccount} ve ${recipientAccount.payment_status}`);
            
          recipientAccount.payment_status = "paid";
          await recipientAccount.save();
          console.log(`Firm payment status updated: ${recipientAccount.payment_status}`);


          // Transaction kaydı oluşturma
          const transaction = new TransactionModel({
            senderAccountID: senderAccount.accountID,
            receiverAccountID: recipientAccount.subscription_id,
            amount: invoice.amount,
            transactionType: "Firm Invoice",
            description: `Invoice ${invoice.invoiceNumber} için, ${senderAccount.accountID} hesabından ${recipientAccount.company_name} firmasına ${invoice.amount} tutarında para gönderildi.`,
          });
          await transaction.save();
          console.log(`Transaction for invoice ${invoice.invoiceNumber} created:`, transaction);
          
        } else {
          console.log(`Insufficient balance for account ${senderAccount.accountID}`);
          // Yetersiz bakiye hatası aldığında faturayı sil
          await InvoiceModel.findByIdAndDelete(invoice._id);
          console.log(`Invoice ${invoice.invoiceNumber} deleted due to insufficient balance. Balance ${senderAccount.balance}, amount ${invoice.amount}`);
        }

    } else {
            // Fatura gönderenin ve alıcının IBAN'larını al
            const senderAccount = await AccountModel.findOne({ accountID: invoice.accountID });
            const recipientAccount = await AccountModel.findOne({ iban: invoice.recipient });
      
            // Fatura gönderenin IBAN'ı ile alıcının IBAN'ı aynı değilse işlem yap
            if (senderAccount.iban !== recipientAccount.iban) {
              // Hesaptan para çekme işlemi
              if (senderAccount.balance >= invoice.amount) {
                senderAccount.balance -= invoice.amount;
                await senderAccount.save();
                console.log(`Account ${senderAccount.accountID} balance updated: ${senderAccount.balance}`);
      
                // Alıcı IBAN'ına para ekleme işlemi
                recipientAccount.balance += invoice.amount;
                await recipientAccount.save();
                console.log(`Recipient account ${recipientAccount.iban} balance updated: ${recipientAccount.balance}`);
      
                // Faturayı ödenmiş olarak işaretleme
                invoice.paid = true;
                await invoice.save();
                console.log(`Invoice ${invoice.invoiceNumber} paid successfully`);
      
                // Transaction kaydı oluşturma
                const transaction = new TransactionModel({
                  senderAccountID: senderAccount.accountID,
                  receiverAccountID: recipientAccount.accountID,
                  amount: invoice.amount,
                  transactionType: "Invoice",
                  description: `Invoice ${invoice.invoiceNumber} için, ${senderAccount.accountID} hesabından ${recipientAccount.accountID} hesabına ${invoice.amount} tutarında para gönderildi.`,
                });
                await transaction.save();
                console.log(`Transaction for invoice ${invoice.invoiceNumber} created:`, transaction);
              } else {
                console.log(`Insufficient balance for account ${senderAccount.accountID}`);
                // Yetersiz bakiye hatası aldığında faturayı sil
                await InvoiceModel.findByIdAndDelete(invoice._id);
                console.log(`Invoice ${invoice.invoiceNumber} deleted due to insufficient balance.`);
              }
            } else {
              // Gönderen ile alıcının IBAN'ları aynıysa faturayı sil
              await InvoiceModel.findByIdAndDelete(invoice._id);
              console.log(`Invoice ${invoice.invoiceNumber} deleted because sender and recipient have the same IBAN.`);
            }
  }
    }
  } catch (error) {
    console.error("Error processing zero frequency invoices:", error);
  }
};


// cron işlevi
cron.schedule('*/10 * * * * *', () => {
  updateFrequency(); // Her dakika frekansı güncelle
  processZeroFrequencyInvoices();
});

// Listen Server
const PORT = 8080;
const listener = app.listen(PORT, () => {
  console.log(`Server listening on port ${listener.address().port}`);
});
