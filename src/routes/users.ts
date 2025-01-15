import express from "express";
import bcrypt from "bcrypt";
import db from "../db/db";
import { User } from "../db/schema";
import { loginSchema, registerSchema } from "../schemas/auth.ts";
import validate from "../middleware/validate.ts";
import isAuthorized from "../middleware/authorization.ts";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/auth/register", validate(registerSchema), async (req, res) => {
  try {
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db
      .insert(User)
      .values({
        email,
        password: hashedPassword,
      })
      .returning(); // Use .returning() to get the inserted user

    const user = newUser[0]; // Get the inserted user (this is important to get the ID)

    // Ensure that user.id is a string (convert if necessary)
    const userId = user.id.toString();

    const accessToken = jwt.sign(
      { userId, email: user.email },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
        subject: "accessApi",
        algorithm: "HS256",
      }
    );

    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: false, // Set to true in production (HTTPS)
      sameSite: "lax", // Required for cross-origin
      maxAge: 60 * 60 * 1000,
      path: "/",
      // domain: process.env.COOKIE_DOMAIN,
    });

    // Send the final response
    return res
      .status(201)
      .json({ message: "User registered successfully", body: req.body.email });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/auth/login", validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists in the database
    const users = await db.select().from(User).where(eq(User.email, email));

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[0];

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h", subject: "accessApi" }
    );

    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: false, // Set to true in production (HTTPS)
      sameSite: "lax", // Required for cross-origin
      maxAge: 60 * 60 * 1000,
      path: "/",
      // domain: process.env.COOKIE_DOMAIN,
    });

    // Respond with success (you may want to include a token or session logic here)
    return res.status(200).json({
      message: "Login successful",
      user: user.email,
      userId: user.id,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/test", isAuthorized, (req, res) => {
  return res.status(200).json({ message: "works" });
});

export default router;
