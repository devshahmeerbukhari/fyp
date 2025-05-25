import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
const app = express();
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

//import routes
import chatRouter from "./routes/chat.routes.js";

//route declarations
app.use("/api/v1/chat", chatRouter);


export { app };