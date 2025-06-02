import mongoose from "mongoose";
import connectDB from "./db/db.js";
import dotenv from "dotenv";
import { app } from "./app.js";
dotenv.config({ path: "./.env" });
const PORT = process.env.PORT || 4000;
connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("ERROR", error);
      throw error;
    });
    app.listen(PORT, () => {
      console.log("APP listening on PORT : ", PORT);
    });
    app.get("/", (req, res) => {
      res.send("Server is running");
    });
  })
  .catch((error) => {
    console.log("MONGODB connection FAILED", error);
  });
