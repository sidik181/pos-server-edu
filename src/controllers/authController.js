import bcrypt from 'bcrypt';
import Users from '../services/userAccount.js';
import jwt from 'jsonwebtoken';
import { generateAccessToken, generateRefreshToken } from '../middlewares/tokenManager.js'

const login = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		const user = Users.find(user => user.email === email);

		if (user) {
			const isPasswordValid = await bcrypt.compare(password, user.password);
			if (isPasswordValid) {
				const accessToken = generateAccessToken(user);
				const refreshToken = generateRefreshToken(user);

				res.cookie('refreshToken', refreshToken, {
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production',
					sameSite: 'strict',
					maxAge: 7 * 24 * 60 * 60 * 1000
				});

				res.json({ accessToken });
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

const logout = (req, res, next) => {
	const refreshToken = req.cookies.refreshToken;

	if (!refreshToken) {
		return res.status(400).json({ message: 'No refresh token found' });
	}

	const user = Users.find(user => user.refresh_token === refreshToken);

	if (!user) {
		return res.status(403).json({ message: 'Invalid refresh token' });
	}

	user.refresh_token = null;

	res.clearCookie('refreshToken', {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
	});

	return res.json({ message: 'Logout successful' });
};

const getProfile = (req, res, next) => {
	try {
		const userId = req.user.userId;

		const user = Users.find(user => user.id === userId);

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

const refreshToken = (req, res, next) => {
	const refreshToken = req.cookies.refreshToken;

	if (!refreshToken) {
		return res.status(403).json({ message: 'Refresh token is required' });
	}

	const user = Users.find(user => user.refresh_token === refreshToken);

	if (!user) {
		return res.status(403).json({ message: 'Invalid refresh token' });
	}

	try {
		jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

		const newAccessToken = generateAccessToken(user);
		res.json({ accessToken: newAccessToken });
	} catch (error) {
		res.status(403).json({ message: 'Invalid refresh token' });
	}
};

export default {
	login,
	logout,
	getProfile,
	refreshToken
}