/* Ali portfolio: network background, typed roles, scroll reveal, tilt effects, copy buttons. */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---- network background: drifting nodes, glowing links, travelling signal pulses ---- */
  var net = document.getElementById('net'), nctx = net.getContext('2d');
  var nw = 0, nh = 0, ndpr = Math.min(window.devicePixelRatio || 1, 1.5), LINK = 150;
  var nodes = [], pulses = [], mouse = { x: -999, y: -999 }, NCOL = ['39,232,255', '123,92,255', '255,61,240'], ntimer;
  function nsize() {
    nw = window.innerWidth; nh = window.innerHeight;
    net.width = Math.floor(nw * ndpr); net.height = Math.floor(nh * ndpr);
    nctx.setTransform(ndpr, 0, 0, ndpr, 0, 0);
    LINK = nw < 600 ? 120 : 170;
    var n = Math.max(40, Math.min(110, Math.round(nw * nh / 12000)));
    nodes = []; pulses = [];
    for (var i = 0; i < n; i++) nodes.push({ x: Math.random() * nw, y: Math.random() * nh, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4, r: 1.2 + Math.random() * 1.8, c: NCOL[i % 3], p: Math.random() * 6 });
  }
  function spawnPulse() {
    if (pulses.length > 7) return;
    var a = nodes[(Math.random() * nodes.length) | 0], near = [];
    for (var i = 0; i < nodes.length; i++) {
      var b = nodes[i]; if (b === a) continue;
      var dx = a.x - b.x, dy = a.y - b.y;
      if (dx * dx + dy * dy < LINK * LINK) near.push(b);
    }
    if (near.length) pulses.push({ a: a, b: near[(Math.random() * near.length) | 0], t: 0, s: 0.012 + Math.random() * 0.014 });
  }
  function nframe(move, ts) {
    nctx.clearRect(0, 0, nw, nh);
    var i, j, a, b, dx, dy, d, al, L2 = LINK * LINK;
    for (i = 0; i < nodes.length; i++) {
      a = nodes[i];
      if (!move) continue;
      a.x += a.vx; a.y += a.vy;
      if (a.x < -20) a.x = nw + 20; else if (a.x > nw + 20) a.x = -20;
      if (a.y < -20) a.y = nh + 20; else if (a.y > nh + 20) a.y = -20;
      dx = a.x - mouse.x; dy = a.y - mouse.y; d = Math.sqrt(dx * dx + dy * dy);
      if (d < 150 && d > 0.1) { a.x += dx / d * (150 - d) * 0.025; a.y += dy / d * (150 - d) * 0.025; }
    }
    nctx.lineWidth = 0.8;
    for (i = 0; i < nodes.length; i++) {
      a = nodes[i];
      for (j = i + 1; j < nodes.length; j++) {
        b = nodes[j]; dx = a.x - b.x; dy = a.y - b.y;
        var d2 = dx * dx + dy * dy;
        if (d2 < L2) {
          al = (1 - Math.sqrt(d2) / LINK) * 0.55;
          nctx.strokeStyle = 'rgba(' + a.c + ',' + al.toFixed(3) + ')';
          nctx.beginPath(); nctx.moveTo(a.x, a.y); nctx.lineTo(b.x, b.y); nctx.stroke();
        }
      }
      dx = a.x - mouse.x; dy = a.y - mouse.y; d = Math.sqrt(dx * dx + dy * dy);
      if (d < 190) {
        nctx.strokeStyle = 'rgba(180,250,255,' + ((1 - d / 190) * 0.7).toFixed(3) + ')';
        nctx.beginPath(); nctx.moveTo(a.x, a.y); nctx.lineTo(mouse.x, mouse.y); nctx.stroke();
      }
    }
    var t = (ts || 0) / 1000;
    for (i = 0; i < nodes.length; i++) {
      a = nodes[i]; var rr = a.r * (1 + 0.3 * Math.sin(t * 1.6 + a.p));
      nctx.fillStyle = 'rgba(' + a.c + ',0.2)'; nctx.beginPath(); nctx.arc(a.x, a.y, rr * 5, 0, 6.2832); nctx.fill();
      nctx.fillStyle = 'rgba(' + a.c + ',0.95)'; nctx.beginPath(); nctx.arc(a.x, a.y, rr, 0, 6.2832); nctx.fill();
    }
    if (move) {
      if (Math.random() < 0.07) spawnPulse();
      for (i = pulses.length - 1; i >= 0; i--) {
        var p = pulses[i]; p.t += p.s;
        dx = p.a.x - p.b.x; dy = p.a.y - p.b.y;
        if (p.t >= 1 || dx * dx + dy * dy > L2 * 1.5) { pulses.splice(i, 1); continue; }
        var px = p.a.x + (p.b.x - p.a.x) * p.t, py = p.a.y + (p.b.y - p.a.y) * p.t;
        nctx.fillStyle = 'rgba(' + p.a.c + ',0.22)'; nctx.beginPath(); nctx.arc(px, py, 9, 0, 6.2832); nctx.fill();
        nctx.fillStyle = 'rgba(255,255,255,0.95)'; nctx.beginPath(); nctx.arc(px, py, 2.4, 0, 6.2832); nctx.fill();
      }
    }
  }
  function nloop(ts) { nframe(true, ts); requestAnimationFrame(nloop); }
  nsize();
  if (reduce) { nframe(false, 0); } else { requestAnimationFrame(nloop); }
  window.addEventListener('resize', function () { clearTimeout(ntimer); ntimer = setTimeout(function () { nsize(); if (reduce) nframe(false, 0); }, 200); });
  window.addEventListener('pointermove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  window.addEventListener('pointerup', function (e) { if (e.pointerType !== 'mouse') { mouse.x = -999; mouse.y = -999; } });
  document.documentElement.addEventListener('pointerleave', function () { mouse.x = -999; mouse.y = -999; });

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
  /* ---- contact form ---- */
  (function () {
    var form = document.getElementById('cform');
    if (!form) return;
    var ENDPOINT = 'https://formsubmit.co/ajax/headshotboy619@gmail.com';
    var WA_NUMBER = '923284874485';
    var fName = document.getElementById('f-name'), fMail = document.getElementById('f-mail'), fMsg = document.getElementById('f-msg');
    var send = document.getElementById('send'), wa = document.getElementById('wa'), stat = document.getElementById('fstatus');
    var sent = document.getElementById('sent'), again = document.getElementById('again'), burst = document.getElementById('burst');
    var cnt = document.getElementById('cnt'), hp = form.querySelector('.hp');
    var rules = [
      [fName, 'e-name', function (v) { return v.trim().length >= 2 ? '' : 'Please enter your name.'; }],
      [fMail, 'e-mail', function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Enter a valid email address.'; }],
      [fMsg, 'e-msg', function (v) { return v.trim().length >= 10 ? '' : 'Write at least 10 characters.'; }]
    ];
    function setErr(r, msg) {
      var field = r[0].closest('.field');
      document.getElementById(r[1]).textContent = msg;
      r[0].setAttribute('aria-invalid', msg ? 'true' : 'false');
      field.classList.remove('bad');
      if (msg) { void field.offsetWidth; field.classList.add('bad'); }
    }
    function check(r) { var m = r[2](r[0].value); setErr(r, m); return !m; }
    rules.forEach(function (r) {
      r[0].addEventListener('input', function () { if (r[0].closest('.field').classList.contains('bad')) check(r); });
      r[0].addEventListener('blur', function () { if (r[0].value) check(r); });
    });
    fMsg.addEventListener('input', function () { cnt.textContent = fMsg.value.length + ' / 1000'; });
    function topic() { var t = form.querySelector('input[name="topic"]:checked'); return t ? t.value : ''; }
    function status(msg, isErr) { stat.textContent = msg; stat.className = 'f-status' + (isErr ? ' error' : ''); }
    function makeBurst() {
      burst.innerHTML = '';
      var cols = ['#27e8ff', '#7b5cff', '#ff3df0', '#3dffb0'];
      for (var i = 0; i < 26; i++) {
        var a = (i / 26) * Math.PI * 2 + Math.random() * 0.4, d = 90 + Math.random() * 90, p = document.createElement('i');
        p.style.setProperty('--dx', (Math.cos(a) * d).toFixed(1) + 'px');
        p.style.setProperty('--dy', (Math.sin(a) * d).toFixed(1) + 'px');
        p.style.setProperty('--c', cols[i % 4]);
        p.style.animationDelay = (Math.random() * 0.12).toFixed(2) + 's';
        burst.appendChild(p);
      }
    }
    function showSent() {
      makeBurst(); sent.classList.add('show'); sent.setAttribute('aria-hidden', 'false');
      try { again.focus({ preventScroll: true }); } catch (e) {}
    }
    function reset() {
      form.reset(); cnt.textContent = '0 / 1000';
      rules.forEach(function (r) { setErr(r, ''); });
      status(''); wa.classList.remove('nudge');
      sent.classList.remove('show'); sent.setAttribute('aria-hidden', 'true');
      try { fName.focus({ preventScroll: true }); } catch (e) {}
    }
    again.addEventListener('click', reset);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstBad = null;
      rules.forEach(function (r) { if (!check(r) && !firstBad) firstBad = r[0]; });
      if (firstBad) { firstBad.focus(); status('Please fix the highlighted fields.', true); return; }
      status('');
      if (hp && hp.value) { showSent(); return; }
      var payload = {
        name: fName.value.trim(), email: fMail.value.trim(), topic: topic() || 'Not chosen', message: fMsg.value.trim(),
        _subject: 'New portfolio message from ' + fName.value.trim(), _template: 'table', _captcha: 'false'
      };
      var lbl = send.querySelector('.lbl');
      send.disabled = true; send.classList.add('is-sending'); lbl.textContent = 'Sending...';
      var ctl = window.AbortController ? new AbortController() : null;
      var timer = setTimeout(function () { if (ctl) ctl.abort(); }, 15000);
      fetch(ENDPOINT, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload), signal: ctl ? ctl.signal : undefined
      })
        .then(function (res) {
          return res.json().catch(function () { return {}; }).then(function (data) {
            if (!res.ok || data.success === false || data.success === 'false') throw new Error('send failed');
          });
        })
        .then(function () { showSent(); })
        .catch(function () {
          status('The message could not be sent. Please use the WhatsApp button or email me directly.', true);
          wa.classList.remove('nudge'); void wa.offsetWidth; wa.classList.add('nudge');
        })
        .then(function () { clearTimeout(timer); send.disabled = false; send.classList.remove('is-sending'); lbl.textContent = 'Send message'; });
    });

    wa.addEventListener('click', function () {
      var n = fName.value.trim(), m = fMsg.value.trim(), t = topic(), em = fMail.value.trim();
      var text = 'Hi Ali, ' + (n ? "I'm " + n + '. ' : '') + (t ? 'I need help with: ' + t + '.\n' : '') + (m ? m + '\n' : '') + (em ? 'My email: ' + em : '');
      window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text.trim()), '_blank', 'noopener');
    });

    if (fine && !reduce) {
      var wrapEl = document.getElementById('fwrap');
      wrapEl.addEventListener('pointermove', function (e) {
        var r = wrapEl.getBoundingClientRect();
        form.style.setProperty('--fx', (e.clientX - r.left) + 'px'); form.style.setProperty('--fy', (e.clientY - r.top) + 'px');
      });
    }
  })();
})();
