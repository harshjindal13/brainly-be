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
	userId: { type: mongoose.Types.ObjectId, ref: "user", required: true },
});

export const UserModel = mongoose.model("user", UserSchema);
export const ContentModel = mongoose.model("content", ContentSchema);
