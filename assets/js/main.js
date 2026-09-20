/* =========================================================
   زاجل إكسبرس — سكربت الموقع
   لا يعتمد على أي مكتبة خارجية
   ========================================================= */
(function () {
  'use strict';

  /* ---- معلومات التواصل: بدّلها من هنا (وكذلك في صفحات HTML) ---- */
  var SITE = {
    whatsapp: '9647700000000',            // رقم واتساب بصيغة دولية بدون +
    email: 'info@zajel-express.com'
  };

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- 1. الهيدر عند التمرير ---------- */
  var header = $('.header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- 2. قائمة الموبايل ---------- */
  var burger = $('.burger');
  var drawer = $('.drawer');
  if (burger && drawer) {
    var setMenu = function (open) {
      drawer.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
      document.body.style.overflow = open ? 'hidden' : '';
      if (open) { var f = drawer.querySelector('a, button'); if (f) f.focus(); }
    };
    burger.addEventListener('click', function () {
      setMenu(!drawer.classList.contains('is-open'));
    });
    $$('.drawer__close, .drawer a', drawer).forEach(function (el) {
      el.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) { setMenu(false); burger.focus(); }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 900 && drawer.classList.contains('is-open')) setMenu(false);
    });
  }

  /* ---------- 3. الأسئلة الشائعة (أكورديون) ---------- */
  $$('.faq__q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq__item');
      var open = item.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  /* ---------- 4. ظهور العناصر عند التمرير ---------- */
  var reveals = $$('.reveal');
  if (reveals.length) {
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      reveals.forEach(function (el) { io.observe(el); });
    } else {
      reveals.forEach(function (el) { el.classList.add('is-in'); });
    }
  }

  /* ---------- 5. عدّادات الأرقام ---------- */
  var counters = $$('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    var fmt = function (n) { return n.toLocaleString('ar-IQ'); };
    var run = function (el) {
      var target = parseFloat(el.dataset.count);
      var suffix = el.dataset.suffix || '';
      var prefix = el.dataset.prefix || '';
      var dur = 1400, t0 = performance.now();
      var tick = function (t) {
        var p = Math.min((t - t0) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + fmt(Math.round(target * eased)) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { run(en.target); co.unobserve(en.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { co.observe(el); });
  }

  /* ---------- 6. نموذج التواصل → واتساب ---------- */
  var form = $('#contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = function (n) { var el = form.elements[n]; return el ? el.value.trim() : ''; };
      var lines = [
        'السلام عليكم، وصلتكم رسالة جديدة من موقع زاجل إكسبرس:',
        '',
        'الاسم: ' + v('name'),
        'رقم الهاتف: ' + v('phone'),
        'المحافظة: ' + v('city'),
        'الموضوع: ' + v('subject'),
        '',
        'الرسالة:',
        v('message')
      ];
      var text = encodeURIComponent(lines.join('\n'));
      var status = $('#formStatus');
      if (status) {
        status.hidden = false;
        status.textContent = 'تمام! راح تفتح نافذة واتساب برسالتك جاهزة… إذا ما انفتحت، تواصل معنا مباشرة على الرقم أعلاه.';
      }
      window.open('https://wa.me/' + SITE.whatsapp + '?text=' + text, '_blank', 'noopener');
    });

    var mailBtn = $('#mailFallback');
    if (mailBtn) {
      mailBtn.addEventListener('click', function () {
        var v = function (n) { var el = form.elements[n]; return el ? el.value.trim() : ''; };
        var body = encodeURIComponent(
          'الاسم: ' + v('name') + '\nالهاتف: ' + v('phone') + '\nالمحافظة: ' + v('city') +
          '\n\n' + v('message')
        );
        var subject = encodeURIComponent(v('subject') || 'استفسار من موقع زاجل إكسبرس');
        window.location.href = 'mailto:' + SITE.email + '?subject=' + subject + '&body=' + body;
      });
    }
  }

  /* ---------- 7. سنة الفوتر ---------- */
  $$('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
