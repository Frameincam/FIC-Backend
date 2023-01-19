import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectdb from "./Middlewares/dbConnection.js";
import vendorAccount from "./Routes/Account/vendorAccount.js";
import customerAccount from "./Routes/Account/customerAccount.js";
import forget from "./Routes/Account/ForgetAndReset.js";
import review from "./Routes/Account/vendorReview.js";
import video from "./Routes/Account/vendorVideoUrl.js";
import cookieParser from "cookie-parser";
import errorMiddleware from "./Middlewares/error.js";

dotenv.config();

const port = process.env.PORT || 3001;

connectdb();
const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: true }));

app.use("/api", vendorAccount);
app.use("/api", customerAccount);
app.use("/api", review);
app.use("/api", forget);
app.use("/api", video);

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`http://localhost:${port}, on ${process.env.NODE_ENV} mode`);
});
