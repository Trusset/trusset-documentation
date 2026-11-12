export const FireChars = ({ height = 460 }) => {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return undefined;

    const GRAD_X = [1, -1, 1, -1, 1, -1, 0, 0];
    const GRAD_Y = [1, 1, -1, -1, 0, 0, 1, -1];
    const CHARACTERS = '0123456789abcdef{}[]:<>';
    const SPEED = 0.6;
    const SCALE = 0.09;
    const DRIFT = 0.5;
    const SWAP_RATE = 0.018;
    const FPS = 16;
    const MAX_BRIGHTNESS = 0.55;
    const VERTICAL_BIAS = 0.65;
    const FONT_SIZE = 11;
    const LINE_HEIGHT = 14;
    const CHAR_WIDTH = FONT_SIZE * 0.6;
    const THRESHOLD = MAX_BRIGHTNESS * 0.3;
    const EDGE = 0.5;
    const EDGE_SWING = 0.13;
    const FADE = 0.3;
    const LIGHT = { low: [200, 200, 200], mid: [180, 180, 180], high: [150, 150, 150] };
    const DARK = { low: [50, 52, 51], mid: [66, 68, 67], high: [92, 94, 93] };

    const perm = new Uint8Array(512);
    for (let i = 0; i < 256; i++) perm[i] = i;
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const swap = perm[i];
      perm[i] = perm[j];
      perm[j] = swap;
    }
    for (let i = 256; i < 512; i++) perm[i] = perm[i - 256];

    const noise = (x, y) => {
      const xi = Math.floor(x);
      const yi = Math.floor(y);
      const X = xi & 255;
      const Y = yi & 255;
      const xf = x - xi;
      const yf = y - yi;
      const u = xf * xf * (3 - 2 * xf);
      const v = yf * yf * (3 - 2 * yf);
      const aa = perm[perm[X] + Y] % 8;
      const ab = perm[perm[X] + Y + 1] % 8;
      const ba = perm[perm[X + 1] + Y] % 8;
      const bb = perm[perm[X + 1] + Y + 1] % 8;
      const x1 = (GRAD_X[aa] * xf + GRAD_Y[aa] * yf) * (1 - u) + (GRAD_X[ba] * (xf - 1) + GRAD_Y[ba] * yf) * u;
      const x2 = (GRAD_X[ab] * xf + GRAD_Y[ab] * (yf - 1)) * (1 - u) + (GRAD_X[bb] * (xf - 1) + GRAD_Y[bb] * (yf - 1)) * u;
      return (x1 * (1 - v) + x2 * v + 1) / 2;
    };

    const randomChar = () => CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];

    const band = document.createElement('div');
    band.className = 'trusset-fire';
    band.setAttribute('aria-hidden', 'true');
    const canvas = document.createElement('canvas');
    band.appendChild(canvas);
    document.body.appendChild(band);
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      band.remove();
      return undefined;
    }

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let cols = 0;
    let rows = 0;
    let parentRows = 1;
    let chars = [];
    let alpha = new Float32Array(0);
    let time = 0;
    let frame = 0;
    let last = 0;
    let onScreen = true;

    const palette = () => (document.documentElement.classList.contains('dark') ? DARK : LIGHT);

    const place = () => {
      const navbar = document.getElementById('navbar');
      let top = 0;
      if (navbar) {
        const stuck = ['sticky', 'fixed'].includes(getComputedStyle(navbar).position);
        top = navbar.getBoundingClientRect().bottom + (stuck ? 0 : window.scrollY);
      }
      const sidebar = document.getElementById('sidebar-content');
      let left = 0;
      if (sidebar) {
        const rect = sidebar.getBoundingClientRect();
        const visible = getComputedStyle(sidebar).display !== 'none' && rect.width > 0 && rect.left >= 0;
        if (visible && rect.right < window.innerWidth * 0.5) left = rect.right;
      }
      band.style.top = `${Math.max(0, Math.round(top))}px`;
      band.style.left = `${Math.round(left)}px`;
      const width = window.innerWidth;
      const bandHeight = width <= 768 ? Math.min(height, 320) : width <= 1024 ? Math.min(height, 390) : height;
      band.style.height = `${bandHeight}px`;
    };

    const resize = () => {
      place();
      const rect = band.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(rect.width / CHAR_WIDTH) + 2;
      rows = Math.ceil(((EDGE + EDGE_SWING) * rect.height) / LINE_HEIGHT) + 1;
      parentRows = Math.ceil(rect.height / LINE_HEIGHT);
      chars = Array.from({ length: cols * rows }, (_, i) => chars[i] ?? randomChar());
      alpha = new Float32Array(cols * rows);
    };

    const draw = (blend) => {
      const colors = palette();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${FONT_SIZE}px 'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace`;
      ctx.textBaseline = 'top';
      const t = time;
      for (let y = 0; y < rows; y++) {
        const yNorm = y / parentRows;
        for (let x = 0; x < cols; x++) {
          const idx = y * cols + x;
          const nx = x * SCALE;
          const ny = (y - t * DRIFT * 10) * SCALE;
          let val = (noise(nx, ny + t * 2) + noise(nx * 2.1, ny * 2.1 + t * 3) * 0.5 + noise(nx * 4.3, ny * 4.3 + t * 1.5) * 0.25) / 1.75;
          val *= 1 - VERTICAL_BIAS + (1 - yNorm) * VERTICAL_BIAS;
          val = Math.max(0, Math.min(1, val)) * MAX_BRIGHTNESS;

          let target = 0;
          let shade = colors.low;
          if (val >= THRESHOLD) {
            const intensity = Math.max(0, Math.min(1, (val - THRESHOLD) / (MAX_BRIGHTNESS - THRESHOLD)));
            target = 0.2 + intensity * 0.7;
            shade = intensity > 0.7 ? colors.high : intensity > 0.3 ? colors.mid : colors.low;
            const edge = EDGE + (noise(x * 0.035, t * 0.8 + 40) - 0.5) * 2 * EDGE_SWING;
            const fall = Math.max(0, Math.min(1, (edge - yNorm) / FADE));
            target *= fall * fall * (3 - 2 * fall);
          }

          const current = alpha[idx] + (target - alpha[idx]) * blend;
          alpha[idx] = current;
          if (current < 0.012) continue;
          ctx.fillStyle = `rgba(${shade[0]},${shade[1]},${shade[2]},${current.toFixed(3)})`;
          ctx.fillText(chars[idx], x * CHAR_WIDTH, y * LINE_HEIGHT);
        }
      }
    };

    const tick = (now) => {
      frame = requestAnimationFrame(tick);
      if (!onScreen || document.hidden) return;
      const interval = 1000 / FPS;
      const delta = now - last;
      if (delta < interval) return;
      last = now - (delta % interval);
      time += 0.02 * SPEED;
      for (let i = 0; i < chars.length; i++) {
        if (Math.random() < SWAP_RATE) chars[i] = randomChar();
      }
      draw(0.55);
    };

    const start = () => {
      cancelAnimationFrame(frame);
      if (!motionQuery.matches) frame = requestAnimationFrame(tick);
    };

    resize();
    draw(1);
    start();

    const resizeObserver = new ResizeObserver(() => {
      resize();
      draw(1);
    });
    resizeObserver.observe(document.body);
    const navbar = document.getElementById('navbar');
    if (navbar) resizeObserver.observe(navbar);

    const intersection = new IntersectionObserver((entries) => {
      onScreen = entries[entries.length - 1].isIntersecting;
    }, { rootMargin: '120px' });
    intersection.observe(band);

    const themeObserver = new MutationObserver(() => draw(1));
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    const onMotionChange = () => {
      draw(1);
      start();
    };
    motionQuery.addEventListener('change', onMotionChange);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersection.disconnect();
      themeObserver.disconnect();
      motionQuery.removeEventListener('change', onMotionChange);
      band.remove();
    };
  }, [height]);

  return null;
};
