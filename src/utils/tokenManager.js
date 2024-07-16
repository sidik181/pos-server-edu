import jwt from 'jsonwebtoken';
import fs from 'fs';

const privateKey = fs.readFileSync('key/private.key', 'utf8');
const publicKey = fs.readFileSync('key/public.key', 'utf8');


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