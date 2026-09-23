// Procedural SVG burger. Every layer is its own <g> drawn at its final
// stacked position, so the scroll timeline only has to animate transforms.

const rng = seed => () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

const f = n => n.toFixed(1);

// Slice with a flat top and a drippy bottom edge (cheese, sauce)
function drippy(y, thick, seed, { x0 = 28, x1 = 372, chance = 0.45, maxDepth = 34 } = {}) {
  const r = rng(seed);
  const b = y + thick;
  let d = `M${x0},${y} H${x1} L${x1 + 4},${y + thick * 0.6} L${x1},${b}`;
  let x = x1;
  while (x > x0 + 20) {
    const w = 16 + r() * 22;
    if (r() < chance) {
      const depth = 10 + r() * maxDepth;
      d += ` L${f(x - 3)},${b} C${f(x - 3)},${f(b + depth)} ${f(x - w + 3)},${f(b + depth)} ${f(x - w + 3)},${b}`;
    } else {
      d += ` L${f(x - w)},${f(b + r() * 3)}`;
    }
    x -= w;
  }
  return d + ` L${x0},${b} L${x0 - 4},${y + thick * 0.6} Z`;
}

function patty(y, seed) {
  const r = rng(seed);
  let d = `M40,${y + 24} Q40,${y} 70,${y + 2}`;
  for (let x = 70; x < 330; x += 26) d += ` Q${x + 13},${f(y - 3 + r() * 5)} ${x + 26},${f(y + 1 + r() * 3)}`;
  d += ` Q360,${y} 360,${y + 24} Q360,${y + 48} 330,${y + 47}`;
  for (let x = 330; x > 70; x -= 26) d += ` Q${x - 13},${f(y + 50 + r() * 4)} ${x - 26},${f(y + 47 + r() * 2)}`;
  d += ` Q40,${y + 48} 40,${y + 24} Z`;

  let specks = '';
  for (let i = 0; i < 70; i++) {
    const sx = 55 + r() * 290;
    const sy = y + 8 + r() * 34;
    const c = r() < 0.6 ? '#1f0c04' : '#8a4b26';
    specks += `<circle cx="${f(sx)}" cy="${f(sy)}" r="${f(0.8 + r() * 2.2)}" fill="${c}" opacity="${f(0.4 + r() * 0.5)}"/>`;
  }
  // grill char marks
  let marks = '';
  for (let i = 0; i < 6; i++) {
    const mx = 85 + i * 48;
    marks += `<path d="M${mx},${y + 6} l18,36" stroke="#170802" stroke-width="5" stroke-linecap="round" opacity=".55"/>`;
  }
  return `<path d="${d}" fill="url(#gPatty)"/>${marks}${specks}
    <path d="M70,${y + 7} Q200,${y - 2} 330,${y + 7}" stroke="#a0613a" stroke-width="3" fill="none" opacity=".5" stroke-linecap="round"/>`;
}

function lettuce() {
  const r = rng(11);
  let d = 'M20,470';
  for (let x = 20; x < 380; x += 24) d += ` Q${x + 12},${f(440 + r() * 10)} ${x + 24},${f(460 + r() * 8)}`;
  for (let x = 380; x > 20; x -= 20) d += ` Q${x - 10},${f(490 + r() * 8)} ${x - 20},${f(478 + r() * 4)}`;
  d += 'Z';
  let veins = '';
  for (let x = 40; x < 370; x += 34) veins += `<path d="M${x},474 q8,-12 20,-18" stroke="#b7ec8e" stroke-width="2" fill="none" opacity=".7" stroke-linecap="round"/>`;
  return `<path d="${d}" fill="url(#gLettuce)" stroke="#3b8a22" stroke-width="2"/>${veins}`;
}

function tomatoes(cy) {
  return [95, 200, 305]
    .map((cx, i) => {
      const r = rng(20 + i);
      let seeds = '';
      for (let s = 0; s < 6; s++) {
        const a = (s / 6) * Math.PI * 2;
        seeds += `<ellipse cx="${f(cx + Math.cos(a) * 30)}" cy="${f(cy + Math.sin(a) * 5)}" rx="4" ry="1.8" fill="#ffd6a8" opacity=".85"/>`;
      }
      const tilt = f((r() - 0.5) * 4);
      return `<g transform="rotate(${tilt} ${cx} ${cy})">
        <ellipse cx="${cx}" cy="${cy + 3}" rx="64" ry="13" fill="#9c120c"/>
        <ellipse cx="${cx}" cy="${cy}" rx="64" ry="12" fill="#d8261c"/>
        <ellipse cx="${cx}" cy="${cy}" rx="54" ry="9" fill="#ef4b3c"/>
        <ellipse cx="${cx}" cy="${cy}" rx="14" ry="3" fill="#ff8a70"/>${seeds}</g>`;
    })
    .join('');
}

function onions(cy) {
  return [
    [110, cy, 52],
    [210, cy - 2, 58],
    [300, cy + 1, 50],
  ]
    .map(
      ([cx, y, rx]) => `
      <ellipse cx="${cx}" cy="${y}" rx="${rx}" ry="9" fill="none" stroke="#8e2f82" stroke-width="8"/>
      <ellipse cx="${cx}" cy="${y}" rx="${rx}" ry="9" fill="none" stroke="#f6ecf8" stroke-width="4.5"/>
      <ellipse cx="${cx}" cy="${y}" rx="${rx - 12}" ry="5" fill="none" stroke="#e9d3ee" stroke-width="3"/>`,
    )
    .join('');
}

