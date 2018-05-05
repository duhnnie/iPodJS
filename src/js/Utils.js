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
  },
  secondsToTime: (seconds) => {
    seconds = Math.round(seconds);

    let hoursPart = Math.floor(seconds / 3600);
    let minutesPart = Math.floor((seconds - (hoursPart * 3600)) / 60);
    let secondsPart = seconds % 3600;

    secondsPart = seconds < 10 ? `0${secondsPart}` : seconds;
    minutesPart = (hoursPart > 0 && minutesPart < 10 ? `0${minutesPart}` : minutesPart) + ':';

    return (hoursPart ? hoursPart + ':' : '') + `${minutesPart}${secondsPart}`;
  }
};
