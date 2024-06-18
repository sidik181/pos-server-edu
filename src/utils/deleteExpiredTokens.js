const { Authentications } = require('../models/authentications');

const deleteExpiredTokens = async () => {
    try {
        const currentTime = new Date();
        await Authentications.deleteMany({ expires_at: { $lt: currentTime } });

        console.log('Expired tokens deleted successfully.');
    } catch (error) {
        console.error('Error deleting expired tokens:', error);
    }
};

deleteExpiredTokens();
