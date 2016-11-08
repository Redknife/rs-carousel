[![License](https://img.shields.io/github/license/Redknife/rs-carousel.svg)](https://github.com/Redknife/rs-carousel)
[![GitHub version](https://img.shields.io/github/tag/Redknife/rs-carousel.svg)](https://github.com/Redknife/rs-carousel)
[![NPM version](https://img.shields.io/npm/v/rs-carousel.svg)](https://www.npmjs.com/package/rs-carousel)
[![Downloads](https://img.shields.io/npm/dt/rs-carousel.svg)](https://www.npmjs.com/package/rs-carousel)
# RS Carousel
Customizable basic fullpage carousel

## Features

- Easy extensible
- Written in ES6
- Progressive background image loading with blur (like medium.com)

## Example

[ES6 basic](https://redknife.github.io/rs-carousel/examples/es6_basic) - [demo](https://redknife.github.io/rs-carousel/examples/es6_basic/demo.html)

[ES6 horizontal](https://redknife.github.io/rs-carousel/examples/es6_horizontal) - [demo](https://redknife.github.io/rs-carousel/examples/es6_horizontal/demo.html)

[ES6 custom controls](https://redknife.github.io/rs-carousel/examples/es6_controls) - [demo](https://redknife.github.io/rs-carousel/examples/es6_controls/demo.html)

[Or see example dir](example/)

## Installation

```
npm install rs-carousel
```

## Dependencies

jQuery and Velocityjs

## Usage

```javascript
import { RSBaseCarousel } from 'rs-carousel';

const $container = $('.js-carousel');
const carousel = new RSBaseCarousel($container, opts);
```

#### Lazy loading background images
Use attributes for urls of images
```html
<div class="m-carousel__slide js-rs-carousel__slide">
    <div class="js-rs-carousel__slide__bg" data-image-small="img_small.jpg" data-image="img_large.jpg"></div>
    ...
</div>
```

## Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| slideSel | string | '.js-rs-carousel__slide' | Carousel elements selector |
| slideBgSel | string | '.js-rs-carousel__slide__bg' | Slide background selector |
| slideBgCanvasClass | string | 'bg-canvas' | Class for slide background canvas (used for blur small background image) |
| slideBgImgClass | string | 'bg-img' | Class for slide background element (used for full background image) |
| slideBgImgStyles | object | { backgroundPosition: 'center center', backgroundSize: 'cover' } | Css for background element |
| slideBgImgLoadingClass | string | 'bg-img-loading' | Class form slide background element while loading full image |
| slideBgImgLoadedClass | string | 'bg-img-loaded' | Class for slide background element when loaded full image |
| slideBgImgFadeDuration | number | 500 | Duration of animation backgrounds |
| blurRadius | number | 30 | Used for blur small background image |
| slideZIndex | number | 1000 | Carousel elements z-index |
| swipeThreshold | number | 30 | Minimal distance required before slides change |
| duration | number | 1000 | Animation duration |
| direction | number | 24 | Carousel direction *(see constants)* |
| easing | string | 'easeInOutCubic' | Animation easing *([see velocityjs easings](http://velocityjs.org/#easing))* |
| infinite | boolean | true | Infinite looping |

## Constants

```javascript
import { constants } from 'rs-carousel';

console.log(constants);
```

```javascript
{
    directions: {
        left: 2,
        right: 4,
        up: 8,
        down: 16,
        vertical: 24,
        horizontal: 6
    },
    animationsNames: {
        in: {
            "2": "carouselSlideLeftIn",
            "4": "carouselSlideRightIn",
            "8": "carouselSlideUpIn",
            "16": "carouselSlideDownIn"
        },
        out: {
            "2": "carouselSlideLeftOut",
            "4": "carouselSlideRightOut",
            "8": "carouselSlideUpOut",
            "16": "carouselSlideDownOut"
        }
    }
}
```


## Api

### Methods and props

Methods and props are called on carousel instances

```javascript
const carousel = new RSBaseCarousel($container, opts);

carousel.goTo(2); // Method
carousel.currentSlide; // Prop
```

| Method | Argument | Description |
| ------ | -------- | ----------- |
| goTo | index : number | Goes to slide by index |
| next | | Goes to next slide |
| prev | | Goes to next slide |
| addBeforeCb | fn : function | Add before slide change callback  |
| addAfterCb | fn : function | Add after slide change callback |
| lock | | Lock carousel |
| unlock | | Unlock carousel |

| Prop | Description |
| ---- | ----------- |
| currentSlide | Current slide |
| nextIndex | Next slide index |
| prevIndex | Prev slide index |
| $container | Constainer of carousel instance |
| settings | Carousel settings of current instance |


## Build (for developers)

```
npm run build
```


## License

Released under the MIT License. See the bundled `LICENSE` file for
details.
