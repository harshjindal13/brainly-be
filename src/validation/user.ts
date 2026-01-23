import { z } from "zod";

export const reqBody = z.object({
	username: z
		.string()
		.min(3, "Username must be atleast 3 char")
		.max(100, "Username must be atmost 100 char"),
	password: z
		.string()
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$#!%*?&]{8,}$/,
			"Password must contain uppercase, lowercase, numbers, and special characters",
		),
});

export const reqBodySignin = z.object({
	username: z
		.string()
		.min(3, "Username must be atlest 3 char")
		.max(100, "Username must be atmost 100 char"),
	password: z
		.string()
		.min(
			8,
			"Password must contain uppercase, lowercase, numbers, and special characters",
		),
});
