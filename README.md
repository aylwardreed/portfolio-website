# Portfolio website

Portfolio site, served with GitHub Pages.

Plain HTML, CSS and JavaScript. No build step.

## Structure

```
index.html                    Page markup
assets/css/styles.css         Styles
assets/js/main.js             Scripts
assets/images/                Images
.github/workflows/pages.yml   Deploys the site to GitHub Pages on every push to main
```

## Local preview

```
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Deployment

One-time setup: repository Settings → Pages → Build and deployment → Source:
**GitHub Actions**. After that, every push to `main` publishes the site.

The workflow publishes `index.html`, `assets/` and `.nojekyll`. Reference the
stylesheet and script as `assets/css/styles.css?v=dev` and
`assets/js/main.js?v=dev`; each deploy replaces `?v=dev` with the commit SHA so
browsers and CDN caches fetch the new files.

## Analytics

The site uses Cloudflare Web Analytics (no cookies, no individual visitor
tracking). Place this snippet immediately before `</body>` in every HTML page:

```html
<!-- Cloudflare Web Analytics --><script type='module' src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "20a8a993c7c740b4acc0a126cea4087b"}'></script><!-- End Cloudflare Web Analytics -->
```

The token only accepts page views from the hostname registered for it in the
Cloudflare dashboard (Analytics & Logs → Web Analytics). If the site's domain
changes, update the hostname there.
