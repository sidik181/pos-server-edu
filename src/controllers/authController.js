import bcrypt from 'bcrypt';
import Users from '../services/userAccount.js';
import Authentications from '../models/authentications.js';
import { generateToken, verifyToken } from '../utils/tokenManager.js'

const login = async (req, res, next) => {
	const { email, password } = req.body;

	try {
		const user = Users.find(user => user.email === email);

		if (user) {
			const isPasswordValid = await bcrypt.compare(password, user.password);
			if (isPasswordValid) {

				const expiresRefreshToken = 7 * 24 * 60 * 60 * 1000; // 7 days

				const existAuthentication = await Authentications.findOne({ session_id: user.uuid });
				if (existAuthentication) {
					existAuthentication.expires_at = expiresRefreshToken;
					existAuthentication.valid = true;

					await existAuthentication.save();
				} else {
					const newAuth = new Authentications({
						session_id: user.uuid,
						expires_at: expiresRefreshToken,
						valid: true
					});

					await newAuth.save();
				}

				const accessToken = generateToken(
					{ email: user.email, name: user.full_name, role: user.role, sessionId: newAuth.session_id },
					'5m'
				);
				const refreshToken = generateToken({ sessionId: newAuth.session_id }, '7d');

				res.cookie("accessToken", accessToken, {
					maxAge: 5 * 60 * 1000, // 5 minutes
					httpOnly: true,
				});

				res.cookie("refreshToken", refreshToken, {
					maxAge: expiresRefreshToken,
					httpOnly: true,
				});

				return res.send({ message: 'Login berhasil' });
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
	const { refreshToken } = req.cookies;

	if (!refreshToken) {
		return res.status(400).json({ message: 'No refresh token found' });
	}

	try {
		const { payload } = verifyToken(refreshToken);
		const authRecord = await Authentications.findOne({ session_id: payload.sessionId });

		if (!authRecord) {
			return res.status(403).json({ message: 'Invalid refresh token' });
		}

		await Authentication.deleteOne({ session_id: payload.sessionId });

		res.clearCookie('accessToken');
		res.clearCookie('refreshToken');

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

export default {
	login,
	logout,
	getProfile,
}