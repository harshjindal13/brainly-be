import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import env from "dotenv";
import { z } from "zod";
import bcrypt from "bcrypt";

import { connectDB } from "./config/db.js";
import { UserModel, ContentModel } from "./model/content.js";
import { reqBody, reqBodySignin } from "./validation/user.js";
import { userMiddleware } from "./middleware.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
env.config();

app.post("/api/v1/signup", async (req, res) => {
	const parsedData = reqBody.safeParse(req.body);

	if (!parsedData.success) {
		// This flattens the errors into a simple key-value object
		// const errorMessages = parsedDataWithSuccess.error.flatten().fieldErrors;

		res.json({
			message: "Incorrect format",

			// lets user know the exact reason for the error
			error: parsedData.error,
		});
		return;
	}

	const { username, password } = parsedData.data;

	const hashedPassword = await bcrypt.hash(password, 5);
	console.log(hashedPassword);

	try {
		await UserModel.create({
			username: username,
			password: hashedPassword,
		});

		res.json({ message: "User signed up" });
	} catch (e) {
		res.status(411).json({
			message: "User already exists",
		});
	}
});

app.post("/api/v1/signin", async (req, res) => {
	const parsedDataSignin = reqBodySignin.safeParse(req.body);

	if (!parsedDataSignin.success) {
		// This flattens the errors into a simple key-value object
		// const errorMessages = parsedDataSigninWithSuccess.error.flatten().fieldErrors;

		res.json({
			message: "Incorrect format",

			// lets user know the exact reason for the error
			error: parsedDataSignin.error,
		});
		return;
	}

	const { username, password } = parsedDataSignin.data;

	const user = await UserModel.findOne({ username });

	if (!user) {
		return res.status(401).json({
			message: "Invalid username or password",
		});
	}

	const passwordMatch = await bcrypt.compare(password, user.password as string); // password: send by the user, user.password: password from the db.

	// assuming plain text (NOT recommended)
	if (!passwordMatch) {
		return res.status(401).json({
			message: "Invalid username or password",
		});
	}

	if (user || passwordMatch) {
		const token = jwt.sign(
			{
				id: user._id,
			},
			process.env.JWT_PASSWORD as string,
		);

		res.json({ token });
	}

	res.json({
		message: "User signed in",
	});
});

app.post("/api/v1/content", userMiddleware, async (req, res) => {
	const link = req.body.link;
	const type = req.body.type;
	await ContentModel.create({
		link,
		type,
		title: req.body.title,
		//@ts-ignore
		userId: req.userId!,
		tags: [],
	});

	res.json({
		message: "Content added",
	});
});

app.get("/api/v1/content", userMiddleware, async (req, res) => {
	//@ts-ignore
	const userId = req.userId as string;
	const content = await ContentModel.find({
		userId: userId,
	}).populate("userId", "username");
	console.log(content);
	res.json({
		content,
	});
});

app.delete("/api/v1/content", async (req, res) => {});

app.post("/api/v1/brain/share", async (req, res) => {});

app.get("/api/v1/brain/:shareLink", async (req, res) => {});

connectDB().then(() => {
	app.listen(PORT, () => {
		console.log(`Server started on PORT: ${PORT}`);
	});
});
