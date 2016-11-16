import $ from 'jquery';
import 'velocity-animate';
import 'velocity-animate/velocity.ui.min';
import { RSBaseCarousel, constants } from 'rs-carousel/lib/rs-carousel.min';

const { animationsNames, directions } = constants;

class FadeCarousel extends RSBaseCarousel {
  registerAnimations() {
    const easing = this.settings.easing;
    const fadeOutParams = [
      [{ opacity: [0, 1], translateZ: 0 }, 1, { easing }],
    ];
    const fadeInParams = [
      [{ opacity: [1, 0], translateZ: 0 }, 1, { easing }],
    ];

    Object.keys(constants.directions).forEach((key) => {
      const dir = directions[key];
      const animInName = animationsNames.in[dir];
      const animOutName = animationsNames.out[dir];

      this.registerAnimation(animInName, fadeInParams);
      this.registerAnimation(animOutName, fadeOutParams);
    });
  }
}

$(() => {
  const $element = $('.js-rs-carousel');
  const carousel = new FadeCarousel($element, {
    duration: 1250,
    easing: 'ease',
  });
  console.log(carousel);
});
