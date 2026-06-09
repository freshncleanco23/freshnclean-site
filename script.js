/* ============================================================
   Fresh N Clean — site script
   - theme toggle (light/dark)
   - mobile nav
   - sticky header shadow
   - pricing calculator
   - contact form (mailto fallback)
   ============================================================ */

(function () {
  /* ---------- theme toggle ---------- */
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

  /* ---------- mobile nav ---------- */
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

  /* ---------- sticky header shadow ---------- */
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- pricing calculator ---------- */
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
    // slider fill
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

  /* ---------- contact form (mailto fallback) ---------- */
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
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
      const body = [
        `Name: ${name}`,
        `Phone: ${data.get('phone') || ''}`,
        `Email: ${email}`,
        `City / Zip: ${data.get('zip') || ''}`,
        `Service: ${data.get('service') || ''}`,
        ``,
        `${data.get('notes') || ''}`,
      ].join('\n');
      const mailto = `mailto:freshncleanco23@gmail.com?subject=${encodeURIComponent(
        'Quote request from ' + name,
      )}&body=${encodeURIComponent(body)}`;
      status.textContent = 'Opening your email — we usually reply within a day.';
      status.style.color = 'var(--color-primary)';
      window.location.href = mailto;
    });

  /* ---------- footer year ---------- */
  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();
})();
