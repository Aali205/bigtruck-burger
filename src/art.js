// Hand-drawn SVG art: the delivery truck and menu icons.

const wheel = (cx, cy) => `<g class="wheel" style="transform-origin:${cx}px ${cy}px">
  <circle cx="${cx}" cy="${cy}" r="28" fill="#111"/>
  <circle cx="${cx}" cy="${cy}" r="17" fill="#d9d9d9"/>
  <circle cx="${cx}" cy="${cy}" r="6" fill="#555"/>
  ${[0, 60, 120].map(a => `<rect x="${cx - 1.5}" y="${cy - 16}" width="3" height="32" fill="#777" transform="rotate(${a} ${cx} ${cy})"/>`).join('')}
</g>`;

export const TRUCK = `<svg class="truck-svg" viewBox="-80 0 720 250" aria-hidden="true">
  <g class="truck-flames">
    <path d="M12,70 C-20,60 -40,75 -78,64 C-50,84 -30,86 -8,92 C-40,96 -52,112 -70,118 C-40,122 -20,112 12,118 C-18,130 -30,146 -52,158 C-20,160 0,148 12,146Z" fill="#ff5a1f"/>
    <path d="M12,82 C-8,78 -22,86 -44,84 C-24,96 -10,98 4,102 C-16,108 -26,118 -36,126 C-14,126 0,120 12,122Z" fill="#ffc53d"/>
  </g>
  <rect x="10" y="30" width="380" height="160" rx="10" fill="#d71920"/>
  <rect x="10" y="30" width="380" height="160" rx="10" fill="none" stroke="#fff" stroke-width="4"/>
  <rect x="22" y="42" width="356" height="136" rx="6" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="2" stroke-dasharray="6 6"/>
  <text x="200" y="112" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="62" fill="#fff" letter-spacing="2">BIG TRUCK</text>
  <text x="200" y="150" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="26" fill="#111" letter-spacing="6">BURGER</text>
  <text x="200" y="172" text-anchor="middle" font-family="Cairo, sans-serif" font-weight="700" font-size="13" fill="#fff" letter-spacing="1">STOP... IT'S BURGER TIME</text>
  <rect x="10" y="188" width="390" height="10" fill="#222"/>
  <path d="M398,80 H500 Q516,80 522,94 L548,140 H600 Q624,140 626,164 V198 H398 Z" fill="#b5121a"/>
  <path d="M410,92 H494 Q504,92 508,100 L530,140 H410 Z" fill="#9fd3ff" stroke="#fff" stroke-width="3"/>
  <path d="M414,96 L450,96 L420,136 L414,136Z" fill="#fff" opacity=".35"/>
  <rect x="556" y="150" width="60" height="8" rx="3" fill="#ddd"/>
  <rect x="556" y="164" width="60" height="8" rx="3" fill="#ddd"/>
  <circle cx="620" cy="150" r="7" fill="#ffe27a"/>
  <rect x="420" y="30" width="10" height="52" rx="3" fill="#cfcfcf"/>
  <rect x="436" y="36" width="10" height="46" rx="3" fill="#cfcfcf"/>
  <g class="truck-smoke">
    <circle cx="425" cy="20" r="9" fill="#888" opacity=".5"/><circle cx="410" cy="6" r="12" fill="#888" opacity=".35"/><circle cx="390" cy="-6" r="15" fill="#888" opacity=".2"/>
  </g>
  ${wheel(70, 205)}${wheel(135, 205)}${wheel(330, 205)}${wheel(460, 205)}${wheel(575, 205)}
</svg>`;

export const ICONS = {
  burger: `<svg viewBox="0 0 64 64"><path d="M8,30 C8,14 56,14 56,30Z" fill="#f2a042"/><rect x="6" y="31" width="52" height="7" rx="3.5" fill="#4a220e"/><path d="M6,38 H58 L54,42 H10Z" fill="#ffc933"/><rect x="8" y="42" width="48" height="10" rx="5" fill="#d9832c"/><g fill="#fff4d6"><ellipse cx="22" cy="21" rx="2" ry="1"/><ellipse cx="32" cy="18" rx="2" ry="1"/><ellipse cx="42" cy="22" rx="2" ry="1"/></g></svg>`,
  mushroom: `<svg viewBox="0 0 64 64"><path d="M8,32 C8,12 56,12 56,32Z" fill="#8a5a3a"/><circle cx="22" cy="24" r="3" fill="#c79b77"/><circle cx="38" cy="20" r="2.5" fill="#c79b77"/><circle cx="44" cy="28" r="2" fill="#c79b77"/><path d="M24,32 H40 L42,54 Q32,58 22,54Z" fill="#efe1cf"/></svg>`,
  fire: `<svg viewBox="0 0 64 64"><path d="M32,4 C36,18 50,24 48,40 C46,54 36,60 32,60 C22,60 14,52 14,40 C14,30 22,26 22,16 C28,22 28,28 30,30 C32,22 34,14 32,4Z" fill="#ff4d1f"/><path d="M32,30 C36,38 42,42 40,50 C38,56 34,58 32,58 C26,58 22,54 22,48 C22,42 28,40 32,30Z" fill="#ffc53d"/></svg>`,
  leaf: `<svg viewBox="0 0 64 64"><path d="M10,54 C10,24 30,8 56,8 C56,36 40,54 10,54Z" fill="#4fae3a"/><path d="M12,52 C24,38 34,28 50,14" stroke="#b9ec8e" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`,
  tender: `<svg viewBox="0 0 64 64"><g transform="rotate(-20 32 32)"><rect x="10" y="12" width="14" height="40" rx="7" fill="#e3942e"/><rect x="26" y="8" width="14" height="44" rx="7" fill="#f0a840"/><rect x="42" y="14" width="14" height="38" rx="7" fill="#d98626"/></g></svg>`,
  chicken: `<svg viewBox="0 0 64 64"><path d="M20,12 C36,4 56,16 52,34 C48,48 34,50 28,44 L16,56 L10,50 L22,38 C14,32 10,18 20,12Z" fill="#e39a37"/><circle cx="11" cy="55" r="5" fill="#fff4dc"/></svg>`,
  rings: `<svg viewBox="0 0 64 64"><ellipse cx="24" cy="34" rx="16" ry="16" fill="none" stroke="#e6a33c" stroke-width="8"/><ellipse cx="42" cy="28" rx="14" ry="14" fill="none" stroke="#f2b650" stroke-width="7"/></svg>`,
  cheese: `<svg viewBox="0 0 64 64"><rect x="8" y="26" width="30" height="12" rx="6" fill="#e39a37" transform="rotate(-30 23 32)"/><rect x="28" y="30" width="30" height="12" rx="6" fill="#f0a840"/><path d="M28,36 C22,40 18,40 14,46" stroke="#fff3c4" stroke-width="5" fill="none" stroke-linecap="round"/></svg>`,
  fries: `<svg viewBox="0 0 64 64"><g fill="#ffcc3d"><rect x="18" y="8" width="6" height="30" rx="2"/><rect x="26" y="4" width="6" height="34" rx="2"/><rect x="34" y="6" width="6" height="32" rx="2"/><rect x="42" y="10" width="6" height="28" rx="2"/></g><path d="M12,28 H52 L46,60 H18Z" fill="#d71920"/><path d="M22,40 H42" stroke="#fff" stroke-width="3"/></svg>`,
};
