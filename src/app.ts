import express from 'express';
import authRoutes from './routes/authRoutes';
import { env } from 'process';
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("TaskForge API running 🚀");
});
app.use("/auth", authRoutes);

app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
});