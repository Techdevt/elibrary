export let timer = null;
export let timerStarted = false;

export default function delay (milliseconds) {
  return new Promise((resolve, reject) => {
    // const shouldFail = Math.random() <= 0.2;
    timerStarted = true;
    timer = setTimeout(() => {
      // if(shouldFail) reject();
      // else resolve();
      timerStarted = false;
      resolve();
    }, milliseconds);
  });
}

export function setTimerStatus(bool) {
  timerStarted = bool;
}