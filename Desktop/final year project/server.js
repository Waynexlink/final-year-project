const app = require("./app");
require("dotenv").config();
const connectDB = require("./config/db");

// Connect to MongoDB
connectDB();

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`server is running on ${port}`);
});

process.on("SIGTERM", () => {
  server.close(() => {
    console.log("Process terminated");
  });
});
