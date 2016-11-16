/* eslint-disable consistent-return */
/* eslint-disable no-bitwise */
/* eslint-disable new-cap */
import Hammer from 'hammerjs';
import StackBlur from 'stackblur-canvas';

import { directions, animationsNames } from './constants';
import defaultSettings from './defaultSettings';
import OptimizedMousewheelHandler from './optimizedMousewheelHandler';
import { isFunction, inRange, arrayEvery, loadImage } from './utils';

export default class RSBaseCarousel {
  constructor(element, customSettings = {}) {
    if (!element) {
      throw new Error('element is required');
    }

    const settings = Object.assign({}, defaultSettings, customSettings);
    this.settings = settings;

    const $container = $(element);
    $container.css({
      position: 'relative',
    });
    this.$container = $container;

    const slideBgCss = {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    };
    const slideBgCanvasCss = Object.assign({}, slideBgCss, {
      opacity: 0,
    });
    const slideBgImgCss = Object.assign({}, slideBgCanvasCss, settings.slideBgImgStyles);

    this.opts = {
      slideBgCss,
      slideBgCanvasCss,
      slideBgImgCss,
      slideBgFadeOpts: {
        duration: settings.slideBgImgFadeDuration,
      },
    };

    const currentIndex = 0;
    this.currentIndex = currentIndex;

    const $slides = $container.find(this.settings.slideSel);
    this.slidesArr = Array.from($slides).map((el, i) => {
      const active = i === currentIndex;
      const $el = $(el);
      this.prepareSlide($el, active);
      return {
        $el,
      };
    });

    this.mwHandler = new OptimizedMousewheelHandler(this.$container);
    this.mwHandler.addCallback(this.mouseWheelHandler.bind(this));

    // callbacks
    this.cb = {
      before: [],
      after: [],
    };

    this.locked = false;

    this.registerAnimations();
    this.initEventHandlers();
  }

  prepareSlide($el, active = false) {
    $el.css({
      position: 'absolute',
      top: 0,
      left: 0,
      display: active ? 'block' : 'none',
      transform: 'translateZ(0)',
      zIndex: this.settings.slideZIndex,
    });
    this.prepareSlideBg($el);
  }

  prepareSlideBg($el) {
    const $bg = $el.children(this.settings.slideBgSel);
    const smallImageUrl = $bg.data('imageSmall');
    const imageUrl = $bg.data('image');
    if (!smallImageUrl && !imageUrl) return;

    $bg.addClass(this.settings.slideBgImgLoadingClass);
    $bg.css(this.opts.slideBgCss);

    const $canvas = $(`<canvas class="${this.settings.slideBgCanvasClass}"></canvas>`);
    $canvas.css(this.opts.slideBgCanvasCss);
    $bg.append($canvas);

    const $bgImageEl = $(`<div class="${this.settings.slideBgImgClass}"></div>`);
    $bgImageEl.css(this.opts.slideBgImgCss);
    $bg.append($bgImageEl);

    if (smallImageUrl) {
      loadImage(smallImageUrl).then((img) => {
        const canvas = $canvas.get(0);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(
          img, 0, 0, img.naturalWidth, img.naturalHeight,
          0, 0, canvas.width, canvas.height
        );
        StackBlur.canvasRGB(
          canvas, 0, 0, canvas.width, canvas.height, this.settings.blurRadius);
        $canvas.velocity('fadeIn', this.opts.slideBgFadeOpts);
      });
    }

    loadImage(imageUrl).then((img) => {
      $bgImageEl.css({
        backgroundImage: `url(${img.src})`,
      });
      $.Velocity($bgImageEl, 'fadeIn', this.opts.slideBgFadeOpts)
        .then(() => {
          $bg
            .removeClass(this.settings.slideBgImgLoadingClass)
            .addClass(this.settings.slideBgImgLoadedClass);
          $canvas.remove();
        });
    });
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
      threshold: this.settings.swipeThreshold,
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
      const maxIndex = this.slidesArr.length - 1;
      let newIndexGtCurrent = nextIndex > this.currentIndex;

      if (this.currentIndex === maxIndex && nextIndex === 0) {
        newIndexGtCurrent = true;
      }

      if (this.currentIndex === 0 && nextIndex === maxIndex) {
        newIndexGtCurrent = false;
      }

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

    // Out
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

    // In
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

