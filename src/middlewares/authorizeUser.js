const authorizeUser = (role) => {
	return (req, res, next) => {
			if (req.user.role !== role) {
					return res.status(403).json({ message: 'Unauthorized access' });
			}
			next();
	};
};

export default authorizeUser;