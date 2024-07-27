import { model, Schema } from "mongoose";

const authenticationsSchema = Schema({
	session_id: {
		type: String,
		required: true
	},
	expires_at: {
		type: Date,
		required: true
	},
});

const Authentications = model('Authentications', authenticationsSchema)

export default Authentications;