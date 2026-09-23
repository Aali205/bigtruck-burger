import './styles.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { burgerSVG } from './burger.js';
import { TRUCK, ICONS } from './art.js';
import { I18N, BUILD_STEPS, MENU, BRANCHES, CONTACT } from './content.js';

gsap.registerPlugin(ScrollTrigger);

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Language ---------- */
const store = {
  get: k => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
};
let lang = store.get('btb-lang') === 'en' ? 'en' : 'ar';
let activeTab = 'burgers';
let currentStep = 0;

function applyLang() {
  const dict = I18N[lang];
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  $$('[data-i18n]').forEach(el => (el.textContent = dict[el.dataset.i18n]));
  $$('[data-i18n-html]').forEach(el => (el.innerHTML = dict[el.dataset.i18nHtml]));
  $('#langToggle').textContent = lang === 'ar' ? 'EN' : 'ع';

  const items = dict.marquee.map(t => `<span>${t}</span>`).join('');
  $('#marquee').innerHTML = items + items + items + items;

  renderMenu();
  renderVisit();
  setStep(currentStep, true);
  ScrollTrigger.refresh();
}

$('#langToggle').addEventListener('click', () => {
  lang = lang === 'ar' ? 'en' : 'ar';
  store.set('btb-lang', lang);
  applyLang();
});

/* ---------- Menu ---------- */
function renderMenu() {
  const dict = I18N[lang];
  $('#menuGrid').innerHTML = MENU[activeTab]
    .map((item, i) => {
      const [name, desc] = item[lang];
      return `<article class="card" style="--d:${i}">
        ${i === 0 ? `<span class="tag">${dict['menu.fav']}</span>` : ''}
        <div class="card-icon">${ICONS[item.icon]}</div>
        <h3>${name}</h3><p>${desc}</p>
      </article>`;
    })
    .join('');
  bindTilt();
}

$('#menuTabs').addEventListener('click', e => {
  const btn = e.target.closest('[data-tab]');
  if (!btn) return;
  activeTab = btn.dataset.tab;
  $$('#menuTabs [data-tab]').forEach(b => b.setAttribute('aria-selected', b === btn));
  renderMenu();
});

function bindTilt() {
  if (reduced || !matchMedia('(hover: hover)').matches) return;
  $$('.card').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(700px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-6px)`;
    });
    card.addEventListener('pointerleave', () => (card.style.transform = ''));
  });
}

/* ---------- Visit ---------- */
const PHONE_ICON = '<svg viewBox="0 0 24 24"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z"/></svg>';
const PIN_ICON = '<svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>';
const fmtPhone = p => (p.startsWith('09') ? p.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3') : p.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3'));

function renderVisit() {
  const dict = I18N[lang];
  $('#branches').innerHTML = BRANCHES.map(b => {
    const q = encodeURIComponent(b.map);
    return `<article class="branch">
      <div class="branch-map">
        <button class="map-facade" type="button" data-q="${q}" data-title="${b[lang].name}">${PIN_ICON}<span>${dict['visit.map']}</span></button>
      </div>
      <div class="branch-body">
        <div><h3>${b[lang].name}</h3><p>${b[lang].addr}</p></div>
        <a class="btn btn-red btn-sm" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${q}">${dict['visit.directions']}</a>
      </div>
    </article>`;
  }).join('');
  $('#phones').innerHTML =
    CONTACT.phones.map(p => `<a class="phone" href="tel:${p}">${PHONE_ICON}${fmtPhone(p)}</a>`).join('') +
    `<span class="phone bee">🐝 ${dict['visit.bee']}</span>`;
}

// Google Maps embeds are heavy; only load one when asked
$('#branches').addEventListener('click', e => {
  const btn = e.target.closest('.map-facade');
  if (!btn) return;
  const frame = document.createElement('iframe');
  frame.title = btn.dataset.title;
  frame.referrerPolicy = 'no-referrer-when-downgrade';
  frame.src = `https://maps.google.com/maps?q=${btn.dataset.q}&z=15&output=embed`;
  btn.replaceWith(frame);
});

function updateOpenState() {
  const hour = Number(new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hourCycle: 'h23', timeZone: 'Asia/Damascus' }).format(new Date()));
  $('#liveDot').classList.toggle('open', hour >= 14);
}

