import $ from 'jquery';
import 'velocity-animate';
import 'velocity-animate/velocity.ui.min';
import { RSBaseCarousel, constants } from 'rs-carousel/lib/rs-carousel.min';

$(() => {
  const $element = $('.js-rs-carousel');
  const carousel = new RSBaseCarousel($element, {
    direction: constants.directions.horizontal,
  });
  console.log(carousel);
});
