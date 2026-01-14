import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();

app.use(express.json());
app.use(cors());

app.listen(prompt, () => {
	console.log(`Server running on port ${PORT}`);
});