/* ---------- Embers ---------- */
// One pre-rendered glow sprite per hue, stamped with drawImage. Live
// shadowBlur per particle was the single biggest cause of scroll jank.
function glowSprite(hue) {
  const c = document.createElement('canvas');
  c.width = c.height = 32;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(16, 16, 0, 16, 16, 16);
  grad.addColorStop(0, `hsla(${hue},100%,75%,1)`);
  grad.addColorStop(0.25, `hsla(${hue},100%,60%,.8)`);
  grad.addColorStop(1, `hsla(${hue},100%,50%,0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, 32, 32);
  return c;
}
const SPRITES = [18, 28, 38].map(glowSprite);

function embers(canvas, density = 1) {
  const ctx = canvas.getContext('2d', { alpha: true });
  let w, h, parts = [], visible = false, raf = 0;
  const spawn = (initial = false) => ({
    x: Math.random() * w,
    y: initial ? Math.random() * h : h + 10,
    s: 5 + Math.random() * 10,
    vy: 0.4 + Math.random() * 1.4,
    vx: (Math.random() - 0.5) * 0.4,
    life: 0.5 + Math.random() * 0.5,
    sprite: SPRITES[(Math.random() * SPRITES.length) | 0],
    t: Math.random() * 100,
  });
  const resize = () => {
    // Particles are soft glows, so 1x resolution looks identical and is 4x cheaper on hi-DPI screens
    w = canvas.width = canvas.clientWidth;
    h = canvas.height = canvas.clientHeight;
    parts = Array.from({ length: Math.min(90, Math.round(((w * h) / 14000) * density)) }, () => spawn(true));
  };
  const tick = () => {
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';
    for (const p of parts) {
      p.t += 0.03;
      p.y -= p.vy;
      p.x += p.vx + Math.sin(p.t) * 0.35;
      ctx.globalAlpha = Math.max(0, Math.min(1, p.y / h)) * p.life;
      ctx.drawImage(p.sprite, p.x - p.s / 2, p.y - p.s / 2, p.s, p.s);
      if (p.y < -10) Object.assign(p, spawn());
    }
    raf = requestAnimationFrame(tick);
  };
  const sync = () => {
    const run = visible && !document.hidden;
    if (run && !raf) tick();
    else if (!run && raf) { cancelAnimationFrame(raf); raf = 0; }
  };
  resize();
  new ResizeObserver(resize).observe(canvas);
  if (reduced) return;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync(); }).observe(canvas);
  document.addEventListener('visibilitychange', sync);
}

/* ---------- Burger build ---------- */
const stage = $('#burgerStage');
stage.innerHTML = burgerSVG();
$('#stepDots').innerHTML = BUILD_STEPS.map(() => '<li></li>').join('');

function setStep(i, force = false) {
  if (i === currentStep && !force) return;
  currentStep = i;
  const [title, desc] = BUILD_STEPS[i][lang];
  const text = $('.step-text');
  const write = () => {
    $('#stepNum').textContent = String(i + 1).padStart(2, '0');
    $('#stepTitle').textContent = title;
    $('#stepDesc').textContent = desc;
    text.classList.remove('swap');
  };
  $$('#stepDots li').forEach((li, n) => {
    li.classList.toggle('on', n < i);
    li.classList.toggle('cur', n === i);
  });
  if (force) return write();
  text.classList.add('swap');
  clearTimeout(setStep.t);
  setStep.t = setTimeout(write, 180);
}

function setupBuild() {
  const layers = $$('.stack .layer');
  const N = layers.length;
  const done = on => {
    stage.classList.toggle('done', on);
    $('#buildDone').classList.toggle('show', on);
  };

  if (reduced) {
    setStep(N - 1, true);
    done(true);
    return;
  }

  layers.forEach((l, i) =>
    gsap.set(l, {
      y: -760,
      x: (i % 2 ? 1 : -1) * (30 + (i * 17) % 60),
      rotation: (i % 2 ? 1 : -1) * (10 + (i * 7) % 18),
      opacity: 0,
      transformOrigin: '50% 50%',
    }),
  );
  gsap.set('.burger-shadow', { scaleX: 0.3, opacity: 0.2, transformOrigin: '50% 50%' });

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: '.build',
      pin: '.build-pin',
      start: 'top top',
      end: () => '+=' + Math.round(N * innerHeight * 0.6),
      scrub: 0.7,
      anticipatePin: 1,
      onUpdate: self => {
        const t = self.progress * tl.duration();
        setStep(Math.min(N - 1, Math.max(0, Math.floor(t))));
        done(t >= N + 0.2);
      },
    },
  });

  layers.forEach((l, i) => {
    tl.to(l, { opacity: 1, duration: 0.15 }, i)
      .to(l, { y: 0, x: 0, duration: 0.85, ease: 'bounce.out' }, i)
      .to(l, { rotation: 0, duration: 0.7, ease: 'power2.out' }, i)
      .to('.burger-shadow', { scaleX: 0.3 + (0.7 * (i + 1)) / N, opacity: 0.2 + (0.8 * (i + 1)) / N, duration: 0.6 }, i + 0.3);
  });
  // the final squish when the crown lands
  tl.to('.stack', { scaleY: 0.93, scaleX: 1.03, transformOrigin: '50% 100%', duration: 0.2, ease: 'power2.in' }, N)
    .to('.stack', { scaleY: 1, scaleX: 1, duration: 0.5, ease: 'elastic.out(1, 0.35)' })
    .to({}, { duration: 0.6 });
}

/* ---------- Road ---------- */
function setupRoad() {
  $('#truck').innerHTML = TRUCK;
  if (reduced) return;
  const st = { trigger: '.road-scene', start: 'top bottom', end: 'bottom top', scrub: 0.5 };
  gsap.fromTo('#truck', { x: () => -$('#truck').offsetWidth - 60 }, { x: () => innerWidth + 60, ease: 'none', scrollTrigger: { ...st, invalidateOnRefresh: true } });
  gsap.to('.wheel', { rotation: 1080, transformOrigin: '50% 50%', ease: 'none', scrollTrigger: st });
  gsap.to('#lane', { xPercent: -20, ease: 'none', scrollTrigger: st });
  const bounce = gsap.to('#truck', { y: -3, duration: 0.18, repeat: -1, yoyo: true, ease: 'sine.inOut', paused: true });
  ScrollTrigger.create({
    trigger: '.road-scene',
    start: 'top bottom',
    end: 'bottom top',
    onToggle: self => {
      $('.road').classList.toggle('live', self.isActive);
      self.isActive ? bounce.play() : bounce.pause();
    },
  });
}

function setupCounters() {
  $$('[data-count]').forEach(el => {
    const end = Number(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    if (reduced) { el.textContent = end + suffix; return; }
    const o = { v: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => gsap.to(o, { v: end, duration: 1.6, ease: 'power3.out', onUpdate: () => (el.textContent = Math.round(o.v) + suffix) }),
    });
  });
}

function setupReveals() {
  if (reduced) return;
  $$('.section-title, .kicker, .road-copy p, .hero-sub').forEach(el => {
    if (el.closest('.hero') || el.closest('.build')) return;
    gsap.from(el, { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
  });
  gsap.from('.stat', { y: 50, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.stats', start: 'top 85%' } });
  gsap.from('.cta-title', { scale: 0.6, opacity: 0, duration: 1, ease: 'back.out(2)', scrollTrigger: { trigger: '.cta', start: 'top 70%' } });
}

function heroIntro() {
  if (reduced) return;
  gsap.timeline()
    .from('.hero-title .line > span', { yPercent: 115, duration: 1, stagger: 0.12, ease: 'power4.out' })
    .from('.hero .kicker, .hero-sub, .hero-ctas', { y: 30, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out' }, '-=0.6')
    .from('.hero-badge', { scale: 0.5, rotation: -40, opacity: 0, duration: 1.2, ease: 'back.out(1.6)' }, 0.1);
  gsap.to('.hero-badge img', { yPercent: 18, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
}

/* ---------- Smooth scroll ---------- */
// Windows mouse wheels jump ~100px per notch, which makes scrubbed animations
// step visibly. Lenis interpolates the wheel; touch keeps native scrolling.
let lenis = null;
if (!reduced) {
  lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    e.preventDefault();
    lenis.scrollTo(a.getAttribute('href') === '#top' ? 0 : a.getAttribute('href'), { duration: 1.4 });
  });
}

/* ---------- Boot ---------- */
const nav = $('#nav');
addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 30), { passive: true });
$('#year').textContent = new Date().getFullYear();

document.body.classList.add('loading');
lenis?.stop();
applyLang();
setupBuild();
setupRoad();
setupCounters();
setupReveals();
updateOpenState();
setInterval(updateOpenState, 60_000);
embers($('#embers'), 1);
embers($('#embers2'), 0.6);

const minDelay = new Promise(r => setTimeout(r, reduced ? 0 : 1300));
const loaded = new Promise(r => (document.readyState === 'complete' ? r() : addEventListener('load', r, { once: true })));
Promise.all([minDelay, loaded, document.fonts?.ready]).then(() => {
  $('#loader').classList.add('done');
  document.body.classList.remove('loading');
  lenis?.start();
  ScrollTrigger.refresh();
  heroIntro();
});
