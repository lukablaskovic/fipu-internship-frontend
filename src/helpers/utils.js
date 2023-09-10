const Utils = {
  wait(seconds) {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  },

  arraysEqual(a, b) {
    if (a === b) return true;
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }

    return true;
  },
};

export default Utils;
