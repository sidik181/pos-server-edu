import bcrypt from 'bcrypt';
import Users from '../services/userAccount.js';
import jwt from 'jsonwebtoken';
import Authentications from '../models/authentications.js';
import { generateToken } from '../utils/tokenManager.js'

const login = async (req, res, next) => {
	const { email, password } = req.body;

	try {
		const user = Users.find(user => user.email === email);

		if (user) {
			const isPasswordValid = await bcrypt.compare(password, user.password);
			if (isPasswordValid) {

				const newAuth = new Authentications({
					session_id: user.uuid,
					email: user.email,
					valid: true
				});
				await newAuth.save();

				const accessToken = generateToken(
					{ email: user.email, name: user.full_name, role: user.role, sessionId: newAuth.session_id },
					'5m'
				);
				const refreshToken = generateToken({ sessionId: newAuth.session_id }, '7d');

				res.cookie("accessToken", accessToken, {
					maxAge: 300000, // 5 minutes
					httpOnly: true,
				});

				res.cookie("refreshToken", refreshToken, {
					maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
					httpOnly: true,
				});

				return res.send(newAuth);
			} else {
				res.status(401).json({ message: 'Invalid email or password' });
			}
		} else {
			res.status(401).json({ message: 'Invalid email or password' });
		}
	} catch (error) {
		next(error);
	}
};

const logout = async (req, res, next) => {
	const refreshToken = req.cookies.token;

	if (!refreshToken) {
		return res.status(400).json({ message: 'No refresh token found' });
	}

	try {
		const authRecord = await Authentications.findOne({ refreshToken });

		if (!authRecord) {
			return res.status(403).json({ message: 'Invalid refresh token' });
		}

		await Authentication.deleteOne({ refreshToken });

		return res.json({ message: 'Logout successful' });
	} catch (error) {
		next(error);
	}
};

const getProfile = (req, res, next) => {
	try {
		const userId = req.user.id;

		const user = Users.find(user => user.uuid === userId);

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		res.json({
			message: "success",
			data: {
				email: user.email,
				name: user.full_name,
				role: user.role
			}
		});
	} catch (error) {
		next(error);
	}
};

const refreshToken = async (req, res, next) => {
	const refreshToken = req.cookies.token;

	if (!refreshToken) {
		return res.status(403).json({ message: 'Refresh token is required' });
	}

	try {
		const authRecord = await Authentications.findOne({ token: refreshToken });
		const user = Users.find(user => user.uuid === authRecord.user_id);

		if (!authRecord || !user) {
			return res.status(403).json({ message: 'Invalid refresh token' });
		}

		const currentTime = new Date();
		if (currentTime > authRecord.expiresAt) {
			await Authentications.deleteOne({ refreshToken });
			return res.status(403).json({ message: 'Refresh token has expired' });
		}

		jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

		const newAccessToken = generateAccessToken(user);
		res.json({ accessToken: newAccessToken });
	} catch (error) {
		next(error);
	}
};

const getSession = async (req, res, next) => {
	const { sessionId } = req.cookies
}

export default {
	login,
	logout,
	getProfile,
	refreshToken,
	getSession
}