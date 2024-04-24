import mongoose from "mongoose";
// Invoice Schema
const InvoiceSchema = new mongoose.Schema({
    invoiceNumber: {
      type: Number,
      unique: true,
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    accountID: {
      type: Number,
      required: true,
    },
    amount: {
      type: mongoose.Types.Decimal128,
      required: true,
    },
    recipient: {
        type: String,
        required: true,
      },
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    frequency: {
        type: Number,
        default: 30,
        required: true,
      },
    paid: {
      type: Boolean,
      default: false,
    },
  });

    // InvoiceNumber alanını otomatik olarak artan bir şekilde doldurmak için özel bir middleware ekleyelim
    InvoiceSchema.pre("save", async function (next) {
        // Eğer fatura numarası zaten varsa işlemi bir sonraki adıma devam ettir
        if (this.invoiceNumber) {
        return next();
        }

        try {
        // En son eklenen fatura numarasını bul
        const latestInvoice = await this.constructor.findOne({}, {}, { sort: { invoiceNumber: -1 } });
        let nextInvoiceNumber = 1;
        
        // Eğer en son eklenen fatura varsa, bir sonraki fatura numarasını artır
        if (latestInvoice) {
            nextInvoiceNumber = latestInvoice.invoiceNumber + 1;
        }
        
        // Fatura numarasını ayarla
        this.invoiceNumber = nextInvoiceNumber;
        next(); // Call next to continue with the save operation
        } catch (error) {
        next(error); // Pass any error to the next middleware
        }
    });

  export const InvoiceModel = mongoose.model("Invoice", InvoiceSchema);