import fs from "fs";
import jwt from "jsonwebtoken";

const publicKey = fs.readFileSync("key/public.key", "utf8");

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
