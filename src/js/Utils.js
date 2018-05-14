export default {
  animate: (element, property, finalValue, callback) => {
    const finalValueNum = parseInt(finalValue, 10);
    const unit = finalValue.replace(finalValueNum, '');
    const callsPerSecond = 30;
    const initialValue = parseInt(element.style[property], 10) || 0;
    const diff = finalValueNum - initialValue;
    const absDiff = Math.abs(diff);
    const step = diff / callsPerSecond;
    let traveled = 0;

    const intervalRef = window.setInterval(() => {
      traveled += step;

      if (Math.abs(traveled) >= absDiff) {
        window.clearInterval(intervalRef);
        element.style[property] = `${finalValueNum}${unit}`;
        return callback && callback();
      } else {
        element.style[property] = `${initialValue + traveled}${unit}`;
      }
    }, 500 / callsPerSecond);
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
