# Portfolio website

Jonathan Reed's portfolio site (jonathanreed.me), served with GitHub Pages.

Plain HTML, CSS and JavaScript. No build step.

## Structure

```
index.html                    Home: header and the project list
about/index.html              About page
<project>/index.html          One folder per project (eurostar, center-parcs, eafc,
                              riot-games, sendwave, the-fork, hello-fresh, fresha,
                              mind, alan, molton-brown) plus more/
about-me-1/index.html         Redirect from the previous About page address to about/
assets/css/styles.css         Styles
assets/js/main.js             Slideshows and the image viewer (lightbox)
assets/media/<page>/          Images and videos for each page
assets/fonts/                 Inter (stand-in for Diatype) and VCR OSD Mono
assets/icons/                 Phosphor icons (MIT licence) for the header and project list
assets/images/                Favicon, Apple touch icon, link preview image
.github/workflows/pages.yml   Deploys the site to GitHub Pages on every push to main
```

Every page repeats the same header and project list. To add a project, copy an
existing project folder, change its content, and add a link to it in the
`site-footer` project list on every page.

## Page building blocks

- `div.cols` with `div.col` children: a row of columns. Each column's width is
  set with `style="--span:N"` (12 in total). Columns stack on phones unless the
  row has the `cols--no-stack` class.
- `div.gallery`: one or more images in a row at the same height.
- `div.slideshow`: images that crossfade. `data-delay` sets the seconds per
  image, `data-shuffle` randomises the order, `data-pause-on-hover` pauses on
  hover. The height follows the tallest image unless `style="--height:…"` sets
  a fixed height.
- Images wrapped in `<a href="…" data-zoom>` open full screen when clicked.
- Images over 1400 px wide have a `-1200` copy for phones, listed in `srcset`.

## Fonts

Headings and body text use Inter (SIL Open Font License, see
`assets/fonts/Inter-LICENSE.txt`). The header and navigation use VCR OSD Mono
by Riciery Leal, from dafont (see `assets/fonts/VCR-OSD-Mono-LICENSE.txt`). To switch to Diatype after buying a web licence from ABC
Dinamo, add its WOFF2 files to `assets/fonts/`, replace the two Inter
`@font-face` rules in `assets/css/styles.css`, and change `--font-sans`.

## Local preview

```
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Deployment

One-time setup: repository Settings → Pages → Build and deployment → Source:
**GitHub Actions**. After that, every push to `main` publishes the site.

The workflow publishes everything in the repository except dotfiles and this
README. Reference the stylesheet and script with a `?v=dev` suffix; each deploy
replaces `?v=dev` with the commit SHA so browsers and CDN caches fetch the new
files.

To serve the site at jonathanreed.me, set the custom domain under Settings →
Pages and point the domain's DNS at GitHub Pages.

## Analytics

The site uses Cloudflare Web Analytics (no cookies, no individual visitor
tracking). The snippet below sits immediately before `</body>` in every HTML page:

```html
<!-- Cloudflare Web Analytics --><script type='module' src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "20a8a993c7c740b4acc0a126cea4087b"}'></script><!-- End Cloudflare Web Analytics -->
```

The token only accepts page views from the hostname registered for it in the
Cloudflare dashboard (Analytics & Logs → Web Analytics). If the site's domain
changes, update the hostname there.
