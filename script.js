(function () {
const themeBtn = document.querySelector('[data-theme-toggle]');
const root = document.documentElement;
const prefersDark = matchMedia('(prefers-color-scheme: dark)').matches;
let theme = prefersDark ? 'dark' : 'light';
root.setAttribute('data-theme', theme);
setThemeIcon();
function setThemeIcon() {
if (!themeBtn) return;
themeBtn.setAttribute(
'aria-label',
'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' mode',
);
themeBtn.innerHTML =
theme === 'dark'
? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
}
themeBtn &&
themeBtn.addEventListener('click', () => {
theme = theme === 'dark' ? 'light' : 'dark';
root.setAttribute('data-theme', theme);
setThemeIcon();
});
const mobileToggle = document.getElementById('mobileToggle');
const mobileNav = document.getElementById('mobileNav');
mobileToggle &&
mobileToggle.addEventListener('click', () => {
const open = mobileNav.classList.toggle('open');
mobileToggle.setAttribute('aria-expanded', open);
mobileToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});
mobileNav &&
mobileNav.querySelectorAll('a').forEach((a) =>
a.addEventListener('click', () => {
mobileNav.classList.remove('open');
mobileToggle.setAttribute('aria-expanded', 'false');
}),
);
const header = document.getElementById('siteHeader');
const onScroll = () => {
header.classList.toggle('scrolled', window.scrollY > 8);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
const chips = document.querySelectorAll('#serviceChips .chip');
const sqftRange = document.getElementById('sqftRange');
const sqftOut = document.getElementById('sqftOut');
const calcAmount = document.getElementById('calcAmount');
const calcDetail = document.getElementById('calcDetail');
const calcNote = document.getElementById('calcNote');
let state = {
rate: 0.25,
min: 325,
name: 'Deep Clean',
sqft: 2000,
};
function fmt(n) {
return n.toLocaleString('en-US');
}
function update() {
const raw = state.sqft * state.rate;
const final = Math.max(raw, state.min);
calcAmount.textContent = fmt(Math.round(final));
calcDetail.textContent = `${state.name} · ${fmt(state.sqft)} sq ft × $${state.rate.toFixed(2)}`;
if (raw < state.min) {
calcNote.style.display = 'inline-block';
calcNote.textContent = `Minimum $${state.min} applies for this service.`;
} else {
calcNote.style.display = 'none';
}
if (sqftRange) {
const pct =
((sqftRange.value - sqftRange.min) / (sqftRange.max - sqftRange.min)) * 100;
sqftRange.style.setProperty('--val', pct + '%');
}
}
chips.forEach((chip) => {
chip.addEventListener('click', () => {
chips.forEach((c) => c.setAttribute('aria-checked', 'false'));
chip.setAttribute('aria-checked', 'true');
state.rate = parseFloat(chip.dataset.rate);
state.min = parseFloat(chip.dataset.min);
state.name = chip.dataset.name;
update();
});
});
sqftRange &&
sqftRange.addEventListener('input', () => {
state.sqft = parseInt(sqftRange.value, 10);
sqftOut.textContent = `${fmt(state.sqft)} sq ft`;
update();
});
update();
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');
const GFORM = {
action:
'https://docs.google.com/forms/d/e/1FAIpQLScZOOHHYmJ2y09BsYZs0gyj9rspguA1n-0Jywb9Ge-mavdSHg/formResponse',
fields: {
name: 'entry.41484401',
phone: 'entry.148578414',
email: 'entry.248603442',
zip: 'entry.1105344650',
service: 'entry.255196046',
notes: 'entry.2108996397',
},
};
form &&
form.addEventListener('submit', (e) => {
e.preventDefault();
const data = new FormData(form);
const name = (data.get('name') || '').toString().trim();
const email = (data.get('email') || '').toString().trim();
if (!name || !email) {
status.textContent = 'Please add your name and email so we can reply.';
status.style.color = 'var(--color-error)';
return;
}
const sink = document.getElementById('quoteFormSink');
const ghost = document.createElement('form');
ghost.action = GFORM.action;
ghost.method = 'POST';
ghost.target = 'quoteFormSink';
ghost.style.display = 'none';
Object.entries(GFORM.fields).forEach(([key, entryId]) => {
const input = document.createElement('input');
input.type = 'hidden';
input.name = entryId;
input.value = (data.get(key) || '').toString();
ghost.appendChild(input);
});
document.body.appendChild(ghost);
const submitBtn = form.querySelector('button[type="submit"]');
if (submitBtn) {
submitBtn.disabled = true;
submitBtn.dataset.label = submitBtn.textContent;
submitBtn.textContent = 'Sending…';
}
status.textContent = '';
const onDone = () => {
status.textContent =
'Thanks! We got your request. Camryn or Alex will reply within one business day.';
status.style.color = 'var(--color-primary)';
form.reset();
if (submitBtn) {
submitBtn.disabled = false;
submitBtn.textContent = submitBtn.dataset.label || 'Send Request';
}
ghost.remove();
sink && sink.removeEventListener('load', onDone);
};
sink && sink.addEventListener('load', onDone);
setTimeout(() => {
if (submitBtn && submitBtn.disabled) onDone();
}, 4000);
ghost.submit();
});
const serviceChipRow = document.querySelector('#services .chip-row');
const serviceCards = document.querySelectorAll('#serviceGrid .service-card');
if (serviceChipRow && serviceCards.length) {
const chips = serviceChipRow.querySelectorAll('.chip[data-filter]');
chips.forEach((chip) => {
chip.addEventListener('click', () => {
chips.forEach((c) => {
c.classList.remove('is-active');
c.setAttribute('aria-selected', 'false');
});
chip.classList.add('is-active');
chip.setAttribute('aria-selected', 'true');
const filter = chip.dataset.filter;
serviceCards.forEach((card) => {
const categories = (card.dataset.category || '').split(/\s+/);
const show = filter === 'all' || categories.includes(filter);
card.classList.toggle('is-hidden', !show);
});
});
});
}
const reviewChipRow = document.querySelector('#testimonials .chip-row');
const reviewCards = document.querySelectorAll('#testimonialGrid .testimonial');
if (reviewChipRow && reviewCards.length) {
const chips = reviewChipRow.querySelectorAll('.chip[data-review-filter]');
chips.forEach((chip) => {
chip.addEventListener('click', () => {
chips.forEach((c) => {
c.classList.remove('is-active');
c.setAttribute('aria-selected', 'false');
});
chip.classList.add('is-active');
chip.setAttribute('aria-selected', 'true');
const filter = chip.dataset.reviewFilter;
reviewCards.forEach((card) => {
const tags = (card.dataset.tags || '').split(/\s+/);
const show = filter === 'all' || tags.includes(filter);
card.classList.toggle('is-hidden', !show);
});
});
});
}
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length && 'IntersectionObserver' in window) {
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduce) {
revealEls.forEach((el) => el.classList.add('is-visible'));
} else {
const io = new IntersectionObserver(
(entries) => {
entries.forEach((entry) => {
if (entry.isIntersecting) {
entry.target.classList.add('is-visible');
io.unobserve(entry.target);
}
});
},
{ threshold: 0.15, rootMargin: '0px 0px -60px 0px' },
);
revealEls.forEach((el) => io.observe(el));
}
} else {
revealEls.forEach((el) => el.classList.add('is-visible'));
}
const heroImage = document.querySelector('.hero-cinematic .hero-image');
if (heroImage) {
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduce) {
let ticking = false;
const onHeroScroll = () => {
if (ticking) return;
ticking = true;
requestAnimationFrame(() => {
const y = Math.min(window.scrollY * 0.25, 180);
heroImage.style.setProperty('--hero-y', y + 'px');
ticking = false;
});
};
window.addEventListener('scroll', onHeroScroll, { passive: true });
onHeroScroll();
}
}
const gridSelectors = [
'.service-grid',
'.testimonial-grid',
'.pricing-table',
'.stats-grid',
'.area-grid',
];
gridSelectors.forEach((sel) => {
document.querySelectorAll(sel).forEach((grid) => {
const children = grid.children;
Array.from(children).forEach((child, i) => {
const delay = Math.min(i * 60, 360);
child.style.setProperty('--reveal-delay', delay + 'ms');
if (!child.classList.contains('reveal-child')) {
child.classList.add('reveal-child');
}
});
});
});
const baCompare = document.getElementById('baCompare');
const baBefore = document.getElementById('baBefore');
const baAfter = document.getElementById('baAfter');
const baHandle = document.getElementById('baHandle');
const baCaption = document.getElementById('baCaption');
const projectChipRow = document.querySelector('#projects .chip-row');
const projectData = {
'kitchen-1': {
title: 'Full kitchen reset',
caption: 'Counters cleared, surfaces degreased, sink scrubbed, floors mopped \u2014 top to bottom in one visit.',
beforeAlt: 'Before: cluttered, dirty kitchen with dishes and food across the counters.',
afterAlt: 'After: clean, organized kitchen with clear counters and polished surfaces.',
},
'sink-1': {
title: 'Kitchen sink restoration',
caption: 'Stains and buildup lifted from a deep porcelain basin \u2014 back to a bright, hygienic white.',
beforeAlt: 'Before: discolored, stained porcelain kitchen sink.',
afterAlt: 'After: bright, spotless porcelain kitchen sink.',
},
'oven-1': {
title: 'Oven deep clean',
caption: 'Burnt-on grease and oven-door film cut down \u2014 racks scrubbed, glass cleared, interior wiped.',
beforeAlt: 'Before: oven interior with burnt residue and a clouded glass door.',
afterAlt: 'After: clean oven racks and a clear, see-through glass door.',
},
'oven-2': {
title: 'Stovetop &amp; oven detail',
caption: 'Glass cooktop polished, oven interior degreased, door clarified \u2014 a full range refresh.',
beforeAlt: 'Before: stovetop covered in burnt-on residue with a dirty oven interior.',
afterAlt: 'After: streak-free glass cooktop and a clean, fresh oven interior.',
},
'shower-1': {
title: 'Shower &amp; glass restoration',
caption: 'Hard-water film, soap scum, and mineral spots cleared from glass, tile, and stone.',
beforeAlt: 'Before: shower glass clouded with hard-water spots and soap scum.',
afterAlt: 'After: crystal-clear shower glass with bright marble tile.',
},
'toilet-1': {
title: 'Family bath toilet detail',
caption: 'Bowl, seat, base, and surrounding floor sanitized \u2014 safe for kids and ready for guests.',
beforeAlt: 'Before: family bathroom toilet with stained bowl and dust around the base.',
afterAlt: 'After: spotless white toilet, sanitized seat, clean surrounding floor.',
},
'toilet-2': {
title: 'Powder room reset',
caption: 'Rust and water-line stains lifted from the bowl, exterior polished, hardwood wiped down.',
beforeAlt: 'Before: powder-room toilet bowl with rust and water-line staining.',
afterAlt: 'After: bright, fully cleaned powder-room toilet on hardwood floor.',
},
'laundry-1': {
title: 'Laundry room rescue',
caption: 'Piles of clothes sorted, washed, and folded into baskets \u2014 floors cleared and ready for life again.',
beforeAlt: 'Before: laundry piled across the floor in a dimly lit room.',
afterAlt: 'After: clothes folded into neatly arranged baskets on a clean carpet.',
},
'playroom-1': {
title: 'Playroom reset',
caption: 'Toys cleared, carpet vacuumed, rug straightened \u2014 back to a calm, livable family space.',
beforeAlt: 'Before: playroom carpet with scattered toys and a crumpled rug.',
afterAlt: 'After: tidy playroom with rug straightened and carpet freshly vacuumed.',
},
'fridge-1': {
title: 'Stainless fridge polish',
caption: 'Fingerprints and smudges cut from front and drawer \u2014 clean, streak-free finish.',
beforeAlt: 'Before: stainless steel refrigerator covered in fingerprints and smudges.',
afterAlt: 'After: streak-free stainless steel refrigerator with a clean, polished finish.',
},
'floor-1': {
title: 'Granite floor restoration',
caption: 'Black tile floor stripped of haze and film \u2014 back to a deep mirror shine.',
beforeAlt: 'Before: dark tile floor dulled by haze and film.',
afterAlt: 'After: deep, glossy black tile floor with a mirror shine.',
},
'garage-1': {
title: 'Garage clear-out',
caption: 'Boxes, tools, and yard gear sorted and stowed \u2014 concrete bay swept and walkable again.',
beforeAlt: 'Before: garage bay cluttered with boxes, tools, and yard gear.',
afterAlt: 'After: organized garage with a swept concrete floor and gear neatly stowed.',
},
'bedroom-1': {
title: 'Bedroom reset',
caption: 'Bed made, pillows fluffed, clothes cleared, carpet vacuumed \u2014 a calm room to come home to.',
beforeAlt: 'Before: messy bedroom with unmade bed and clothes scattered around.',
afterAlt: 'After: tidy bedroom with a neatly made bed and a vacuumed carpet.',
},
'blinds-1': {
title: 'Window blinds detail',
caption: 'Blade-by-blade dusting and wipe \u2014 from grey and grimy back to bright white.',
beforeAlt: 'Before: dusty grey window blinds caked with grime.',
afterAlt: 'After: clean, bright white window blinds with each blade wiped down.',
},
'cabinet-1': {
title: 'Under-sink reset (bath)',
caption: 'Jumbled bottles and bags organized into baskets and stackable drawers.',
beforeAlt: 'Before: bathroom under-sink cabinet crammed with jumbled bottles and bags.',
afterAlt: 'After: bathroom under-sink cabinet organized into baskets and stackable drawers.',
},
'cabinet-2': {
title: 'Under-sink reset (vanity)',
caption: 'Tangled tools and toiletries staged on tiered shelves with clear bins.',
beforeAlt: 'Before: vanity under-sink cabinet with tangled tools and toiletries piled together.',
afterAlt: 'After: vanity under-sink cabinet staged on tiered shelves with clear bins.',
},
'cabinet-3': {
title: 'Storage cabinet declutter',
caption: 'Pile of bags, boxes, and cords cleared out \u2014 clean shelves, a few essentials.',
beforeAlt: 'Before: storage cabinet stuffed with bags, boxes, and tangled cords.',
afterAlt: 'After: storage cabinet with clean shelves and only a few essentials remaining.',
},
'dresser-1': {
title: 'Armoire fold &amp; stack',
caption: 'Clothes pulled, sorted, and folded into clean stacks \u2014 drawers usable again.',
beforeAlt: 'Before: armoire drawers overflowing with unsorted clothing.',
afterAlt: 'After: armoire drawers with clothes folded into clean, organized stacks.',
},
};
function setBaPos(pct) {
pct = Math.max(0, Math.min(100, pct));
if (baCompare) baCompare.style.setProperty('--ba-pos', pct + '%');
if (baHandle) baHandle.setAttribute('aria-valuenow', Math.round(pct));
}
if (baCompare && baHandle) {
setBaPos(50);
let dragging = false;
let touchActive = false; // when true, ignore pointer events (touch is authoritative on iOS)
let rafId = 0;
let pendingX = null;
const applyPending = () => {
rafId = 0;
if (pendingX == null) return;
const rect = baCompare.getBoundingClientRect();
const pct = ((pendingX - rect.left) / rect.width) * 100;
setBaPos(pct);
pendingX = null;
};
const scheduleFromX = (clientX) => {
pendingX = clientX;
if (!rafId) rafId = requestAnimationFrame(applyPending);
};
// Pointer events (desktop + non-iOS mobile)
const onDown = (e) => {
if (touchActive) return;
dragging = true;
try { baHandle.setPointerCapture && e.pointerId != null && baHandle.setPointerCapture(e.pointerId); } catch(_) {}
scheduleFromX(e.clientX);
if (e.cancelable) e.preventDefault();
};
const onMove = (e) => {
if (!dragging || touchActive) return;
scheduleFromX(e.clientX);
if (e.cancelable) e.preventDefault();
};
const onUp = () => { if (!touchActive) dragging = false; };
baHandle.addEventListener('pointerdown', onDown);
window.addEventListener('pointermove', onMove, { passive: false });
window.addEventListener('pointerup', onUp);
window.addEventListener('pointercancel', onUp);
baCompare.addEventListener('pointerdown', (e) => {
if (touchActive) return;
if (e.target === baHandle || baHandle.contains(e.target)) return;
scheduleFromX(e.clientX);
});
// Explicit touch handlers for iOS Safari. On iOS, both touch and (synthetic) pointer
// events fire for the same gesture — we mark touchActive to make touch authoritative
// and suppress the duplicate pointer path that causes jumpy updates.
const getTouchX = (e) => {
const t = e.touches && e.touches[0] ? e.touches[0] : (e.changedTouches && e.changedTouches[0]);
return t ? t.clientX : 0;
};
const onTouchStart = (e) => {
touchActive = true;
dragging = true;
scheduleFromX(getTouchX(e));
if (e.cancelable) e.preventDefault();
};
const onTouchMove = (e) => {
if (!dragging) return;
scheduleFromX(getTouchX(e));
if (e.cancelable) e.preventDefault();
};
const onTouchEnd = () => {
dragging = false;
// Release touchActive on the next frame so trailing synthetic pointer events
// (which fire after touchend on iOS) don't reset the position.
setTimeout(() => { touchActive = false; }, 300);
};
baHandle.addEventListener('touchstart', onTouchStart, { passive: false });
baHandle.addEventListener('touchmove', onTouchMove, { passive: false });
baHandle.addEventListener('touchend', onTouchEnd);
baHandle.addEventListener('touchcancel', onTouchEnd);
baCompare.addEventListener('touchstart', (e) => {
if (e.target === baHandle || baHandle.contains(e.target)) return;
touchActive = true;
dragging = true;
scheduleFromX(getTouchX(e));
if (e.cancelable) e.preventDefault();
}, { passive: false });
baCompare.addEventListener('touchmove', onTouchMove, { passive: false });
baCompare.addEventListener('touchend', onTouchEnd);
baCompare.addEventListener('touchcancel', onTouchEnd);
baHandle.addEventListener('keydown', (e) => {
const current = parseFloat(
getComputedStyle(baCompare).getPropertyValue('--ba-pos'),
) || 50;
let next = current;
switch (e.key) {
case 'ArrowLeft':
case 'ArrowDown':
next = current - 2;
break;
case 'ArrowRight':
case 'ArrowUp':
next = current + 2;
break;
case 'Home':
next = 0;
break;
case 'End':
next = 100;
break;
case 'PageDown':
next = current - 10;
break;
case 'PageUp':
next = current + 10;
break;
default:
return;
}
e.preventDefault();
setBaPos(next);
});
}
if (projectChipRow && baBefore && baAfter && baCaption) {
const projectChips = projectChipRow.querySelectorAll('.chip[data-project]');
projectChips.forEach((chip) => {
chip.addEventListener('click', () => {
const key = chip.dataset.project;
const data = projectData[key];
if (!data) return;
projectChips.forEach((c) => {
c.classList.remove('is-active');
c.setAttribute('aria-selected', 'false');
});
chip.classList.add('is-active');
chip.setAttribute('aria-selected', 'true');
baCompare.classList.add('is-swapping');
setTimeout(() => {
const baseBefore = 'images/projects/' + key + '-before';
const baseAfter = 'images/projects/' + key + '-after';
baBefore.srcset = baseBefore + '-sm.webp 720w, ' + baseBefore + '.webp 1080w';
baAfter.srcset = baseAfter + '-sm.webp 720w, ' + baseAfter + '.webp 1080w';
baBefore.sizes = '(max-width: 900px) 90vw, 600px';
baAfter.sizes = '(max-width: 900px) 90vw, 600px';
baBefore.src = baseBefore + '-sm.webp';
baAfter.src = baseAfter + '-sm.webp';
baBefore.alt = data.beforeAlt;
baAfter.alt = data.afterAlt;
baCaption.innerHTML =
'<strong>' + data.title + '</strong> \u00b7 ' + data.caption;
setBaPos(50);
requestAnimationFrame(() => {
baCompare.classList.remove('is-swapping');
});
}, 180);
});
});
}
const yr = document.getElementById('year');
if (yr) yr.textContent = new Date().getFullYear();
function scrollToHash() {
const hash = window.location.hash;
if (!hash || hash.length < 2) return;
const el = document.querySelector(hash);
if (!el) return;
el.scrollIntoView({ behavior: 'auto', block: 'start' });
}
function settleScrollToHash() {
const hash = window.location.hash;
if (!hash || hash.length < 2) return;
const HEADER_OFFSET = 96;
const docEl = document.documentElement;
const prevBehavior = docEl.style.scrollBehavior;
docEl.style.scrollBehavior = 'auto';
let last = -1;
let stableCount = 0;
let tries = 0;
const tick = () => {
const el = document.querySelector(hash);
if (!el) {
docEl.style.scrollBehavior = prevBehavior;
return;
}
const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
if (Math.abs(top - last) < 1) {
stableCount++;
} else {
stableCount = 0;
}
last = top;
window.scrollTo(0, top);
tries++;
if (stableCount < 3 && tries < 25) {
setTimeout(tick, 150);
} else {
docEl.style.scrollBehavior = prevBehavior;
}
};
tick();
}
if (window.location.hash) {
window.addEventListener('load', settleScrollToHash);
}
window.addEventListener('hashchange', () => {
setTimeout(settleScrollToHash, 50);
});
})();
(function initVideoGallery() {
const frames = document.querySelectorAll('.video-frame');
if (!frames.length) return;
const hydrate = (video, { withSource = false } = {}) => {
if (!video) return;
const posterUrl = video.dataset.poster;
if (posterUrl && !video.poster) {
video.poster = posterUrl;
}
if (withSource) {
const srcUrl = video.dataset.src;
if (srcUrl && !video.querySelector('source')) {
const source = document.createElement('source');
source.src = srcUrl;
source.type = 'video/mp4';
video.appendChild(source);
}
}
};
const posterObserver = ('IntersectionObserver' in window)
? new IntersectionObserver((entries, obs) => {
entries.forEach((entry) => {
if (entry.isIntersecting) {
const video = entry.target.querySelector('.video-player');
hydrate(video, { withSource: false });
obs.unobserve(entry.target);
}
});
}, { rootMargin: '1500px 0px', threshold: 0 })
: null;
const sourceObserver = ('IntersectionObserver' in window)
? new IntersectionObserver((entries, obs) => {
entries.forEach((entry) => {
if (entry.isIntersecting) {
const video = entry.target.querySelector('.video-player');
hydrate(video, { withSource: true });
obs.unobserve(entry.target);
}
});
}, { rootMargin: '200px 0px', threshold: 0.01 })
: null;
frames.forEach((frame) => {
const video = frame.querySelector('.video-player');
const playBtn = frame.querySelector('.video-play');
if (!video || !playBtn) return;
if (posterObserver && sourceObserver) {
posterObserver.observe(frame);
sourceObserver.observe(frame);
} else {
hydrate(video, { withSource: true });
}
const startPlayback = () => {
hydrate(video, { withSource: true });
if (video.readyState === 0) {
try { video.load(); } catch (_) { }
}
document.querySelectorAll('.video-player').forEach((v) => {
if (v !== video && !v.paused) {
v.pause();
v.closest('.video-frame')?.classList.remove('is-playing');
}
});
const playPromise = video.play();
if (playPromise && typeof playPromise.catch === 'function') {
playPromise.catch(() => {
});
}
frame.classList.add('is-playing');
};
playBtn.addEventListener('click', (e) => {
e.preventDefault();
startPlayback();
});
video.addEventListener('play', () => frame.classList.add('is-playing'));
video.addEventListener('pause', () => frame.classList.remove('is-playing'));
video.addEventListener('ended', () => frame.classList.remove('is-playing'));
});
})();
(function initVideoCarousel() {
const carousel = document.querySelector('[data-video-carousel]');
if (!carousel) return;
const track = carousel.querySelector('[data-carousel-track]');
const prevBtn = carousel.querySelector('[data-carousel-prev]');
const nextBtn = carousel.querySelector('[data-carousel-next]');
const dotsHost = carousel.querySelector('[data-carousel-dots]');
if (!track || !dotsHost) return;
const cards = Array.from(track.querySelectorAll('.video-card'));
if (!cards.length) return;
const dots = cards.map((card, i) => {
const dot = document.createElement('button');
dot.type = 'button';
dot.className = 'video-carousel-dot';
dot.setAttribute('role', 'tab');
dot.setAttribute('aria-label', `Go to video ${i + 1}`);
dot.dataset.index = String(i);
dot.addEventListener('click', () => scrollToIndex(i));
dotsHost.appendChild(dot);
return dot;
});
const scrollToIndex = (i) => {
const target = cards[i];
if (!target) return;
const offset = target.offsetLeft - track.offsetLeft;
track.scrollTo({ left: offset, behavior: 'smooth' });
};
const computeActiveIndex = () => {
const scrollLeft = track.scrollLeft;
let bestIdx = 0;
let bestDist = Infinity;
cards.forEach((card, i) => {
const cardLeft = card.offsetLeft - track.offsetLeft;
const dist = Math.abs(cardLeft - scrollLeft);
if (dist < bestDist) {
bestDist = dist;
bestIdx = i;
}
});
return bestIdx;
};
const TOL = 8;
const updateArrows = () => {
if (!prevBtn || !nextBtn) return;
const maxScroll = track.scrollWidth - track.clientWidth;
const atStart = track.scrollLeft <= TOL;
const atEnd = track.scrollLeft >= maxScroll - TOL;
prevBtn.classList.toggle('is-disabled', atStart);
prevBtn.setAttribute('aria-disabled', atStart ? 'true' : 'false');
nextBtn.classList.toggle('is-disabled', atEnd);
nextBtn.setAttribute('aria-disabled', atEnd ? 'true' : 'false');
const noScroll = maxScroll < TOL;
prevBtn.style.display = noScroll ? 'none' : '';
nextBtn.style.display = noScroll ? 'none' : '';
if (dotsHost) dotsHost.style.display = noScroll ? 'none' : '';
};
const updateDots = () => {
const active = computeActiveIndex();
dots.forEach((dot, i) => {
const isActive = i === active;
dot.classList.toggle('is-active', isActive);
dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
});
};
const refresh = () => { updateDots(); updateArrows(); };
const cardStep = () => {
if (cards.length < 2) return cards[0]?.getBoundingClientRect().width || 300;
return cards[1].offsetLeft - cards[0].offsetLeft;
};
prevBtn?.addEventListener('click', () => {
track.scrollBy({ left: -cardStep(), behavior: 'smooth' });
});
nextBtn?.addEventListener('click', () => {
track.scrollBy({ left: cardStep(), behavior: 'smooth' });
});
track.addEventListener('keydown', (e) => {
if (e.key === 'ArrowRight') { e.preventDefault(); track.scrollBy({ left: cardStep(), behavior: 'smooth' }); }
else if (e.key === 'ArrowLeft') { e.preventDefault(); track.scrollBy({ left: -cardStep(), behavior: 'smooth' }); }
else if (e.key === 'Home') { e.preventDefault(); scrollToIndex(0); }
else if (e.key === 'End') { e.preventDefault(); scrollToIndex(cards.length - 1); }
});
let scrollRaf = 0;
track.addEventListener('scroll', () => {
if (scrollRaf) return;
scrollRaf = requestAnimationFrame(() => { scrollRaf = 0; refresh(); });
}, { passive: true });
let resizeRaf = 0;
window.addEventListener('resize', () => {
if (resizeRaf) return;
resizeRaf = requestAnimationFrame(() => { resizeRaf = 0; refresh(); });
});
refresh();
})();
(function initBaLazy() {
var baBefore = document.getElementById('baBefore');
var baAfter = document.getElementById('baAfter');
if (!baBefore || !baAfter) return;
function hydrate(img) {
if (img.dataset.hydrated === '1') return;
if (img.dataset.srcset) img.srcset = img.dataset.srcset;
if (img.dataset.sizes) img.sizes = img.dataset.sizes;
if (img.dataset.src) img.src = img.dataset.src;
img.dataset.hydrated = '1';
}
var stage = document.getElementById('baStage') || baBefore.parentElement;
if ('IntersectionObserver' in window) {
var io = new IntersectionObserver(function (entries, obs) {
entries.forEach(function (entry) {
if (entry.isIntersecting) {
hydrate(baBefore);
hydrate(baAfter);
obs.disconnect();
}
});
}, { rootMargin: '600px 0px' });
io.observe(stage);
} else {
hydrate(baBefore);
hydrate(baAfter);
}
})();