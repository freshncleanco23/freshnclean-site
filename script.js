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

  /* ---------- contact form -> Google Forms ---------- */
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

      // Build a hidden form that posts to Google Forms inside an off-screen iframe.
      // This keeps the visitor on our page (Google's CORS won't let fetch() succeed,
      // but a classic form POST to an iframe target works).
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

      // The iframe will fire 'load' once Google responds.
      const onDone = () => {
        status.textContent =
          'Thanks! We got your request — Camryn or Alex will reply within one business day.';
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

      // Safety timeout in case the iframe load never fires (e.g. blocked).
      setTimeout(() => {
        if (submitBtn && submitBtn.disabled) onDone();
      }, 4000);

      ghost.submit();
    });

  /* ---------- service filter chips (YouTube-style) ---------- */
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

  /* ---------- review filter chips ---------- */
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

  /* ---------- scroll-reveal (IntersectionObserver) ---------- */
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

  /* ---------- hero parallax (subtle) ---------- */
  const heroImage = document.querySelector('.hero-cinematic .hero-image');
  if (heroImage) {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce) {
      let ticking = false;
      const onHeroScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          // Move the hero image at ~25% of scroll speed, capped so it never
          // visibly tears below the section bottom.
          const y = Math.min(window.scrollY * 0.25, 180);
          heroImage.style.setProperty('--hero-y', y + 'px');
          ticking = false;
        });
      };
      window.addEventListener('scroll', onHeroScroll, { passive: true });
      onHeroScroll();
    }
  }

  /* ---------- stagger reveal delays for grids ---------- */
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
        // Cap delay so very long grids don't drag
        const delay = Math.min(i * 60, 360);
        child.style.setProperty('--reveal-delay', delay + 'ms');
        if (!child.classList.contains('reveal-child')) {
          child.classList.add('reveal-child');
        }
      });
    });
  });

  /* ---------- before / after slider + project chips ---------- */
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
  };

  function setBaPos(pct) {
    pct = Math.max(0, Math.min(100, pct));
    if (baCompare) baCompare.style.setProperty('--ba-pos', pct + '%');
    if (baHandle) baHandle.setAttribute('aria-valuenow', Math.round(pct));
  }

  if (baCompare && baHandle) {
    setBaPos(50);

    let dragging = false;
    const setFromClientX = (clientX) => {
      const rect = baCompare.getBoundingClientRect();
      const pct = ((clientX - rect.left) / rect.width) * 100;
      setBaPos(pct);
    };

    const onDown = (e) => {
      dragging = true;
      baHandle.setPointerCapture && e.pointerId != null && baHandle.setPointerCapture(e.pointerId);
      setFromClientX(e.clientX);
      e.preventDefault();
    };
    const onMove = (e) => {
      if (!dragging) return;
      setFromClientX(e.clientX);
    };
    const onUp = () => {
      dragging = false;
    };

    baHandle.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);

    // Allow click/tap anywhere on the figure to jump the slider
    baCompare.addEventListener('pointerdown', (e) => {
      if (e.target === baHandle || baHandle.contains(e.target)) return;
      setFromClientX(e.clientX);
    });

    // Keyboard support
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
        // Crossfade swap
        baCompare.classList.add('is-swapping');
        setTimeout(() => {
          baBefore.src = 'images/projects/' + key + '-before.jpg';
          baAfter.src = 'images/projects/' + key + '-after.jpg';
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

  /* ---------- footer year ---------- */
  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();
})();
