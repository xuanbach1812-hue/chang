import { icons } from './icons.js';
import vi from './i18n/vi.json';
import ko from './i18n/ko.json';
import en from './i18n/en.json';

const DICTS = { vi, ko, en };
const LANG_KEY = 'chang-landing-lang';
const SERVICE_ICONS = ['document', 'box', 'cap'];
const BADGE_ICONS = ['award', 'handshake', 'globe'];
const GALLERY_FILES = [
  { file: 'gallery-1.jpg', tall: true },
  { file: 'gallery-2.jpg', tall: false },
  { file: 'gallery-3.jpg', tall: false },
  { file: 'gallery-4.jpg', tall: true },
  { file: 'gallery-5.jpg', tall: false },
  { file: 'gallery-6.jpg', tall: false }
];

const PLACEHOLDER_LABELS = {
  'ceo-portrait': '/images/ceo-portrait.jpg',
  'about-photo': '/images/about-photo.jpg',
  'kakao-qr': '/images/kakao-qr.png',
  'gallery-1.jpg': '/images/gallery-1.jpg',
  'gallery-2.jpg': '/images/gallery-2.jpg',
  'gallery-3.jpg': '/images/gallery-3.jpg',
  'gallery-4.jpg': '/images/gallery-4.jpg',
  'gallery-5.jpg': '/images/gallery-5.jpg',
  'gallery-6.jpg': '/images/gallery-6.jpg'
};

function getPath(obj, path) {
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
}

function detectInitialLang() {
  const saved = localStorage.getItem(LANG_KEY);
  if (saved && DICTS[saved]) return saved;
  const nav = (navigator.language || 'vi').toLowerCase();
  if (nav.startsWith('ko')) return 'ko';
  if (nav.startsWith('en')) return 'en';
  return 'vi';
}

function injectIcons(root = document) {
  root.querySelectorAll('[data-icon]').forEach((el) => {
    const name = el.getAttribute('data-icon');
    if (icons[name]) el.innerHTML = icons[name];
  });
}

function applyStaticText(dict) {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const value = getPath(dict, key);
    if (typeof value === 'string') el.textContent = value;
  });
}

function renderHeroTitle(dict) {
  const el = document.getElementById('heroTitle');
  if (!el) return;
  el.innerHTML = `${dict.hero.title_pre} <span class="accent">${dict.hero.title_accent}</span>`;
}

function renderHeroBadges(dict) {
  const el = document.getElementById('heroBadges');
  if (!el) return;
  const badges = [dict.hero.badge1, dict.hero.badge2, dict.hero.badge3];
  el.innerHTML = badges
    .map((text, i) => `<span class="hero-badge">${icons[BADGE_ICONS[i]] || ''}<span>${text}</span></span>`)
    .join('');
}

function renderTrust(dict) {
  const el = document.getElementById('trustGrid');
  if (!el) return;
  el.innerHTML = dict.trust.items
    .map((item) => `<div class="trust-item"><strong>${item.value}</strong><span>${item.label}</span></div>`)
    .join('');
}

function renderServices(dict) {
  const el = document.getElementById('servicesGrid');
  if (!el) return;
  el.innerHTML = dict.services.items
    .map((item, i) => `
      <div class="service-card" data-reveal>
        <div class="service-icon">${icons[SERVICE_ICONS[i]] || ''}</div>
        <h3>${item.title}</h3>
        <p>${item.desc}</p>
        <ul class="service-list">
          ${item.list.map((li) => `<li>${icons.check}<span>${li}</span></li>`).join('')}
        </ul>
        <a href="#contact" class="btn btn-outline btn-sm">${item.cta}${icons.arrowRight}</a>
      </div>
    `)
    .join('');
  injectIcons(el);
}

function buildImagePlaceholder(key) {
  const label = PLACEHOLDER_LABELS[key] || key;
  return `${icons.image}<span>${label}</span>`;
}

function showFallback(imgEl) {
  const key = imgEl.parentElement.querySelector('[data-fallback-for]')?.dataset.fallbackFor;
  const ph = imgEl.parentElement.querySelector('.img-ph');
  imgEl.style.display = 'none';
  if (ph) {
    ph.innerHTML = buildImagePlaceholder(key || 'image');
    ph.hidden = false;
  }
}

function attachImageFallback(imgEl) {
  // The 404 may already have happened before this listener attaches (fast local
  // responses can fire `error` before DOMContentLoaded), so check current state too.
  if (imgEl.complete && imgEl.naturalWidth === 0) {
    showFallback(imgEl);
    return;
  }
  imgEl.addEventListener('error', () => showFallback(imgEl), { once: true });
}

