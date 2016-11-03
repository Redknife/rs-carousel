/* eslint-disable consistent-return */
/* eslint-disable no-bitwise */
/* eslint-disable new-cap */
import Hammer from 'hammerjs';
import { directions, animationsNames } from './constants';
import defaultSettings from './defaultSettings';
import OptimizedMousewheelHandler from './optimizedMousewheelHandler';
import { isFunction, inRange, arrayEvery } from './utils';

export default class RSBaseCarousel {
  constructor(element, customSettings = {}) {
    if (!element) {
      throw new Error('element is required');
    }

    this.settings = Object.assign({}, defaultSettings, customSettings);
    this.$container = $(element);
    this.currentIndex = 0;

    const $slides = this.$container.find(this.settings.slideSel);
    this.slidesArr = Array.from($slides).map((el, i) => {
      const active = i === this.currentIndex;
      const $el = $(el);
      $el.css({
        position: 'absolute',
        top: 0,
        left: 0,
        display: active ? 'block' : 'none',
        transform: 'translateZ(0)',
        zIndex: this.settings.zIndex,
      });
      return {
        $el,
      };
    });

    this.mwHandler = new OptimizedMousewheelHandler(this.$container);
    this.mwHandler.addCallback(this.mouseWheelHandler.bind(this));

    this.locked = false;

    // callbacks
    this.cb = {
      before: [],
      after: [],
    };
    this.registerAnimations();
    this.initEventHandlers();
  }

  get currentSlide() {
    return this.slidesArr[this.currentIndex];
  }

  get nextIndex() {
    return this.getIndexSiblings(this.currentIndex).next;
  }

  get prevIndex() {
    return this.getIndexSiblings(this.currentIndex).prev;
  }

  getIndexSiblings(index) {
    const length = this.slidesArr.length;
    const incIndex = index + 1;
    const decIndex = index - 1;

    return {
      prev: inRange(decIndex, length) ? decIndex : length - 1,
      next: inRange(incIndex, length) ? incIndex : 0,
    };
  }

  initEventHandlers() {
    this.mwHandler.startListen();

    // Touch events
    this.mc = new Hammer(this.$container[0]);
    this.mc.get('swipe').set({
      enable: true,
      direction: this.settings.direction,
      threshold: 30,
    });
    this.mc.on('swipeleft swiperight swipeup swipedown', this.swipeHandler.bind(this));
  }

  swipeHandler(e) {
    this.direction = e.direction;
    switch (e.direction) {
      case directions.right:
      case directions.down:
        this.prev();
        break;
      case directions.left:
      case directions.up:
        this.next();
        break;
      default:
        return false;
    }
  }

  mouseWheelHandler(delta) {
    this.direction = this.getDirByMousewheelDelta(delta);
    if (delta < 0) {
      this.prev();
    } else {
      this.next();
    }
  }

  getDirByMousewheelDelta(delta) {
    let result;
    if (delta < 0) {
      result = directions.down | directions.right;
    } else {
      result = directions.left | directions.up;
    }
    return (result & this.settings.direction);
  }

  next() {
    return this.goTo(this.nextIndex);
  }

  prev() {
    return this.goTo(this.prevIndex);
  }

  goTo(nextIndex) {
    const requiredPredicates = [
      !this.locked,
      nextIndex !== this.currentIndex,
      inRange(nextIndex, this.slidesArr.length),
    ];

    if (!arrayEvery(requiredPredicates)) return;

    this.lock();

    if (this.direction === undefined) {
      const newIndexGtCurrent = nextIndex > this.currentIndex;
      // eslint-disable-next-line default-case
      switch (this.settings.direction) {
        case directions.vertical:
          this.direction = newIndexGtCurrent ? directions.up : directions.down;
          break;
        case directions.horizontal:
          this.direction = newIndexGtCurrent ? directions.left : directions.right;
          break;
      }
    }

    const currentSlide = this.currentSlide;
    const nextSlide = this.slidesArr[nextIndex];

    this.cb.before.forEach(cb => cb(currentSlide, nextSlide));

    const slideOutEnd = $.Velocity(currentSlide.$el, animationsNames.out[this.direction]);
    const slideInEnd = $.Velocity(nextSlide.$el, animationsNames.in[this.direction]);

    return Promise.all([slideOutEnd, slideInEnd]).then(() => {
      this.currentIndex = nextIndex;
      this.direction = undefined;
      this.unlock();
      this.cb.after.forEach(cb => cb(this.currentSlide));
    });
  }

  lock() {
    this.locked = true;
    this.mwHandler.locked = true;
  }

  unlock() {
    this.locked = false;
    this.mwHandler.locked = false;
  }

  addBeforeCb(cb) {
    if (isFunction(cb)) {
      this.cb.before.push(cb);
    }
  }

  addAfterCb(cb) {
    if (isFunction(cb)) {
      this.cb.after.push(cb);
    }
  }

  registerAnimation(name, calls) {
    $.Velocity.RegisterEffect(name, {
      defaultDuration: this.settings.duration,
      calls,
    });
  }

  registerAnimations() {
    const easing = this.settings.easing;

    this.registerAnimation(
      animationsNames.out[directions.up],
      [
        [{ translateY: ['-100%', 0], translateZ: 0 }, 1, { easing }],
      ]
    );
    this.registerAnimation(
      animationsNames.out[directions.up],
      [
        [{ translateY: ['-100%', 0], translateZ: 0 }, 1, { easing }],
      ]
    );

    this.registerAnimation(
      animationsNames.out[directions.down],
      [
        [{ translateY: ['100%', 0], translateZ: 0 }, 1, { easing }],
      ]
    );

    this.registerAnimation(
      animationsNames.out[directions.left],
      [
        [{ translateX: ['-100%', 0], translateZ: 0 }, 1, { easing }],
      ]
    );

    this.registerAnimation(
      animationsNames.out[directions.right],
      [
        [{ translateX: ['100%', 0], translateZ: 0 }, 1, { easing }],
      ]
    );

    this.registerAnimation(
      animationsNames.in[directions.up],
      [
        [{ translateY: [0, '100%'], translateZ: 0 }, 1, { easing }],
      ]
    );

    this.registerAnimation(
      animationsNames.in[directions.down],
      [
        [{ translateY: [0, '-100%'], translateZ: 0 }, 1, { easing }],
      ]
    );

    this.registerAnimation(
      animationsNames.in[directions.left],
      [
        [{ translateX: [0, '100%'], translateZ: 0 }, 1, { easing }],
      ]
    );

    this.registerAnimation(
      animationsNames.in[directions.right],
      [
        [{ translateX: [0, '-100%'], translateZ: 0 }, 1, { easing }],
      ]
    );
  }
}

