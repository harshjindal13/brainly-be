import jwt, { type JwtPayload } from "jsonwebtoken";
import env from "dotenv";
import type { NextFunction, Request, Response } from "express";

env.config();

export const userMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const header = req.header("authorization");

	if (!header || !process.env.JWT_PASSWORD) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	const decoded = jwt.verify(header as string, process.env.JWT_PASSWORD);
	// You might want to attach the decoded user information to the request object
	// req.user = decoded;

	if (decoded) {
		if (typeof decoded === "string") {
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
