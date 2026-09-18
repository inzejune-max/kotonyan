(function () {
  // Русская страница: если браузер не русский и язык не выбран явно, уводим на английскую версию.
  var isRu = document.documentElement.lang === 'ru';
  var chosen = null;
  try { chosen = sessionStorage.getItem('lang'); } catch (e) {}
  if (isRu && location.hash !== '#ru' && !chosen) {
    var navLang = (navigator.language || '').toLowerCase();
    if (navLang.indexOf('ru') !== 0) {
      location.replace('en/');
      return;
    }
  }

  document.querySelectorAll('.lang a').forEach(function (a) {
    a.addEventListener('click', function () {
      try { sessionStorage.setItem('lang', a.getAttribute('data-lang')); } catch (e) {}
    });
  });

  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      nav.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });
})();
