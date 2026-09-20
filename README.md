# ⭐ AGS Digital Store

Ultra-advanced affiliate digital discovery store built for static hosting.

## Stack

HTML5, Tailwind CSS CDN, DaisyUI, Flowbite, CSS, Vanilla ES6+ JavaScript.
No backend, database or server-side rendering is required.

## Structure

```text
ags-digital-store/
├── index.html
├── explore.html
├── category.html
├── search.html
├── brand.html
├── saved.html
├── css/
├── js/
└── assets/
```

## Data-first architecture

Edit only `js/StoreData.js` to add or update brands, categories, collections and FAQs. The UI uses reusable renderers and automatically feeds search, filters, category pages, brand pages, alternatives, related tools, saved tools and recent tools.

Each brand supports both `officialUrl` and an optional `affiliateUrl`. Leave `affiliateUrl` empty until a real affiliate/tracking URL exists; the site then falls back to the official URL and labels the action accordingly.

## Local testing

Because this project uses ES modules, serve the folder over HTTP instead of opening files directly with `file://`.

Example:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080/`.

## GitHub Pages

Upload the project files to a repository and enable GitHub Pages from the repository's Pages settings. Query-based URLs are used for dynamic detail views, so no backend router is required:

```text
brand.html?id=semrush
category.html?id=seo
search.html?q=seo
```

## Cloudflare Pages

Deploy the repository as a static site. No build command or server runtime is required.

## Storage keys

```text
ags_saved
ags_recent
ags_search_history
ags_theme
ags_compare
ags_debug
```

## Trust / affiliate rules

The interface does not create fake reviews, ratings, discounts or affiliation claims. Affiliate tracking is opt-in per brand through `affiliateUrl`.
