import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Routes
import { userRoutes } from "./routes/User.js";
import { accountRoutes } from "./routes/Account.js";
import { depositOptionRoutes } from "./routes/Deposit_Option.js";
import { crudRoutes } from "./routes/Crud.js";

// Models
import User from "./models/User.js";

// Database
import sequelize from "./config/database.js";

// App Config
const app = express();
dotenv.config();

// Middlewares
app.use(express.json());

const corsOptions = {
  credentials: true,
  origin: ["http://localhost:3000", "http://10.125.23.145:3000/"],
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

  // Check if the user exists in the database
  User.findByPk(userId)
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      next();
    })
    .catch((err) => {
      console.error("Error checking user:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    });
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/deposit-options", depositOptionRoutes);
app.use("/api/crud", crudRoutes);

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

// Test the connection to the database
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

// Start the server
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
