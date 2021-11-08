export const disableEmotionWarnings = () => {
  /* eslint-disable no-console */
  const log = console.error.bind(console);
  console.error = (...args) => {
    /* eslint-enable no-console */
    if (
      args.indexOf('The pseudo class ":first-child"') &&
      args.indexOf(
        'is potentially unsafe when doing server-side rendering. Try changing it to'
      )
    ) {
      return;
    }
    log(...args);
  };
};

export const isMac = window.navigator.userAgent.indexOf('Mac') > -1;
// test