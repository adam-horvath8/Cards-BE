import express, { Express, Request, Response } from "express";
import userRouter from "./routes/users";
import cors from "cors";

const app: Express = express();
const PORT: number = 3001;

app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Your Nuxt app URL
    credentials: true, // Allow credentials
  })
);

app.use(express.json());

// app.use("/auth", authRouter);
app.use("/users", userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
