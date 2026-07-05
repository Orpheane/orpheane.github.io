/* =====================================================
   Orpheane Portfolio — script.js
   ===================================================== */

'use strict';

// ── THEME TOGGLE ──────────────────────────────────────
const html        = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const iconMoon    = document.getElementById('icon-moon');
const iconSun     = document.getElementById('icon-sun');

let isDark = localStorage.getItem('theme') !== 'light';
applyTheme();

function applyTheme() {
  html.dataset.theme = isDark ? 'dark' : 'light';
  iconMoon.style.display = isDark ? 'block' : 'none';
  iconSun.style.display  = isDark ? 'none'  : 'block';
}

themeToggle.addEventListener('click', () => {
  isDark = !isDark;
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  applyTheme();
});

// ── MOBILE NAV ────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');
const mobileLinks = mobileNav.querySelectorAll('.mobile-nav-link');
let menuOpen = false;

hamburger.addEventListener('click', toggleMenu);

mobileLinks.forEach(link => {
  link.addEventListener('click', () => { if (menuOpen) toggleMenu(); });
});

function toggleMenu() {
  menuOpen = !menuOpen;
  hamburger.classList.toggle('open', menuOpen);
  hamburger.setAttribute('aria-expanded', menuOpen);
  mobileNav.classList.toggle('open', menuOpen);
  mobileNav.setAttribute('aria-hidden', !menuOpen);
  mobileLinks.forEach(link => link.setAttribute('tabindex', menuOpen ? '0' : '-1'));
  document.body.style.overflow = menuOpen ? 'hidden' : '';
}

// ── STICKY HEADER ─────────────────────────────────────
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── CUSTOM CURSOR ─────────────────────────────────────
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.left = mouseX + 'px';
  dot.style.top  = mouseY + 'px';
});

(function animRing() {
  ringX += (mouseX - ringX) * 0.18;
  ringY += (mouseY - ringY) * 0.18;
  ring.style.left = ringX + 'px';
  ring.style.top  = ringY + 'px';
  requestAnimationFrame(animRing);
})();

// Hover state on interactive elements
const interactEls = 'a, button, .project-card, .pillar, .filter-btn';
document.querySelectorAll(interactEls).forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

// ── HERO CANVAS — Aurora Particles ────────────────────
(function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];
  const COLORS = ['#8b5cf6', '#ec4899', '#06b6d4', '#f59e0b', '#a78bfa'];
  const COUNT  = 80;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.r  = Math.random() * 2.5 + 0.5;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.alpha = Math.random() * 0.6 + 0.2;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.life  = Math.random() * 200 + 100;
      this.age   = 0;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.age++;
      if (this.age > this.life || this.x < -10 || this.x > W + 10 || this.y < -10 || this.y > H + 10) {
        this.reset();
      }
    }
    draw() {
      const fade = Math.sin((this.age / this.life) * Math.PI);
      ctx.save();
      ctx.globalAlpha = this.alpha * fade;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur  = 12;
      ctx.fill();
      ctx.restore();
    }
  }

  function buildParticles() {
    particles = Array.from({ length: COUNT }, () => new Particle());
  }

  // Draw aurora blobs
  function drawAurora(t) {
    const blobs = [
      { cx: W * 0.15, cy: H * 0.3, rx: W * 0.35, ry: H * 0.4, color: 'rgba(139,92,246,0.08)' },
      { cx: W * 0.75, cy: H * 0.6, rx: W * 0.4,  ry: H * 0.5, color: 'rgba(236,72,153,0.06)' },
      { cx: W * 0.5,  cy: H * 0.8, rx: W * 0.3,  ry: H * 0.3, color: 'rgba(6,182,212,0.05)'  },
    ];
    blobs.forEach(b => {
      const dx = Math.sin(t * 0.0004 + b.cx) * 30;
      const dy = Math.cos(t * 0.0003 + b.cy) * 20;
      const grd = ctx.createRadialGradient(b.cx + dx, b.cy + dy, 0, b.cx + dx, b.cy + dy, Math.max(b.rx, b.ry));
      grd.addColorStop(0, b.color);
      grd.addColorStop(1, 'transparent');
      ctx.save();
      ctx.scale(1, b.ry / b.rx);
      ctx.beginPath();
      ctx.arc(b.cx + dx, (b.cy + dy) * (b.rx / b.ry), b.rx, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();
      ctx.restore();
    });
  }

  // Draw subtle grid
  function drawGrid() {
    ctx.save();
    ctx.strokeStyle = 'rgba(139,92,246,0.04)';
    ctx.lineWidth = 1;
    const step = 60;
    for (let x = 0; x < W; x += step) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += step) { ctx.beginPath(); moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    ctx.restore();
  }

  let rafId;
  function animate(t = 0) {
    ctx.clearRect(0, 0, W, H);
    drawGrid();
    drawAurora(t);
    particles.forEach(p => { p.update(); p.draw(); });
    rafId = requestAnimationFrame(animate);
  }

  resize();
  buildParticles();
  animate();

  const ro = new ResizeObserver(() => { resize(); buildParticles(); });
  ro.observe(canvas);
})();

