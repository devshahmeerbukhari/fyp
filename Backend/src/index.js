import dotenv from "dotenv";
import { app } from "./app.js";
dotenv.config({ path: "./.env" });
const PORT = process.env.PORT || 5173;

app.listen(PORT, () => {
    console.log("APP listening on PORT : ", PORT);
  });
  app.get("/", (req, res) => {
    res.send("Server is running");
  });