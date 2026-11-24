/* Ali portfolio: code rain, typed roles, scroll reveal, tilt effects, copy buttons. */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---- code rain ---- */
  var c = document.getElementById('rain');
  var ctx = c.getContext('2d');
  var toks = ['0', '1', '{', '}', '</>', '=>', 'def', 'py', 'php', 'css', 'div', '()', '[]', '$', '::', 'if', 'for', ';', 'html', '&&', 'import', '<?', '?>', 'ret'];
  var COL = 26, FS = 15, w = 0, h = 0, drops = [], dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  var cols = ['rgba(39,232,255,0.6)', 'rgba(39,232,255,0.6)', 'rgba(39,232,255,0.6)', 'rgba(123,92,255,0.6)', 'rgba(255,61,240,0.55)'];
  function size() {
    w = window.innerWidth; h = window.innerHeight;
    c.width = Math.floor(w * dpr); c.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#04050c'; ctx.fillRect(0, 0, w, h);
    var n = Math.ceil(w / COL);
    drops = [];
    for (var i = 0; i < n; i++) drops.push({ y: Math.random() * -40, s: 0.22 + Math.random() * 0.55, c: cols[(Math.random() * cols.length) | 0] });
  }
  function step() {
    ctx.fillStyle = 'rgba(4,5,12,0.13)'; ctx.fillRect(0, 0, w, h);
    ctx.font = FS + 'px "JetBrains Mono", monospace';
    for (var i = 0; i < drops.length; i++) {
      var d = drops[i], x = i * COL, y = d.y * FS;
      var prev = toks[(Math.random() * toks.length) | 0];
      ctx.fillStyle = d.c; ctx.fillText(prev, x, y - FS);
      ctx.fillStyle = 'rgba(225,255,255,0.95)'; ctx.fillText(toks[(Math.random() * toks.length) | 0], x, y);
      d.y += d.s;
      if (y > h && Math.random() > 0.97) { d.y = Math.random() * -20; d.s = 0.22 + Math.random() * 0.55; }
    }
  }
  var last = 0, timer;
  function loop(t) { if (t - last > 48) { step(); last = t; } requestAnimationFrame(loop); }
  function start() {
    size();
    for (var i = 0; i < (reduce ? 160 : 70); i++) step();
    if (!reduce && !start.run) { start.run = true; requestAnimationFrame(loop); }
  }
  start();
  window.addEventListener('resize', function () { clearTimeout(timer); timer = setTimeout(start, 200); });

  /* ---- typed roles ---- */
  var roles = ['Website Developer', 'Python Developer', 'Digital Marketer', 'Social Media Manager'];
  var el = document.getElementById('typed');
  if (!reduce) {
    var ri = 0, ci = roles[0].length, del = true;
    function tick() {
      var wait = del ? 38 : 85;
      if (del) { ci--; if (ci <= 0) { del = false; ri = (ri + 1) % roles.length; ci = 0; wait = 260; } }
      else { ci++; if (ci >= roles[ri].length) { del = true; wait = 1900; } }
      el.textContent = roles[ri].slice(0, Math.max(ci, 0)) || '​';
      setTimeout(tick, wait);
    }
    setTimeout(tick, 2200);
  }

  /* ---- scroll progress, reveal ---- */
  var bar = document.getElementById('progress');
  function prog() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(window.scrollY / max, 1) : 0) + ')';
  }
  window.addEventListener('scroll', prog, { passive: true }); prog();

  var items = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.remove('pre'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    items.forEach(function (n) {
      if (n.getBoundingClientRect().top > window.innerHeight * 0.9) { n.classList.add('pre'); io.observe(n); }
    });
  }

  /* ---- pointer effects (desktop only) ---- */
  if (fine && !reduce) {
    var glow = document.getElementById('glow');
    window.addEventListener('pointermove', function (e) {
      glow.style.opacity = 1; glow.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)';
    }, { passive: true });
    var wrap = document.getElementById('tilt'), por = document.getElementById('portrait');
    wrap.addEventListener('pointermove', function (e) {
      var r = wrap.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      por.style.setProperty('--ry', (x * 14) + 'deg'); por.style.setProperty('--rx', (-y * 14) + 'deg');
    });
    wrap.addEventListener('pointerleave', function () { por.style.setProperty('--ry', '0deg'); por.style.setProperty('--rx', '0deg'); });
    Array.prototype.forEach.call(document.querySelectorAll('.card'), function (card) {
      var inner = card.firstElementChild;
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        inner.style.setProperty('--ry', ((x - 0.5) * 10) + 'deg'); inner.style.setProperty('--rx', ((0.5 - y) * 8) + 'deg');
        inner.style.setProperty('--gx', (x * 100) + '%'); inner.style.setProperty('--gy', (y * 100) + '%');
      });
      card.addEventListener('pointerleave', function () { inner.style.setProperty('--ry', '0deg'); inner.style.setProperty('--rx', '0deg'); });
    });
  }

  /* ---- copy buttons ---- */
  var toast = document.getElementById('toast'), tt;
  function say(msg) { toast.textContent = msg; toast.classList.add('show'); clearTimeout(tt); tt = setTimeout(function () { toast.classList.remove('show'); }, 2000); }
  function selectText(node) {
    var r = document.createRange(); r.selectNodeContents(node);
    var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
  }
  Array.prototype.forEach.call(document.querySelectorAll('[data-copy]'), function (b) {
    b.addEventListener('click', function () {
      var node = document.getElementById(b.getAttribute('data-copy')), text = node.textContent;
      var fallback = function () { selectText(node); say('Selected. Press Ctrl+C or Cmd+C to copy'); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { say('Copied ' + text); }, fallback);
      } else { fallback(); }
    });
  });
})();
