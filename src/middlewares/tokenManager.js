import jwt from 'jsonwebtoken';

const generateAccessToken = (user) => {
	return jwt.sign({ email: user.email, name: user.full_name, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m' });
};

const generateRefreshToken = (user) => {
	return jwt.sign({ email: user.email, name: user.full_name, role: user.role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

const verifyToken = (req, res, next) => {
	const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ message: 'Token is required' });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

export {
	generateAccessToken,
	generateRefreshToken,
	verifyToken
};