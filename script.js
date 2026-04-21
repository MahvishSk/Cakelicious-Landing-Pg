/* ═══════════════════════════════════════════════════════════
   CAKELICIOUS — landing.js
   BASE URL of main website:
   https://mahvishsk.github.io/Cakelicious-Ecommerce-Frontend/
   ───────────────────────────────────────────────────────────
   Features:
   1.  Navbar scroll effect
   2.  Hamburger mobile menu
   3.  Countdown timer
   4.  Typewriter effect
   5.  Scroll reveal (IntersectionObserver)
   6.  Testimonial slider (auto + manual + dots + swipe)
   7.  Add to Cart → navigates to products page
   8.  Copy promo code (clipboard)
   9.  Newsletter subscribe (email validation)
   10. Scroll to top button
   11. Smooth scroll for anchor links (#id)
═══════════════════════════════════════════════════════════ */

/* ─── WEBSITE BASE URL ─── */
const SITE = 'https://mahvishsk.github.io/Cakelicious-Ecommerce-Frontend/';

/* Page URLs — used throughout */
const PAGES = {
  home:     SITE + 'index.html',
  products: SITE + 'products.html',
  delivery: SITE + 'delivery.html',
  dineIn:   SITE + 'dine-in.html',
  catering: SITE + 'catering.html',
  gallery:  SITE + 'gallary.html',
  blogs:    SITE + 'blogs.html',
  faq:      SITE + 'faq.html',
  login:    SITE + 'login.html',
  terms:    SITE + 'terms&condition.html',
  privacy:  SITE + 'privacy.html',
};


/* ═══════════════════════════════════════
   1. NAVBAR — scroll effect
═══════════════════════════════════════ */
const navbar    = document.getElementById('navbar');
const scrollBtn = document.getElementById('scrollTopBtn');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 50);
  scrollBtn.classList.toggle('visible', y > 400);
});


/* ═══════════════════════════════════════
   2. HAMBURGER — mobile menu toggle
═══════════════════════════════════════ */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});


/* ═══════════════════════════════════════
   3. COUNTDOWN TIMER
   Counts down to midnight (end of day)
═══════════════════════════════════════ */
const countdownEl = document.getElementById('countdown');

function updateCountdown() {
  const now      = new Date();
  const midnight = new Date(now);
  midnight.setHours(23, 59, 59, 999);

  const diff = midnight - now;
  const hh   = String(Math.floor(diff / 3_600_000)).padStart(2, '0');
  const mm   = String(Math.floor((diff % 3_600_000) / 60_000)).padStart(2, '0');
  const ss   = String(Math.floor((diff % 60_000) / 1000)).padStart(2, '0');

  if (countdownEl) countdownEl.textContent = `${hh}:${mm}:${ss}`;
}

updateCountdown();
setInterval(updateCountdown, 1000);


/* ═══════════════════════════════════════
   4. TYPEWRITER EFFECT
═══════════════════════════════════════ */
const phrases = [
  'Fresh Baked. Made with Love. 🍰',
  'Custom Cakes for Every Occasion! 🎂',
  'Same Day Delivery Available! 🚚',
  'Over 50 Delicious Flavors Await! 🍓',
];

const typeEl   = document.getElementById('typewriter');
let phraseIdx  = 0;
let charIdx    = 0;
let deleting   = false;

function typeWriter() {
  if (!typeEl) return;

  const phrase = phrases[phraseIdx];

  typeEl.textContent = deleting
    ? phrase.substring(0, charIdx--)
    : phrase.substring(0, charIdx++);

  if (!deleting && charIdx > phrase.length) {
    deleting = true;
    setTimeout(typeWriter, 1800);
    return;
  }

  if (deleting && charIdx < 0) {
    deleting  = false;
    charIdx   = 0;
    phraseIdx = (phraseIdx + 1) % phrases.length;
  }

  setTimeout(typeWriter, deleting ? 36 : 76);
}

typeWriter();


/* ═══════════════════════════════════════
   5. SCROLL REVEAL — IntersectionObserver
═══════════════════════════════════════ */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
    const delay    = siblings.indexOf(entry.target) * 100;

    setTimeout(() => entry.target.classList.add('visible'), delay);
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));


/* ═══════════════════════════════════════
   6. TESTIMONIAL SLIDER
   Auto + manual + dots + touch swipe
═══════════════════════════════════════ */
const track   = document.getElementById('sliderTrack');
const dotsEl  = document.getElementById('slideDots');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let currentIdx = 0;
let autoTimer  = null;

