/* GROVA: gentle scroll and hover motion. Everything degrades to a normal static page. */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Elements that softly rise into view, staggered within their group
  var groups = [
    '.hero-grid > div:first-child > *',
    '.section-head > *',
    '.leaks .leak',
    '.steps .step',
    '.cards .card',
    '.split > div:first-child > *',
    '.rooms .room',
    '.band-img',
    '.book-img',
    '.reviews .marquee',
    '.faq details',
    '.cta .wrap > *',
    '.book-grid > div > *',
    '.book-grid .form-card',
    '.cover-list li'
  ];

  var targets = [];
  groups.forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el, i) {
      if (el.classList.contains('reveal')) return;
      el.classList.add('reveal');
      el.style.setProperty('--d', Math.min(i, 5) * 90 + 'ms');
      el.addEventListener('transitionend', function (e) {
        if (e.propertyName === 'opacity') el.classList.add('done');
      });
      targets.push(el);
    });
  });

  if (reduce || !('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('in', 'done'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(function (el) { io.observe(el); });
  }

  // Images drift very slightly against the scroll
  if (!reduce) {
    var imgs = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
    var ticking = false;
    var update = function () {
      var vh = window.innerHeight;
      imgs.forEach(function (img) {
        var r = img.parentElement.getBoundingClientRect();
        if (r.bottom < -80 || r.top > vh + 80) return;
        var delta = (r.top + r.height / 2) - vh / 2;
        var py = Math.max(-22, Math.min(22, -delta * 0.07));
        img.style.setProperty('--py', py.toFixed(1) + 'px');
      });
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }
})();
