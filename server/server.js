import express from "express";
import dotenv from "dotenv";
import paypalRoutes from "./routes/paypal.js";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());
app.use("/paypal", paypalRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});