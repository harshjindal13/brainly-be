export const random = (len: number) => {
	let options = "1234567890qwertyuiopsdfghjklzxcvbnm";
	let length = options.length;

	let ans = "";

	for (let index = 0; index < len; index++) {
		ans += options[Math.floor(Math.random() * length)];
	}

	return ans;
};
