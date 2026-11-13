// Einfache Linien-Grafik als SVG (ohne externe Bibliothek, funktioniert offline).
const NS = 'http://www.w3.org/2000/svg';

function s(tag, attrs = {}) {
  const n = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  return n;
}

// serien: [{ punkte: [{x, y}], hervorheben: bool }]
export function linien(serien, { yMax = 100, xMax = null, xLabel = 'Minuten', yLabel = '', beschreibung = 'Verlauf' } = {}) {
  const B = 340, H = 190, L = 34, R = 10, O = 10, U = 28;
  const alleX = serien.flatMap((sr) => sr.punkte.map((p) => p.x));
  const maxX = xMax ?? Math.max(1, ...alleX);
  const px = (x) => L + (x / maxX) * (B - L - R);
  const py = (y) => O + (1 - y / yMax) * (H - O - U);

  const svg = s('svg', { viewBox: `0 0 ${B} ${H}`, class: 'chart', role: 'img', 'aria-label': beschreibung });
  // Raster
  [0, 0.5, 1].forEach((t) => {
    const y = py(t * yMax);
    svg.append(s('line', { x1: L, x2: B - R, y1: y, y2: y, class: 'chart-raster' }));
    const txt = s('text', { x: L - 6, y: y + 4, 'text-anchor': 'end', class: 'chart-text' });
    txt.textContent = String(Math.round(t * yMax));
    svg.append(txt);
  });
  const xt = s('text', { x: B - R, y: H - 6, 'text-anchor': 'end', class: 'chart-text' });
  xt.textContent = xLabel ? `${xLabel} (bis ${Math.round(maxX * 10) / 10})` : '';
  svg.append(xt);
  if (yLabel) {
    const yt = s('text', { x: L, y: H - 6, class: 'chart-text' });
    yt.textContent = yLabel;
    svg.append(yt);
  }

  serien.forEach((sr) => {
    if (!sr.punkte.length) return;
    const klass = sr.hervorheben ? 'chart-linie chart-linie-stark' : 'chart-linie';
    const d = sr.punkte.map((p, i) => `${i ? 'L' : 'M'}${px(p.x).toFixed(1)},${py(p.y).toFixed(1)}`).join(' ');
    svg.append(s('path', { d, class: klass }));
    sr.punkte.forEach((p) => svg.append(s('circle', { cx: px(p.x), cy: py(p.y), r: sr.hervorheben ? 3.5 : 2.5, class: klass + ' chart-punkt' })));
  });
  return svg;
}
