import { model, Schema } from "mongoose";

const authenticationsSchema = Schema({
	session_id: {
		type: String,
		required: true
	},
	valid: {
		type: Boolean,
		required: true
	},
});

const Authentications = model('Authentications', authenticationsSchema)

export default Authentications;