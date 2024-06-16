import Authentications from '../models/authentications.js';
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

		const newAccessToken = generateToken({ sessionId: session.sessionId, email: session.email }, '5m');

		res.cookie('accessToken', newAccessToken, {
			maxAge: 300000, // 5 minutes
			httpOnly: true,
		});

		req.user = verifyToken(newAccessToken).payload;

		return next();
	} catch (error) {
		return next(error);
	}
};

export default tokenSession;

