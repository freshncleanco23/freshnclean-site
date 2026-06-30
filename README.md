# Fresh N Clean

Marketing website for **Fresh N Clean LLC**: residential and commercial cleaning across North Georgia and Metro Atlanta.

## Hosting

Hosted on GitHub Pages from the `main` branch of [freshncleanco23/freshncleanco23.github.io](https://github.com/freshncleanco23).

## Local Preview

This is a static site. Open `index.html` directly in your browser, or run:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Editing Content

All copy lives in `index.html`. Common edits:

- **Pricing rates**: search for `data-rate` in `index.html` (calculator) and the `.pricing-row` blocks (table).
- **Service area**: `<ul class="area-grid">`.
- **Testimonials**: `<section id="testimonials">`.
- **Contact phone / email**: `<section id="contact">`.

Push to `main` and GitHub Pages will redeploy in ~30 seconds.

## Files

```
index.html   : page content
style.css    : styles, light + dark mode
script.js    : calculator, theme toggle, mobile nav, form handler
```
