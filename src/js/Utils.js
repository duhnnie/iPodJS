export default {
  animate: (element, property, finalValue, callback) => {
    const finalValueNum = parseInt(finalValue, 10);
    const unit = finalValue.replace(finalValueNum, '');
    const intervalRef = window.setInterval(() => {
      let currentValue = parseInt(element.style[property], 10) || 0;

      if (currentValue === finalValueNum) {
        window.clearInterval(intervalRef);
        return callback && callback();
      } else if (currentValue < finalValueNum) {
        element.style[property] = `${++currentValue}${unit}`;
      } else {
        element.style[property] = `${--currentValue}${unit}`;
      }
    }, 1);
  }
};
