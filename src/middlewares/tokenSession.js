import Authentications from '../models/authentications.js';
import Users from '../services/userAccount.js';
import { generateToken, verifyToken } from '../utils/tokenManager.js';

const tokenSession = async (req, res, next) => {
	const { accessToken, refreshToken } = req.cookies;

	const { payload, expired } = verifyToken(accessToken);

	if (payload) {
		req.user = payload;
		return next();
	}

	const { payload: refreshPayload } = expired && refreshToken ? verifyToken(refreshToken) : { payload: null };

	if (!refreshPayload) {
		return next();
	}

	try {
		const session = await Authentications.findOne({ session_id: refreshPayload.sessionId });


		if (!session && !session.valid) {
			return next();
		}

		const user = Users.find(user => user.uuid === session.session_id);

		const newAccessToken = generateToken({ email: user.email, name: user.full_name, role: user.role, sessionId: session.session_id }, '5m');

		res.cookie('accessToken', newAccessToken, {
			maxAge: 5 * 60 * 1000, // 5 minutes
			httpOnly: true,
		});

		req.user = verifyToken(newAccessToken).payload;

		return next();
	} catch (error) {
		res.clearCookie('accessToken');
		res.clearCookie('refreshToken');
		return next(error);
	}
};

export default tokenSession;

