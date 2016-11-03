import Hammer from 'hammerjs';

export const directions = {
  left: Hammer.DIRECTION_LEFT,
  right: Hammer.DIRECTION_RIGHT,
  up: Hammer.DIRECTION_UP,
  down: Hammer.DIRECTION_DOWN,
  vertical: Hammer.DIRECTION_VERTICAL,
  horizontal: Hammer.DIRECTION_HORIZONTAL,
};

export const directionsNames = {};
Object.keys(directions).forEach((key) => {
  directionsNames[directions[key]] = key;
});

export const animationsNames = {
  in: {
    [directions.up]: 'carouselSlideUpIn',
    [directions.down]: 'carouselSlideDownIn',
    [directions.left]: 'carouselSlideLeftIn',
    [directions.right]: 'carouselSlideRightIn',
  },
  out: {
    [directions.up]: 'carouselSlideUpOut',
    [directions.down]: 'carouselSlideDownOut',
    [directions.left]: 'carouselSlideLeftOut',
    [directions.right]: 'carouselSlideRightOut',
  },
};
