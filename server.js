const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const authRouter = require("./routes/authRoute");
const todoRouter = require("./routes/todoRoutes");

const errorMiddleware = require("./middleware/error");

const app = express();

const PORT = process.env.PORT || 4000;
const DATABASE = process.env.DATABASE;

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Hello from the server.",
  });
});
app.use(express.json());
app.use("/auth", authRouter);
app.use("/todo", todoRouter);

app.use(errorMiddleware);
mongoose
  .connect(DATABASE)
  .then(console.log("Database connected"))
  .catch((err) => console.log(err));

app.listen(PORT, () => console.log("Server is running on port " + PORT));
