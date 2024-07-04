export const indexFileContent = `
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes";

const app = express();
// Middleware
app.use(bodyParser.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/node-auth-example", {});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});
// Routes
app.use("/auth", authRoutes);
app.get("/", (req, res) => {
  res.json({ message: "working fine ..." });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(\`Server is running on http://localhost:\${PORT}\`);
});
`;

export const authControllerFileContent = `


import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";
import User, { IUser } from "../models/authModal"; // Assuming User model and IUser interface are defined

const JWT_SECRET: Secret = process.env.JWT_SECRET || "";

async function registerUser(req: Request, res: Response) {
  try {
    // Validate input
    const { name, email, password } = req.body;
    const missingFields: string[] = [];

    if (!name) {
      missingFields.push("name");
    }
    if (!email) {
      missingFields.push("email");
    }
    if (!password) {
      missingFields.push("password");
    }

    if (missingFields.length > 0) {
      return res
        .status(400)
        .json({ error: \`Missing fields: \${missingFields.join(", ")}\` });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    user = new User({
      name,
      email,
      password: hashedPassword,
    });
    const savedData = await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);

    res.status(201).json({ token, user: savedData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}

async function loginUser(req: Request, res: Response) {
  try {
    // Validate input
    const { email, password } = req.body;
    const missingFields: string[] = [];

    if (!email) {
      missingFields.push("email");
    }
    if (!password) {
      missingFields.push("password");
    }

    if (missingFields.length > 0) {
      return res
        .status(400)
        .json({ error: \`Missing fields: \${missingFields.join(", ")}\` });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);

    res.status(200).json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}

async function getProfile(req: any, res: Response) {
  try {
    // Get token from headers

    // Verify token

    const userId = req.userId;

    // Fetch user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return user profile
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      // Add more fields as needed
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}

export default {
  registerUser,
  loginUser,
  getProfile,
};


`;

export const authMiddlewareFileContent = `

import { Request, Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";
// Import dotenv and call config method
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET: Secret = process.env.JWT_SECRET || "";
console.log(JWT_SECRET);
// Middleware function to verify JWT token
export function verifyToken(req: Request, res: Response, next: NextFunction) {
  // Get token from headers
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token not" });
  }

  // Verify token
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Invalid token", err });
    }
    // Attach the decoded payload to the request object
    (req as any).userId = (decoded as { userId: string }).userId;
    next();
  });
}

`;

export const userModalFileContent = `

import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export default mongoose.model<IUser>("User", UserSchema);
`;

export const authRouteFileContent = `
import express from "express";
import authController from "../controllers/authController";
import { verifyToken } from "../middleware/authMiddleware";

const router = express.Router();

// Routes
router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.get("/profile", verifyToken, authController.getProfile);

export default router;

`;

export const validatorFileContent = `

import validator from "validator";

export function validateRegistrationData(
  name: string,
  email: string,
  password: string
): boolean {
  // Implement validation logic here
  return true; // Return true if data is valid, false otherwise
}

export function validateLoginData(email: string, password: string): boolean {
  // Implement validation logic here
  return true; // Return true if data is valid, false otherwise
}
`;

export const tsConfigFileContent = `

{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@src/*": ["src/*"]
    },

    "target": "es6",
    "module": "commonjs",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules"]
}

`;