function pickles(cy) {
  return [
    [70, cy + 2],
    [135, cy - 2],
    [200, cy + 1],
    [265, cy - 1],
    [330, cy + 2],
  ]
    .map(
      ([cx, y]) => `
      <ellipse cx="${cx}" cy="${y}" rx="30" ry="8" fill="#5f7f1e" stroke="#3e5510" stroke-width="2"/>
      <ellipse cx="${cx}" cy="${y - 1}" rx="21" ry="4.5" fill="#b9cf5f"/>
      <circle cx="${cx - 7}" cy="${y - 1}" r="1.4" fill="#f4f7d2"/><circle cx="${cx + 6}" cy="${y}" r="1.4" fill="#f4f7d2"/>`,
    )
    .join('');
}

function topBun() {
  const r = rng(99);
  const dome = 'M32,312 C30,230 100,190 200,188 C300,190 370,230 368,312 Q368,322 356,322 H44 Q32,322 32,312 Z';
  let seeds = '';
  for (let i = 0; i < 38; i++) {
    const x = 70 + r() * 260;
    const t = (x - 200) / 170;
    const yTop = 196 + 110 * t * t;
    const y = yTop + 12 + r() * (292 - yTop - 12);
    seeds += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="5.2" ry="2.6" transform="rotate(${f(r() * 180)} ${f(x)} ${f(y)})" fill="#fff5dc" stroke="#d6ae6d" stroke-width=".8"/>`;
  }
  return `<path d="${dome}" fill="url(#gBun)"/>
    <path d="M40,300 Q200,330 360,300 L360,312 Q360,322 348,322 H52 Q40,322 40,312Z" fill="#b25a14" opacity=".55"/>
    <ellipse cx="150" cy="232" rx="70" ry="22" fill="#fff" opacity=".18" transform="rotate(-12 150 232)"/>
    ${seeds}`;
}

function bottomBun() {
  return `<path d="M36,476 Q36,468 46,468 H354 Q364,468 364,476 L358,506 Q352,532 320,534 H80 Q48,532 42,506 Z" fill="url(#gBunLow)"/>
    <rect x="40" y="466" width="320" height="12" rx="6" fill="#f6d59d"/>`;
}

export const LAYERS = [
  { id: 'bun-bottom', svg: bottomBun },
  { id: 'lettuce', svg: lettuce },
  { id: 'patty-1', svg: () => patty(412, 3) },
  { id: 'cheese-1', svg: () => `<path d="${drippy(402, 12, 5)}" fill="url(#gCheese)" stroke="#e39a0c" stroke-width="1.5"/>` },
  { id: 'patty-2', svg: () => patty(360, 8) },
  { id: 'cheese-2', svg: () => `<path d="${drippy(352, 12, 13)}" fill="url(#gCheese)" stroke="#e39a0c" stroke-width="1.5"/>` },
  { id: 'tomato', svg: () => tomatoes(342) },
  { id: 'onion', svg: () => onions(330) },
  { id: 'pickles', svg: () => pickles(320) },
  {
    id: 'sauce',
    svg: () =>
      `<path d="${drippy(308, 8, 42, { x0: 50, x1: 350, chance: 0.55, maxDepth: 22 })}" fill="#f07c22" stroke="#c4540c" stroke-width="1.2" transform="translate(0,-8)"/>`,
  },
  { id: 'bun-top', svg: () => `<g transform="translate(0,-14)">${topBun()}</g>` },
];

const DEFS = `<defs>
  <linearGradient id="gBun" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#f7b458"/><stop offset=".55" stop-color="#e08a2e"/><stop offset="1" stop-color="#b8611a"/>
  </linearGradient>
  <linearGradient id="gBunLow" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#eba04a"/><stop offset="1" stop-color="#a65516"/>
  </linearGradient>
  <linearGradient id="gPatty" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#6b3519"/><stop offset=".6" stop-color="#48210d"/><stop offset="1" stop-color="#2c1206"/>
  </linearGradient>
  <linearGradient id="gCheese" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#ffd23f"/><stop offset="1" stop-color="#f7a90f"/>
  </linearGradient>
  <linearGradient id="gLettuce" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#8fdc5a"/><stop offset="1" stop-color="#4fa42c"/>
  </linearGradient>
  <radialGradient id="gShadow"><stop offset="0" stop-color="#000" stop-opacity=".7"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
</defs>`;

const STEAM = [150, 200, 250]
  .map(
    (x, i) =>
      `<path class="steam" style="--i:${i}" d="M${x},180 c-14,-18 14,-30 0,-48 c-14,-18 14,-30 0,-48" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/>`,
  )
  .join('');

export function burgerSVG() {
  const layers = LAYERS.map(l => `<g class="layer" data-layer="${l.id}">${l.svg()}</g>`).join('');
  return `<svg class="burger-svg" viewBox="0 70 400 490" role="img" aria-label="Big Truck burger">
    ${DEFS}
    <ellipse class="burger-shadow" cx="200" cy="546" rx="190" ry="16" fill="url(#gShadow)"/>
    <g class="steam-group">${STEAM}</g>
    <g class="stack">${layers}</g>
  </svg>`;
}
