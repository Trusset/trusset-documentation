/*
 * Fire characters behind every page, ported from the /lenders hero on
 * trusset.org. Mintlify loads every .js file in the docs root on every page,
 * so this runs once per visit and survives client-side navigation.
 *
 * The band is position: fixed under the navbar and beside the sidebar, so it
 * stays in place while the page scrolls over it. It draws at 16 frames a
 * second, pauses while the tab is hidden, draws one still frame when the
 * reader prefers reduced motion, and batches characters by colour so a frame
 * sets at most a few dozen fill styles.
 */
(function () {
  if (typeof window === 'undefined' || window.__trussetFire) return;
  window.__trussetFire = true;

  var GRAD_X = [1, -1, 1, -1, 1, -1, 0, 0];
  var GRAD_Y = [1, 1, -1, -1, 0, 0, 1, -1];
  var CHARACTERS = '0123456789abcdef{}[]:<>';
  var SPEED = 0.6;
  var SCALE = 0.09;
  var DRIFT = 0.5;
  var SWAP_RATE = 0.018;
  var FPS = 16;
  var MAX_BRIGHTNESS = 0.55;
  var VERTICAL_BIAS = 0.65;
  var FONT_SIZE = 11;
  var LINE_HEIGHT = 14;
  var CHAR_WIDTH = FONT_SIZE * 0.6;
  var THRESHOLD = MAX_BRIGHTNESS * 0.3;
  var EDGE = 0.5;
  var EDGE_SWING = 0.13;
  var FADE = 0.3;
  var LEVELS = 24;
  var PALETTES = {
    light: [[200, 200, 200], [180, 180, 180], [150, 150, 150]],
    dark: [[50, 52, 51], [66, 68, 67], [92, 94, 93]],
  };

  var perm = new Uint8Array(512);
  for (var p = 0; p < 256; p++) perm[p] = p;
  for (var s = 255; s > 0; s--) {
    var r = Math.floor(Math.random() * (s + 1));
    var swap = perm[s];
    perm[s] = perm[r];
    perm[r] = swap;
  }
  for (var q = 256; q < 512; q++) perm[q] = perm[q - 256];

  function noise(x, y) {
    var xi = Math.floor(x);
    var yi = Math.floor(y);
    var X = xi & 255;
    var Y = yi & 255;
    var xf = x - xi;
    var yf = y - yi;
    var u = xf * xf * (3 - 2 * xf);
    var v = yf * yf * (3 - 2 * yf);
    var aa = perm[perm[X] + Y] % 8;
    var ab = perm[perm[X] + Y + 1] % 8;
    var ba = perm[perm[X + 1] + Y] % 8;
    var bb = perm[perm[X + 1] + Y + 1] % 8;
    var x1 = (GRAD_X[aa] * xf + GRAD_Y[aa] * yf) * (1 - u) + (GRAD_X[ba] * (xf - 1) + GRAD_Y[ba] * yf) * u;
    var x2 = (GRAD_X[ab] * xf + GRAD_Y[ab] * (yf - 1)) * (1 - u) + (GRAD_X[bb] * (xf - 1) + GRAD_Y[bb] * (yf - 1)) * u;
    return (x1 * (1 - v) + x2 * v + 1) / 2;
  }

  function randomChar() {
    return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
  }

  function buildStyles(palette) {
    var styles = [];
    for (var shade = 0; shade < 3; shade++) {
      var c = palette[shade];
      for (var level = 0; level < LEVELS; level++) {
        var a = ((level + 0.5) / LEVELS) * 0.9;
        styles.push('rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a.toFixed(3) + ')');
      }
    }
    return styles;
  }

  function start() {
    var band = document.createElement('div');
    band.className = 'trusset-fire';
    band.setAttribute('aria-hidden', 'true');
    var canvas = document.createElement('canvas');
    band.appendChild(canvas);
    document.body.appendChild(band);
    var ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) {
      band.remove();
      return;
    }

    var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    var styles = { light: buildStyles(PALETTES.light), dark: buildStyles(PALETTES.dark) };
    var cols = 0;
    var rows = 0;
    var parentRows = 1;
    var width = 0;
    var height = 0;
    var chars = [];
    var alpha = new Float32Array(0);
    var bucketCount = new Uint16Array(3 * LEVELS);
    var bucketItems = new Uint32Array(0);
    var cellBucket = new Int16Array(0);
    var offsets = new Uint32Array(3 * LEVELS);
    var cursor = new Uint32Array(3 * LEVELS);
    var time = 0;
    var frame = 0;
    var last = 0;
    var ticks = 0;

    function isDark() {
      return document.documentElement.classList.contains('dark');
    }

    function geometry() {
      var navbar = document.getElementById('navbar');
      var top = navbar ? Math.max(0, navbar.getBoundingClientRect().bottom) : 0;
      var left = 0;
      var sidebar = document.getElementById('sidebar-content');
      if (sidebar) {
        var rect = sidebar.getBoundingClientRect();
        var shown = rect.width > 0 && rect.left >= 0 && getComputedStyle(sidebar).display !== 'none';
        if (shown && rect.right < window.innerWidth * 0.5) left = rect.right;
      }
      var vw = window.innerWidth;
      var h = vw <= 768 ? 320 : vw <= 1024 ? 390 : 460;
      return { top: Math.round(top), left: Math.round(left), height: h };
    }

    function place() {
      var g = geometry();
      band.style.top = g.top + 'px';
      band.style.left = g.left + 'px';
      band.style.height = g.height + 'px';
      var w = Math.max(0, window.innerWidth - g.left);
      if (w === width && g.height === height) return false;
      width = w;
      height = g.height;
      var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = FONT_SIZE + "px 'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace";
      ctx.textBaseline = 'top';
      cols = Math.ceil(width / CHAR_WIDTH) + 2;
      rows = Math.ceil(((EDGE + EDGE_SWING) * height) / LINE_HEIGHT) + 1;
      parentRows = Math.ceil(height / LINE_HEIGHT);
      var next = new Array(cols * rows);
      for (var i = 0; i < next.length; i++) next[i] = chars[i] || randomChar();
      chars = next;
      alpha = new Float32Array(cols * rows);
      bucketItems = new Uint32Array(cols * rows);
      cellBucket = new Int16Array(cols * rows);
      return true;
    }

    function draw(blend) {
      var palette = isDark() ? styles.dark : styles.light;
      ctx.clearRect(0, 0, width, height);
      bucketCount.fill(0);
      var total = cols * rows;
      var t = time;
      for (var y = 0; y < rows; y++) {
        var yNorm = y / parentRows;
        var bias = 1 - VERTICAL_BIAS + (1 - yNorm) * VERTICAL_BIAS;
        var ny0 = (y - t * DRIFT * 10) * SCALE;
        for (var x = 0; x < cols; x++) {
          var idx = y * cols + x;
          var nx = x * SCALE;
          var val = (noise(nx, ny0 + t * 2) + noise(nx * 2.1, ny0 * 2.1 + t * 3) * 0.5 + noise(nx * 4.3, ny0 * 4.3 + t * 1.5) * 0.25) / 1.75;
          val = Math.max(0, Math.min(1, val * bias)) * MAX_BRIGHTNESS;
          var target = 0;
          var shade = 0;
          if (val >= THRESHOLD) {
            var intensity = Math.max(0, Math.min(1, (val - THRESHOLD) / (MAX_BRIGHTNESS - THRESHOLD)));
            target = 0.2 + intensity * 0.7;
            shade = intensity > 0.7 ? 2 : intensity > 0.3 ? 1 : 0;
            var edge = EDGE + (noise(x * 0.035, t * 0.8 + 40) - 0.5) * 2 * EDGE_SWING;
            var fall = Math.max(0, Math.min(1, (edge - yNorm) / FADE));
            target *= fall * fall * (3 - 2 * fall);
          }
          var current = alpha[idx] + (target - alpha[idx]) * blend;
          alpha[idx] = current;
          if (current < 0.012) {
            cellBucket[idx] = -1;
            continue;
          }
          var level = Math.min(LEVELS - 1, Math.floor((current / 0.9) * LEVELS));
          var bucket = shade * LEVELS + level;
          cellBucket[idx] = bucket;
          bucketCount[bucket]++;
        }
      }
      var running = 0;
      for (var k = 0; k < 3 * LEVELS; k++) {
        offsets[k] = running;
        cursor[k] = running;
        running += bucketCount[k];
      }
      for (var c = 0; c < total; c++) {
        var bk = cellBucket[c];
        if (bk >= 0) bucketItems[cursor[bk]++] = c;
      }
      for (var m = 0; m < 3 * LEVELS; m++) {
        var n = bucketCount[m];
        if (!n) continue;
        ctx.fillStyle = palette[m];
        var startAt = offsets[m];
        for (var j = 0; j < n; j++) {
          var cell = bucketItems[startAt + j];
          var cx = cell % cols;
          var cy = (cell - cx) / cols;
          ctx.fillText(chars[cell], cx * CHAR_WIDTH, cy * LINE_HEIGHT);
        }
      }
    }

    function tick(now) {
      frame = requestAnimationFrame(tick);
      if (document.hidden) return;
      var interval = 1000 / FPS;
      var delta = now - last;
      if (delta < interval) return;
      last = now - (delta % interval);
      ticks++;
      if (ticks % FPS === 0) place();
      time += 0.02 * SPEED;
      for (var i = 0; i < chars.length; i++) {
        if (Math.random() < SWAP_RATE) chars[i] = randomChar();
      }
      draw(0.55);
    }

    function run() {
      cancelAnimationFrame(frame);
      if (!motionQuery.matches) frame = requestAnimationFrame(tick);
    }

    var pending = false;
    function schedule() {
      if (pending) return;
      pending = true;
      requestAnimationFrame(function () {
        pending = false;
        if (place()) draw(1);
      });
    }

    place();
    draw(1);
    run();

    window.addEventListener('resize', schedule, { passive: true });
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('popstate', schedule);
    new MutationObserver(function () {
      draw(1);
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    motionQuery.addEventListener('change', function () {
      draw(1);
      run();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
