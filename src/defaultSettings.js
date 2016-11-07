import { directions } from './constants';

export default {
  slideSel: '.js-rs-carousel__slide',
  slideBgSel: '.js-rs-carousel__slide__bg',
  slideBgCanvasClass: 'bg-canvas',
  slideBgImgClass: 'bg-img',
  slideBgImgStyles: {
    backgroundPosition: 'center center',
    backgroundSize: 'cover',
  },
  slideBgImgLoadingClass: 'bg-img-loading',
  slideBgImgLoadedClass: 'bg-img-loaded',
  slideBgImgFadeDuration: 500,
  blurRadius: 30,
  slideZIndex: 1000,
  swipeThreshold: 30,
  duration: 1000,
  direction: directions.vertical,
  easing: 'easeInOutCubic',
  infinite: true,
};
