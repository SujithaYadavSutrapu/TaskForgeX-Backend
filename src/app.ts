import express from 'express';
import authRoutes from './routes/authRoutes';
import dotenv from 'dotenv';
dotenv.config();
import { pool } from "./config/db";
import { errorHandler } from './middleware/errorMiddleware';

const app = express();


app.use(express.json());

app.get("/", (req, res) => {
  res.send("TaskForge API running 🚀");
});
app.use("/auth", authRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

pool.query("SELECT NOW()")
  .then(res => console.log("DB Connected:", res.rows))
  .catch(err => console.error("DB Error:", err));