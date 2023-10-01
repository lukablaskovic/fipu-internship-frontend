const Utils = {
  wait(seconds) {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  },

  arraysEqual(a, b) {
    // Convert potential proxy arrays to normal arrays using JSON
    let arrayA, arrayB;
    try {
      arrayA = JSON.parse(JSON.stringify(a));
      arrayB = JSON.parse(JSON.stringify(b));
    } catch (err) {
      // If there's an error in the serialization or parsing process (e.g., due to circular references),
      // we assume the arrays are not equal
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
      // If there's an error in the serialization or parsing process,
      // we assume the array is not empty for safety.
      return false;
    }

    return !Array.isArray(convertedArray) || !convertedArray.length;
  },
};

export default Utils;
