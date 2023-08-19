const Utils = {
  wait(seconds) {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  },
};

export default Utils;
