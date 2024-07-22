import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import Users from "../services/userAccount.js";
import Authentications from "../models/authentications.js";
import {
  generateToken,
  verifyToken,
} from "../utils/tokenManager.js";

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = Users.find((user) => user.email === email);

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        const expiresAccessToken = 5 * 60 * 1000; // 5 minutes
        const accessTokenExpiresAt = new Date(Date.now() + expiresAccessToken);

        const expiresRefreshToken = 7 * 24 * 60 * 60 * 1000; // 7 days
        const refreshTokenExpiresAt = new Date(Date.now() + expiresRefreshToken);

        let authentication = await Authentications.findOne({
          session_id: user.uuid,
        });

        if (authentication) {
          authentication.expires_at = refreshTokenExpiresAt;
          authentication.valid = true;
          await authentication.save();
        } else {
          const authentication = new Authentications({
            session_id: user.uuid,
            expires_at: refreshTokenExpiresAt,
            valid: true,
          });
          await authentication.save();
        }

        const accessToken = generateToken(
          {
            name: user.full_name,
            role: user.role,
            sessionId: user.uuid,
          },
          "5m"
        );

        const refreshToken = generateToken({ sessionId: user.uuid }, "7d");

        res.cookie("refreshToken", refreshToken, {
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: expiresRefreshToken,
          httpOnly: true,
        });

				const { password, ...userWithoutPassword } = user;

				return res.status(201).json({
          accessToken,
          accessTokenExpiresAt: accessTokenExpiresAt,
          user: userWithoutPassword,
        });
      } else {
        return res.status(401).json({ message: "Invalid email or password" });
      }
    } else {
      return res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(400).json({ message: "No refresh token found" });
  }

  try {
    const { payload } = verifyToken(refreshToken);

    if (!payload) {
      res.clearCookie("refreshToken");
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const authRecord = await Authentications.findOne({
      session_id: payload.sessionId,
    });

    if (!authRecord) {
      res.clearCookie("refreshToken");
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    await Authentications.deleteOne({ session_id: payload.sessionId });

    res.clearCookie("refreshToken");

    return res.json({ message: "Logout successful" });
  } catch (error) {
    next(error);
  }
};

const refreshAccessToken = async (req, res, next) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(400).json({ message: "No refresh token found" });
  }

	try {
    const { payload } = verifyToken(refreshToken);
    const authRecord = await Authentications.findOne({
      session_id: payload.sessionId,
    });

    const user = Users.find((user) => user.uuid === payload.sessionId);

    if (!authRecord) {
      res.clearCookie("refreshToken");
      return res.status(403).json({ message: "Invalid refresh token" });
    }

		const expiresAccessToken = 5 * 60 * 1000; // 5 minutes
    const accessTokenExpiresAt = new Date(Date.now() + expiresAccessToken);

    const newAccessToken = generateToken(
      {
        name: user.full_name,
        role: user.role,
        sessionId: payload.sessionId,
      },
      "5m"
    );

		const { password, ...userWithoutPassword } = Users.find(
      (user) => user.uuid === payload.sessionId
    );

		return res.status(201).json({
      accessToken: newAccessToken,
      accessTokenExpiresAt: accessTokenExpiresAt,
      user: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  login,
  logout,
  refreshAccessToken
};
