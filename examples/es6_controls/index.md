---
layout: default
title: {{ site.name }}
---

## Custom controls

[Demo](demo.html)

```javascript
import $ from 'jquery';
import 'velocity-animate';
import 'velocity-animate/velocity.ui.min';
import { RSBaseCarousel } from 'rs-carousel/lib/rs-carousel';

$(() => {
  const $prevBtn = $('.js-rs-carousel_prev');
  const $nextBtn = $('.js-rs-carousel_next');
  const $element = $('.js-rs-carousel');

  const carousel = new RSBaseCarousel($element);

  $prevBtn.on('click', (e) => {
    e.preventDefault();

    carousel.prev();
  });

  $nextBtn.on('click', (e) => {
    e.preventDefault();

    carousel.next();
  });
});
```
