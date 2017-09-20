import * as actions from './actions';

// offset for readability
let offset = 25;

export let scrollToResult = result => {
  let resultBottom = result.getBoundingClientRect().bottom + offset;
  let diff = resultBottom - window.innerHeight;

  if (diff > 0) {
    $('html, body').animate({
      scrollTop: $(window).scrollTop() + diff
    }, 200);
  }
};
