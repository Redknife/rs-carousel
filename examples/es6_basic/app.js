import $ from 'jquery';
import 'velocity-animate';
import 'velocity-animate/velocity.ui.min';
import { RSBaseCarousel } from 'rs-carousel/lib/rs-carousel.min';

$(() => {
  const $element = $('.js-rs-carousel');
  const carousel = new RSBaseCarousel($element);
  console.log(carousel);
});