function renderGallery(dict) {
  const el = document.getElementById('galleryGrid');
  if (!el) return;
  el.innerHTML = GALLERY_FILES
    .map(({ file, tall }, i) => `
      <div class="gallery-item${tall ? ' tall' : ''}">
        <img class="ph-img" src="/images/${file}" alt="${dict.gallery.captions[i] || ''}" loading="lazy" />
        <div class="img-ph" data-fallback-for="${file}" hidden></div>
        <span class="gallery-caption">${dict.gallery.captions[i] || ''}</span>
      </div>
    `)
    .join('');
  el.querySelectorAll('img.ph-img').forEach(attachImageFallback);
}

function renderSteps(dict) {
  const el = document.getElementById('stepsGrid');
  if (!el) return;
  el.innerHTML = dict.process.steps
    .map((s) => `<div class="step" data-reveal><h4>${s.title}</h4><p>${s.desc}</p></div>`)
    .join('');
}

function renderQuote(dict) {
  const textEl = document.getElementById('quoteText');
  const byEl = document.getElementById('quoteBy');
  if (textEl) textEl.textContent = dict.quote.text;
  if (byEl) byEl.textContent = dict.quote.by;
}

function renderFaq(dict) {
  const el = document.getElementById('faqList');
  if (!el) return;
  el.innerHTML = dict.faq.items
    .map((item, i) => `
      <details class="faq-item"${i === 0 ? ' open' : ''}>
        <summary class="faq-q"><span>${item.q}</span>${icons.chevronDown}</summary>
        <div class="faq-a">${item.a}</div>
      </details>
    `)
    .join('');
}

function updateLangSwitch(lang) {
  document.querySelectorAll('#langSwitch button').forEach((btn) => {
    btn.setAttribute('aria-pressed', String(btn.dataset.lang === lang));
  });
}

function setLang(lang) {
  const dict = DICTS[lang] || DICTS.vi;
  document.documentElement.lang = lang;
  document.body.classList.toggle('lang-ko', lang === 'ko');
  if (dict.meta) {
    document.title = dict.meta.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', dict.meta.description);
  }

  applyStaticText(dict);
  renderHeroTitle(dict);
  renderHeroBadges(dict);
  renderTrust(dict);
  renderServices(dict);
  renderGallery(dict);
  renderSteps(dict);
  renderQuote(dict);
  renderFaq(dict);
  updateLangSwitch(lang);
  injectIcons();
  observeReveals();

  localStorage.setItem(LANG_KEY, lang);
}

function initLangSwitch() {
  document.getElementById('langSwitch')?.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-lang]');
    if (!btn) return;
    setLang(btn.dataset.lang);
  });
}

function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;

  const close = () => {
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = icons.menu;
  };

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.innerHTML = isOpen ? icons.close : icons.menu;
  });

  links.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
}

function initHeaderScroll() {
  const btn = document.getElementById('headerCallBtn');
  const hero = document.getElementById('home');
  if (!btn || !hero) return;
  const threshold = () => hero.offsetHeight * 0.6;
  const onScroll = () => {
    btn.classList.toggle('is-visible', window.scrollY > threshold());
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

let revealObserver = null;

// Language switches replace whole sections via innerHTML (services, gallery,
// steps, faq), which detaches any previously-observed nodes. Re-running this
// after every render (re-)observes anything new; observing an already-tracked
// or already-visible element is a harmless no-op.
function observeReveals() {
  const targets = document.querySelectorAll('[data-reveal]:not(.is-visible)');
  if (targets.length === 0) return;

  if (!('IntersectionObserver' in window)) {
    targets.forEach((t) => t.classList.add('is-visible'));
    return;
  }

  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
  }
  targets.forEach((t) => revealObserver.observe(t));
}

function initImageFallbacks() {
  document.querySelectorAll('img.ph-img').forEach(attachImageFallback);
}

function initKakaoCopy() {
  const btn = document.getElementById('copyKakaoBtn');
  const idText = document.getElementById('kakaoIdText');
  if (!btn || !idText) return;
  btn.addEventListener('click', async () => {
    const value = idText.textContent.trim();
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      /* clipboard unavailable — silently ignore, ID is already visible to copy manually */
    }
    const original = btn.innerHTML;
    btn.innerHTML = icons.checkCircle;
    setTimeout(() => { btn.innerHTML = original; }, 1500);
  });
}

function init() {
  initLangSwitch();
  initMobileNav();
  initHeaderScroll();
  initImageFallbacks();
  initKakaoCopy();
  setLang(detectInitialLang());
}

document.addEventListener('DOMContentLoaded', init);
