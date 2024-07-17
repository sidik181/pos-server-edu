// import fs from "fs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// const publicKey = fs.readFileSync("key/public.key", "utf8");
const publicKeyB64 = process.env.PUBLIC_KEY;
const publicKey = Buffer.from(publicKeyB64, "base64").toString("utf-8");
// const ACCESS_SECRET_KEY = process.env.ACCESS_SECRET_KEY;

export const authorizeUser = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: "Unauthorized access" });
    }
    next();
  };
};

export const protectedRoute = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).send({ message: "Invalid session" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, publicKey, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: "Invalid session" });
    }

    req.user = decoded;
    next();
  });
};
