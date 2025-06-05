const Utils = {
	wait(seconds) {
		return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
	},

	arraysEqual(a, b) {
		let arrayA, arrayB;
		try {
			arrayA = JSON.parse(JSON.stringify(a));
			arrayB = JSON.parse(JSON.stringify(b));
		} catch (err) {
			return false;
		}

		if (arrayA === arrayB) return true;
		if (arrayA.length !== arrayB.length) return false;

		for (let i = 0; i < arrayA.length; i++) {
			if (arrayA[i] !== arrayB[i]) return false;
		}

		return true;
	},

	isArrayEmpty(arr) {
		let convertedArray;
		try {
			convertedArray = JSON.parse(JSON.stringify(arr));
		} catch (err) {
			return false;
		}

		return !Array.isArray(convertedArray) || !convertedArray.length;
	},
};

export default Utils;
