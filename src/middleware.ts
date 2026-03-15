import jwt, { type JwtPayload } from "jsonwebtoken";
import env from "dotenv";
import type { NextFunction, Request, Response } from "express";

env.config();

export const userMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const header = req.header("authorization");

	if (!header || !process.env.JWT_PASSWORD) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	const token = header.startsWith("Bearer ") ? header.slice("Bearer ".length) : header;

	let decoded: string | JwtPayload;
	try {
		decoded = jwt.verify(token, process.env.JWT_PASSWORD);
	} catch {
		return res.status(401).json({ message: "Unauthorized" });
	}
	// You might want to attach the decoded user information to the request object
	// req.user = decoded;

	if (decoded) {
		if (typeof decoded === "string") {
			// An Object (JwtPayload): This happens when the token contains JSON data (claims), which is the standard for 99% of web apps.

			// A String: This happens if the token payload was just a literal string (e.g., jwt.sign("hello", "secret")) rather than an object like { id: 123 }.

			res.status(403).json({
				message: "You are not logged in",
			});
			return;
		}
		req.userId = (decoded as JwtPayload).id;
		next();
	} else {
		res.status(403).json({
			message: "You are not logged in",
		});
	}
};