// ── HERO SNEAKPEEK SLIDER ─────────────────────────────
(function initHeroSlider() {
  const track = document.getElementById('slider-track');
  const prevBtn = document.querySelector('.slider-btn.prev');
  const nextBtn = document.querySelector('.slider-btn.next');
  if (!track || !prevBtn || !nextBtn) return;

  const items = Array.from(track.children);
  const itemsCount = items.length;
  let currentIndex = 0;

  function updateSlider() {
    const translateVal = -(currentIndex * 33.333);
    track.style.transform = `translateX(${translateVal}%)`;
    
    // Pause all videos when we slide to another item
    items.forEach(item => {
      const video = item.querySelector('video');
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    });
  }

  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + itemsCount) % itemsCount;
    updateSlider();
  });

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % itemsCount;
    updateSlider();
  });

  // Play on hover, pause on mouse leave
  items.forEach(item => {
    const video = item.querySelector('video');
    if (!video) return;

    // Enable pointer-events for the hover area but ignore them on the video itself
    item.style.cursor = 'pointer';

    item.addEventListener('mouseenter', () => {
      video.play().catch(err => console.log("Video play deferred:", err));
    });

    item.addEventListener('mouseleave', () => {
      video.pause();
    });
  });
})();

// ── CONTACT CANVAS — Flowing Lines ────────────────────
(function initContactCanvas() {
  const canvas = document.getElementById('contact-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  const lines = Array.from({ length: 6 }, (_, i) => ({
    offset: i * (Math.PI * 2 / 6),
    amp: 40 + i * 15,
    freq: 0.003 + i * 0.001,
    color: ['#8b5cf6','#ec4899','#06b6d4','#a78bfa','#f472b6','#38bdf8'][i],
  }));

  function draw(t) {
    ctx.clearRect(0, 0, W, H);
    lines.forEach(line => {
      ctx.beginPath();
      for (let x = 0; x <= W; x += 4) {
        const y = H / 2 + Math.sin(x * line.freq + t * 0.0007 + line.offset) * line.amp
                        + Math.sin(x * line.freq * 2 + t * 0.0004 + line.offset * 1.3) * (line.amp * 0.4);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = line.color;
      ctx.lineWidth   = 1.5;
      ctx.globalAlpha = 0.25;
      ctx.stroke();
      ctx.globalAlpha = 1;
    });
  }

  resize();
  let start = null;
  (function raf(t) {
    if (!start) start = t;
    draw(t - start);
    requestAnimationFrame(raf);
  })(0);

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
})();

// ── REVEAL ON SCROLL ──────────────────────────────────
const reveals = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

reveals.forEach(el => revealObs.observe(el));

// ── SKILL BAR ANIMATION ───────────────────────────────
const skillFills = document.querySelectorAll('.skill-fill');
const skillObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animated');
      skillObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

skillFills.forEach(el => skillObs.observe(el));

// ── PROJECT FILTERS ───────────────────────────────────
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    projectCards.forEach(card => {
      const cats = card.dataset.category || '';
      const show = filter === 'all' || cats.includes(filter);
      card.classList.toggle('hidden', !show);
      // Animate in
      if (show) {
        card.style.animation = 'none';
        requestAnimationFrame(() => {
          card.style.animation = '';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        });
      }
    });
  });
});

// ── SMOOTH ANCHOR SCROLL ─────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ── LIGHTBOX ZOOM FUNCTIONALITY ──────────────────────
(function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.querySelector('.lightbox-close');
  const zoomOverlays = document.querySelectorAll('.zoom-icon-overlay');

  if (!lightbox || !lightboxImg || !closeBtn) return;

  zoomOverlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      const card = e.target.closest('.project-card');
      if (!card) return;
      const img = card.querySelector('.project-img-preview');
      if (!img) return;

      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // Stop page scroll
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Restore scroll
  }

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.closest('.lightbox-content') === null) {
      closeLightbox();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) {
      closeLightbox();
    }
  });
})();

// ── COPY DISCORD TO CLIPBOARD ────────────────────────
(function initDiscordCopy() {
  const discordBtn = document.getElementById('discord-btn');
  if (!discordBtn) return;

  const originalHtml = discordBtn.innerHTML;
  let resetTimeout;

  discordBtn.addEventListener('click', () => {
    navigator.clipboard.writeText('Orpheane').then(() => {
      // Temporarily change button content to show feedback
      discordBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m9 16.17 4.59-4.59L12 10.17l-3 3-1.41-1.41L6.17 13.17 9 16.17zm11-11.8L12 12.17l-2.59-2.59L8 10.99l4 4 10-10-1.63-1.62z"/></svg>
        Copied!
      `;
      discordBtn.style.borderColor = 'var(--teal)';
      
      clearTimeout(resetTimeout);
      resetTimeout = setTimeout(() => {
        discordBtn.innerHTML = originalHtml;
        discordBtn.style.borderColor = '';
      }, 2000);
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  });
})();

// ── HERO: trigger reveal immediately ─────────────────
document.querySelectorAll('.hero-section .reveal').forEach(el => {
  setTimeout(() => el.classList.add('visible'), 100);
});
