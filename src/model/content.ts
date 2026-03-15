import mongoose, { model, Schema } from "mongoose";

const UserSchema = new Schema({
	username: { type: String, unique: true },
	password: { type: String },
});

const ContentSchema = new Schema({
	title: String,
	link: String,
	tags: [{ type: mongoose.Types.ObjectId, ref: "Tag" }],
	type: String,
	userId: {
		type: mongoose.Types.ObjectId,
		ref: "user",
		required: true,
		validate: {
			// We use an async validator
			validator: async function (
				value: mongoose.Types.ObjectId,
			): Promise<boolean> {
				// Use .exists() for better performance as it returns only the _id or null
				const user = await model("user").exists({ _id: value });
				return !!user;
			},
			message: "The provided userId does not exist in the database.",
		},
	},
});

const LinkSchema = new Schema({
	hash: String,
	userId: {
		type: mongoose.Types.ObjectId,
		ref: "user",
		required: true,
		unique: true,
	},
});

export const UserModel = mongoose.model("user", UserSchema);
export const ContentModel = mongoose.model("content", ContentSchema);
export const LinkModel = mongoose.model("link", LinkSchema);
