# RS Carousel
Customizable basic fullpage carousel


## Example
[See example dir](example/)


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

## Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| slideSel | string | '.js-rs-carousel__slide' | Carousel elements selector |
| duration | number | 1000 | Animation duration |
| direction | number | 24 | Carousel direction *(see constants)* |
| easing | string | 'easeInOutCubic' | Animation easing *([see velocityjs easings](http://velocityjs.org/#easing))* |
| infinite | boolean | true | Infinite looping |
| zIndex | number | 1000 | Carousel elements z-index |

## Constants

```javascript
import { constants } from 'rs-carousel';

console.log(constants);
```

## Build (for developers)

```
npm run build
```


## License

Released under the MIT License. See the bundled `LICENSE` file for
details.
