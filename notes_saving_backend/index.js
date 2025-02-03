const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/database");
const userRoutes = require("./routes/userRoutes");
const noteRoutes = require("./routes/noteRoutes");
const fileUpload = require('express-fileupload');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// File Upload
app.use(
    fileUpload({
      useTempFiles: true,
      tempFileDir: '/tmp/',
    })
  );

// Routes
app.use("/api/users", userRoutes);
app.use("/api/notes", noteRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
connectDB();
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
