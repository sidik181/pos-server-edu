import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
// import fs from "fs";

// const privateKey = fs.readFileSync("src/key/private.key", "utf8");
// const publicKey = fs.readFileSync("src/key/public.key", "utf8");

const privateKey = process.env.PRIVATE_KEY;
const publicKey = process.env.PUBLIC_KEY;
console.log(privateKey);


// const ACCESS_SECRET_KEY = process.env.ACCESS_SECRET_KEY;
// const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;


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

// export const generateAccessToken = (payload, expiresIn) => {
//   return jwt.sign(payload, ACCESS_SECRET_KEY, {
//     algorithm: "RS256",
//     expiresIn,
//   });
// };

// export const generateRefreshToken = (payload, expiresIn) => {
//   return jwt.sign(payload, REFRESH_SECRET_KEY, {
//     algorithm: "RS256",
//     expiresIn,
//   });
// };

// export const verifyAccessToken = (token) => {
//     try {
//         const decoded = jwt.verify(token, ACCESS_SECRET_KEY);
//         return { payload: decoded, expired: false };
//       } catch (error) {
//         return { payload: null, expired: true };
//       }
// };

export const verifyRefreshToken = (token) => {
    try {
        const decoded = jwt.verify(token, REFRESH_SECRET_KEY);
        return { payload: decoded, expired: false };
      } catch (error) {
        return { payload: null, expired: true };
      }
};
