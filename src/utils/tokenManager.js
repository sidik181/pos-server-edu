import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const privateKeyB64 = process.env.PRIVATE_KEY;
const publicKeyB64 = process.env.PUBLIC_KEY;

const privateKey = Buffer.from(privateKeyB64, "base64").toString("utf-8");
const publicKey = Buffer.from(publicKeyB64, "base64").toString("utf-8");


export const generateToken = (payload, expiresIn) => {
    return jwt.sign(payload, privateKey, { algorithm: "RS256", expiresIn });
};

export const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, publicKey);
        return { payload: decoded, expired: false };
      } catch (error) {
        return { payload: null, expired: true };
      }
};
