/* =========================================================
   Portafolio · Christian Ayala
   Tema, menú activo, filtros, animaciones, contacto y avisos
   ========================================================= */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.add('js');

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  /* ---------- Avisos con opción de deshacer ---------- */
  var toastEl = $('#toast');
  var toastMsg = $('#toastMsg');
  var toastAct = $('#toastAct');
  var toastTimer = null;

  function hideToast() {
    toastEl.classList.remove('show');
  }

  function toast(message, undoLabel, onUndo) {
    toastMsg.textContent = message;
    toastAct.hidden = !undoLabel;
    toastAct.textContent = undoLabel || '';
    toastAct.onclick = function () {
      if (onUndo) onUndo();
      hideToast();
    };
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, undoLabel ? 7000 : 3500);
  }

  $('#toastX').addEventListener('click', hideToast);

  /* ---------- Tema claro / oscuro ---------- */
  var themeBtn = $('#themeBtn');
  var themeLabel = $('.theme-label', themeBtn);

  function setTheme(theme, save) {
    root.setAttribute('data-theme', theme);
    var dark = theme === 'dark';
    themeBtn.setAttribute('aria-pressed', String(dark));
    themeLabel.textContent = dark ? 'Modo claro' : 'Modo oscuro';
    if (save) {
      try { localStorage.setItem('cv-theme', theme); } catch (e) { /* sin almacenamiento */ }
    }
  }

  var savedTheme = null;
  try { savedTheme = localStorage.getItem('cv-theme'); } catch (e) { /* ignorar */ }
  var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(savedTheme || (systemDark ? 'dark' : 'light'), false);

  themeBtn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(next, true);
    toast(next === 'dark' ? 'Modo oscuro activado' : 'Modo claro activado');
  });

  /* ---------- Animación de entrada ---------- */
  var revealEls = $$('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Menú activo y barra de progreso ---------- */
  var navLinks = $$('.nav a');
  var sections = $$('main section[id]');
  var progress = $('#progress');
  var ticking = false;

  function updateOnScroll() {
    ticking = false;
    var max = (document.documentElement.scrollHeight - window.innerHeight) || 1;
    progress.style.width = Math.min(100, (window.scrollY / max) * 100) + '%';

    var current = null;
    sections.forEach(function (sec) {
      if (sec.getBoundingClientRect().top < window.innerHeight * 0.4) current = sec;
    });
    navLinks.forEach(function (a) {
      var active = !!current && a.getAttribute('href') === '#' + current.id;
      a.setAttribute('aria-current', String(active));
    });
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updateOnScroll);
    }
  }, { passive: true });
  updateOnScroll();

  /* ---------- Filtro de experiencia ---------- */
  var chips = $$('.filters .chip');
  var entries = $$('.entry');
  var jobs = $('#jobs');
  var empty = $('#empty');
  var status = $('#status');
  var currentCat = 'all';

  function applyFilter() {
    var shown = 0;
    entries.forEach(function (entry) {
      var match = currentCat === 'all' || entry.getAttribute('data-cat') === currentCat;
      entry.hidden = !match;
      if (match) shown++;
    });
    jobs.hidden = shown === 0;
    empty.hidden = shown > 0;
    status.textContent = 'Mostrando ' + shown + ' de ' + entries.length + ' experiencias.';
  }

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      currentCat = chip.getAttribute('data-cat');
      chips.forEach(function (c) {
        c.setAttribute('aria-pressed', String(c === chip));
      });
      applyFilter();
    });
  });

  $('#clear').addEventListener('click', function () { chips[0].click(); });
  applyFilter();

  /* ---------- Contacto con mensaje prellenado ---------- */
  var WA_NUMBER = '593995593657';
  var MAIL = 'christianayala2828@hotmail.com';
  var MIN = 10;
  var MAX = 600;

  var TOPICS = {
    job: 'Hola Christian, vi tu portafolio y me interesa tu perfil para una oportunidad laboral. Me gustaría conversar sobre tu experiencia en bases de datos y soporte técnico. ¿Tienes disponibilidad?',
    intern: 'Hola Christian, conocí tu portafolio y me gustaría conversar sobre una posible práctica o pasantía. Me interesa tu trabajo en redes, bases de datos y desarrollo de software. ¿Podríamos hablar?',
    collab: 'Hola Christian, me gustó tu portafolio y tengo una idea de proyecto en la que podrías aportar. ¿Te interesaría conversar al respecto?',
    other: 'Hola Christian, vi tu portafolio y me gustaría conversar contigo. ¿Tienes un momento?'
  };

  var SUBJECTS = {
    job: 'Oportunidad laboral',
    intern: 'Práctica o pasantía',
    collab: 'Colaboración en un proyecto',
    other: 'Contacto desde tu portafolio'
  };

  var msg = $('#msg');
  var sender = $('#sender');
  var err = $('#err');
  var count = $('#count');
  var goBtn = $('#go');

  var way = 'wa';
  var topic = 'job';

  function composed() {
    var body = msg.value.trim();
    var name = sender.value.trim();
    return name ? body + '\n\n— ' + name : body;
  }

  function refreshCount() {
    count.textContent = msg.value.length + ' / ' + MAX;
  }

  function setText(text) {
    msg.value = text;
    msg.removeAttribute('aria-invalid');
    err.textContent = '';
    refreshCount();
  }

  function isValid() {
    if (msg.value.trim().length < MIN) {
      msg.setAttribute('aria-invalid', 'true');
      err.textContent = 'Escribe al menos ' + MIN + ' caracteres para que el mensaje se entienda.';
      msg.focus();
      return false;
    }
    return true;
  }

  function send() {
    if (!isValid()) return;
    if (way === 'wa') {
      window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(composed()), '_blank', 'noopener');
      toast('Abriendo WhatsApp con tu mensaje');
    } else {
      window.location.href = 'mailto:' + MAIL +
        '?subject=' + encodeURIComponent(SUBJECTS[topic]) +
        '&body=' + encodeURIComponent(composed());
      toast('Abriendo tu programa de correo');
    }
  }

  setText(TOPICS.job);

  $$('[data-way]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      way = btn.getAttribute('data-way');
      $$('[data-way]').forEach(function (b) {
        b.setAttribute('aria-pressed', String(b === btn));
      });
      goBtn.textContent = way === 'wa' ? 'Abrir WhatsApp' : 'Abrir correo';
    });
  });

  $$('[data-topic]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var previous = msg.value;
      topic = btn.getAttribute('data-topic');
      $$('[data-topic]').forEach(function (b) {
        b.setAttribute('aria-pressed', String(b === btn));
      });
      setText(TOPICS[topic]);
      toast('Mensaje cambiado: ' + btn.textContent.toLowerCase(), 'Deshacer', function () {
        setText(previous);
      });
    });
  });

  msg.addEventListener('input', function () {
    refreshCount();
    if (msg.getAttribute('aria-invalid') === 'true' && msg.value.trim().length >= MIN) {
      msg.removeAttribute('aria-invalid');
      err.textContent = '';
    }
  });

  msg.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      send();
    }
  });

  goBtn.addEventListener('click', send);

  $('#copy').addEventListener('click', function () {
    if (!isValid()) return;
    var text = composed();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        function () { toast('Mensaje copiado. Puedes pegarlo donde quieras.'); },
        function () { toast('No pude copiarlo. Selecciona el texto y usa Ctrl + C.'); }
      );
    } else {
      toast('Tu navegador no permite copiar. Selecciona el texto y usa Ctrl + C.');
    }
  });

  $('#reset').addEventListener('click', function () {
    var previous = msg.value;
    var original = TOPICS[topic];
    if (previous === original) {
      toast('El texto ya es el original.');
      return;
    }
    setText(original);
    toast('Texto restablecido.', 'Deshacer', function () {
      setText(previous);
    });
  });

  /* ---------- Atajos de teclado ---------- */
  var sectionIds = ['experiencia', 'habilidades', 'formacion', 'contacto'];

  document.addEventListener('keydown', function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    var tag = document.activeElement ? document.activeElement.tagName : '';
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(tag)) return;

    if (e.key >= '1' && e.key <= '4') {
      var target = document.getElementById(sectionIds[Number(e.key) - 1]);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView();
      var heading = target.querySelector('h2');
      if (heading) {
        heading.setAttribute('tabindex', '-1');
        heading.focus({ preventScroll: true });
      }
    } else if (e.key === '/') {
      e.preventDefault();
      document.getElementById('experiencia').scrollIntoView();
      chips[0].focus({ preventScroll: true });
    } else if (e.key === 't' || e.key === 'T') {
      themeBtn.click();
    }
  });
})();
