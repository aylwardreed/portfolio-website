(function () {
  'use strict';

  document.documentElement.classList.remove('no-js');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Slideshows: crossfade, optional shuffle, autoplay that pauses on hover
  // and while off screen.
  function initSlideshow(el) {
    var track = el.querySelector('.slideshow__track');
    var slides = Array.prototype.slice.call(track.children);

    if (el.hasAttribute('data-shuffle')) {
      for (var i = slides.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = slides[i];
        slides[i] = slides[j];
        slides[j] = tmp;
      }
      slides.forEach(function (s) { track.appendChild(s); });
    }

    var index = 0;
    var timer = null;
    var hovering = false;
    var visible = false;
    var delay = Math.max(parseFloat(el.getAttribute('data-delay')) || 3, 1) * 1000;

    function show(n) {
      slides[index].classList.remove('is-active');
      index = (n + slides.length) % slides.length;
      slides[index].classList.add('is-active');
      var img = slides[(index + 1) % slides.length].querySelector('img');
      if (img) img.loading = 'eager';
    }

    function schedule() {
      clearTimeout(timer);
      if (slides.length < 2 || hovering || !visible || reduceMotion) return;
      timer = setTimeout(function () { show(index + 1); schedule(); }, delay);
    }

    slides[0].classList.add('is-active');

    var prev = el.querySelector('.slideshow__prev');
    var next = el.querySelector('.slideshow__next');
    if (slides.length < 2) {
      prev.hidden = true;
      next.hidden = true;
    }
    prev.addEventListener('click', function () { show(index - 1); schedule(); });
    next.addEventListener('click', function () { show(index + 1); schedule(); });

    if (el.hasAttribute('data-pause-on-hover')) {
      el.addEventListener('mouseenter', function () { hovering = true; schedule(); });
      el.addEventListener('mouseleave', function () { hovering = false; schedule(); });
    }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        schedule();
      }).observe(el);
    } else {
      visible = true;
      schedule();
    }
  }

  Array.prototype.forEach.call(document.querySelectorAll('.slideshow'), initSlideshow);

  // Lightbox for zoomable images, stepping through every zoomable image on
  // the page (each slideshow image once).
  var links = [];
  var seen = {};
  Array.prototype.forEach.call(document.querySelectorAll('a[data-zoom]'), function (a) {
    var href = a.getAttribute('href');
    if (!seen[href]) {
      seen[href] = true;
      links.push(a);
    }
  });
  if (!links.length) return;

  var box = document.createElement('div');
  box.className = 'lightbox';
  box.hidden = true;
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', 'Image viewer');
  box.innerHTML =
    '<img alt="">' +
    '<button class="slideshow__prev" type="button" aria-label="Previous image"></button>' +
    '<button class="slideshow__next" type="button" aria-label="Next image"></button>';
  document.body.appendChild(box);

  var boxImg = box.querySelector('img');
  var current = 0;
  var opener = null;

  function open(n) {
    current = (n + links.length) % links.length;
    var img = links[current].querySelector('img');
    boxImg.src = links[current].getAttribute('href');
    boxImg.alt = img ? img.alt : '';
    box.hidden = false;
    document.documentElement.style.overflow = 'hidden';
  }

  function close() {
    box.hidden = true;
    boxImg.removeAttribute('src');
    document.documentElement.style.overflow = '';
    if (opener) opener.focus();
  }

  links.forEach(function (a, i) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      opener = a;
      open(i);
      box.querySelector('.slideshow__next').focus();
    });
  });
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[data-zoom]');
    if (a && links.indexOf(a) === -1) {
      e.preventDefault();
      opener = a;
      open(links.findIndex(function (l) { return l.getAttribute('href') === a.getAttribute('href'); }));
    }
  });

  if (links.length < 2) {
    box.querySelector('.slideshow__prev').hidden = true;
    box.querySelector('.slideshow__next').hidden = true;
  }

  box.addEventListener('click', function (e) {
    if (e.target.classList.contains('slideshow__prev')) open(current - 1);
    else if (e.target.classList.contains('slideshow__next')) open(current + 1);
    else close();
  });

  document.addEventListener('keydown', function (e) {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') open(current - 1);
    else if (e.key === 'ArrowRight') open(current + 1);
  });
})();