const getCards = () => [...track.querySelectorAll('.review-card')];

function cardsVisible() {
  if (window.innerWidth < 580) return 1;
  if (window.innerWidth < 960) return 2;
  return 3;
}

const maxIdx = () => Math.max(0, getCards().length - cardsVisible());

function buildDots() {
  dotsEl.innerHTML = '';
  for (let i = 0; i <= maxIdx(); i++) {
    const d = document.createElement('div');
    d.className = 'dot' + (i === currentIdx ? ' active' : '');
    d.addEventListener('click', () => slideTo(i));
    dotsEl.appendChild(d);
  }
}

function updateDots() {
  dotsEl.querySelectorAll('.dot').forEach((d, i) =>
    d.classList.toggle('active', i === currentIdx)
  );
}

function slideTo(idx) {
  currentIdx = Math.max(0, Math.min(idx, maxIdx()));
  const cards = getCards();
  const cardW = cards[0].offsetWidth + 20;
  track.style.transform = `translateX(-${currentIdx * cardW}px)`;
  updateDots();
}

const slideNext = () => slideTo(currentIdx < maxIdx() ? currentIdx + 1 : 0);
const slidePrev = () => slideTo(currentIdx > 0 ? currentIdx - 1 : maxIdx());

const startAuto = () => { stopAuto(); autoTimer = setInterval(slideNext, 4000); };
const stopAuto  = () => { clearInterval(autoTimer); autoTimer = null; };

buildDots();
startAuto();

prevBtn.addEventListener('click', () => { slidePrev(); stopAuto(); startAuto(); });
nextBtn.addEventListener('click', () => { slideNext(); stopAuto(); startAuto(); });
track.addEventListener('mouseenter', stopAuto);
track.addEventListener('mouseleave', startAuto);

// Touch swipe
let touchStart = 0;
track.addEventListener('touchstart', e => { touchStart = e.touches[0].clientX; }, { passive: true });
track.addEventListener('touchend', e => {
  const diff = touchStart - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 40) {
    diff > 0 ? slideNext() : slidePrev();
    stopAuto(); startAuto();
  }
}, { passive: true });

// Recalculate on resize
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => { currentIdx = 0; buildDots(); slideTo(0); }, 220);
});


/* ═══════════════════════════════════════
   7. ADD TO CART
   Shows "Going to Shop →" then navigates
   to the main site Products page
═══════════════════════════════════════ */
function goToProducts() {
  /* No actual cart here — redirect to real products page */
  window.location.href = PAGES.products;
}


/* ═══════════════════════════════════════
   8. COPY PROMO CODE
═══════════════════════════════════════ */
function copyPromoCode() {
  const promoBox = document.getElementById('promoBox');

  const showCopied = () => {
    promoBox.classList.add('show-copied');
    setTimeout(() => promoBox.classList.remove('show-copied'), 2500);
  };

  if (navigator.clipboard) {
    navigator.clipboard.writeText('CAKE30')
      .then(showCopied)
      .catch(() => { fallbackCopy('CAKE30'); showCopied(); });
  } else {
    fallbackCopy('CAKE30');
    showCopied();
  }
}

function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
  document.body.appendChild(ta);
  ta.focus(); ta.select();
  try { document.execCommand('copy'); } catch (_) {}
  document.body.removeChild(ta);
}


/* ═══════════════════════════════════════
   9. NEWSLETTER SUBSCRIBE
═══════════════════════════════════════ */
function handleSubscribe() {
  const input   = document.getElementById('emailInput');
  const success = document.getElementById('subSuccess');
  const val     = input.value.trim();

  if (!val || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
    input.style.outline = '2px solid #E75480';
    input.placeholder   = 'Please enter a valid email!';
    setTimeout(() => {
      input.style.outline = '';
      input.placeholder   = 'Enter your email address...';
    }, 2800);
    return;
  }

  input.value           = '';
  success.style.display = 'block';
  setTimeout(() => { success.style.display = 'none'; }, 5000);
}

const emailInput = document.getElementById('emailInput');
if (emailInput) {
  emailInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleSubscribe();
  });
}


/* ═══════════════════════════════════════
   10. SCROLL TO TOP
   Button uses onclick in HTML — visibility
   handled by the scroll listener in step 1
═══════════════════════════════════════ */
// Nothing extra needed here.


/* ═══════════════════════════════════════
   11. SMOOTH SCROLL — anchor links (#id)
═══════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const id     = anchor.getAttribute('href');
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});