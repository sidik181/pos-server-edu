export const authorizeUser = (role) => {
	return (req, res, next) => {
		if (req.user.role !== role) {
			return res.status(403).json({ message: 'Unauthorized access' });
		}
		next();
	};
};

export const protectedRoute = (req, res, next) => {
	if (!req.user) {
		return res.status(403).send({ message: "Invalid session" });
	}
	return next();
}
