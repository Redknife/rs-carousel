import { isFunction, arrayMean, arrayLast } from './utils';

function getAverageOfLast(array, number) {
  // taking `number` array from the end to make the average, if there are not enought, 1
  const lastElements = arrayLast(array, number);
  return Math.ceil(arrayMean(lastElements)) || 0;
}

export default class OptimizedMousewheelHandler {
  constructor($element, callbacks = []) {
    if (!$element || !$element.jquery) {
      throw new Error('$element must be jQuery object');
    }

    this.$element = $element;
    this.locked = false;
    this.prevTimeScroll = new Date().getTime();
    this.scrollings = [];
    this.callbacks = callbacks;
  }

  startListen() {
    this.$element.on('wheel', this.handler.bind(this));
  }

  handler(e) {
    const curTime = new Date().getTime();
    const origEvent = e.originalEvent;
    const value = origEvent.deltaY;
    const delta = Math.max(-1, Math.min(1, origEvent.deltaY));
    const isScrollingVertically = Math.abs(origEvent.deltaX) < Math.abs(origEvent.deltaY);

    // limiting the array to 150 (lets not waste memory!)
    if (this.scrollings.length > 149) {
      this.scrollings.shift();
    }

    // keeping record of the previous scrollings
    this.scrollings.push(Math.abs(value));

    // preventing to scroll the site on mouse wheel
    e.preventDefault();

    // time difference between the last scroll and the current one
    const timeDiff = curTime - this.prevTimeScroll;
    this.prevTimeScroll = curTime;

    // haven't they scrolled in a while?
    // (enough to be consider a different scrolling action to scroll another section)
    if (timeDiff > 270) {
      // emptying the array, we dont care about old scrollings for our averages
      this.scrollings = [];
    }

    if (!this.locked) {
      const averageEnd = getAverageOfLast(this.scrollings, 10);
      const averageMiddle = getAverageOfLast(this.scrollings, 70);
      const isAccelerating = averageEnd >= averageMiddle;

      // to avoid double swipes...
      if (isAccelerating && isScrollingVertically) {
        this.callbacks.forEach((cb) => {
          cb(delta);
        });
      }
    }

    return false;
  }

  addCallback(cb) {
    if (isFunction(cb)) {
      this.callbacks.push(cb);
    }
  }
}
