import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
.then(() => {
	console.log('Succesfully connected to MngoDB Atlas!');
}).catch((error) => {
	console.log('Unable to connect to MongoDB Atlas!', error.message);
});