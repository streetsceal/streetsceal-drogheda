# StreetScéal — Drogheda

*Street Story — a distributed, open-ended audio-visual artwork embedded in the streets of Drogheda, Co. Louth*

**Artist:** Claire Fitch
**Live:** [streetsceal.ie](https://streetsceal.ie) · **Drogheda trails:** [drogheda.streetsceal.ie](https://drogheda.streetsceal.ie)
**Medium:** Web AR, oral history, archival audio, GPS-triggered sound, sonic art, storytelling.

---

## About

StreetScéal — street story — surfaces the voices, histories, and memories held in the streets, buildings, and public spaces of Irish towns. Accessible to anyone with a smartphone, from any point in town, it returns stories to the places they belong.

There is no fixed start. No designated route. No end date. The work grows over time as new voices, archive sources, and community contributions are added, and as new towns join the platform. Presence in the town itself is the only entry requirement.

No app download required. Open [streetsceal.ie](https://streetsceal.ie) to see which towns are live, or go straight to [drogheda.streetsceal.ie](https://drogheda.streetsceal.ie) on any modern smartphone and walk.

**StreetScéal is a multi-town platform.** `streetsceal.ie` is the island-wide home — a map of every town the project has reached or hopes to reach next. Drogheda is the first town live on the platform, at its own subdomain, `drogheda.streetsceal.ie`. Every future town follows the same pattern: its own subdomain, its own set of trails, sharing the same underlying GPS, AR, and audio infrastructure documented here.

---

## Trails

Drogheda is structured as interlocking trails, each with its own stops, audio character, and geographic reach, all sharing the same platform, GPS, and AR infrastructure.

### The Town Trail · *Live*
Voices, memories, everyday life — the Drogheda that people remember.

| Stop | Location | Era |
|------|----------|-----|
| The Marcy Hotel (White Horse) | West Street | 1963 |
| Connolly's Shop | Shop Street | 1940s–60s |
| Millmount ↗ | Millmount Square | Ancient–present |
| St Laurence's Gate | Laurence Street | 13th century |
| St Peter's Church | West Street, Drogheda | 1921–present |
| The Quayside ↗ | West Gate / River Boyne | 18th–20th century |

### The Plunkett Trail · *In development*
A martyr's journey across Europe — from Drogheda to Ghent, Rome, London and beyond. Fully built and content-complete; not yet part of the public-facing trail selection while the platform's initial funding focus centres on fewer, more established trails. The page remains live for direct reference and can be reintroduced at any time.

| Stop | Location | Era |
|------|----------|-----|
| The Quayside | West Gate / River Boyne, Drogheda | Linking stop |
| St Peter's Church | West Street, Drogheda | 1921–present |
| Loughcrew | Oldcastle, Co. Meath | 1625 |
| Pontificio Collegio Irlandese | Rome, Italy | 1647–1669 |
| St Bavo's Cathedral | Ghent, Belgium | 1 December 1669 |
| Irish College | Louvain, Belgium | 1669 |
| Tyburn | London, England | 1 July 1681 |
| Benedictine Monastery | Lamspringe, Germany | 1683–1883 |

### The Diaspora Trail · *Live*
Drogheda to Liverpool, Bordeaux and beyond — following the routes of those who left.

| Stop | Location | Era |
|------|----------|-----|
| The Quayside ↗ | West Gate, River Boyne, Drogheda | 18th–20th century |
| St Peter's Church | West Street, Drogheda | 1921–present |
| Scotland Road | Vauxhall, Liverpool, England | 1840s–1960s |
| Irish College, Bordeaux | Rue du Hâ, Bordeaux, France | 1603–18th century |
| Quai des Chartrons | Bordeaux, France | 18th century–present |

### The Megalithic Trail · *Live*
Five thousand years of continuous human presence — Newgrange, Knowth, Dowth, Fourknocks, Tara, and Loughcrew.

| Stop | Location | Era |
|------|----------|-----|
| Millmount ↗ | Millmount Square, Drogheda | Neolithic–present |
| Newgrange | Brú na Bóinne, Co. Meath | c. 3200 BC |
| Knowth | Brú na Bóinne, Co. Meath | c. 3200 BC |
| Dowth | Brú na Bóinne, Co. Meath | c. 3200 BC |
| Fourknocks | Stamullen, Co. Meath | c. 2750 BC |
| Hill of Tara | Co. Meath | Neolithic–medieval |
| Loughcrew | Oldcastle, Co. Meath | c. 3300 BC |

---

**Linking stops** — shared locations connect the live trails into a single fabric:

- **The Quayside** — the departure point; links Town Trail to Diaspora Trail
- **Millmount** — a Neolithic mound within the town itself; links Town Trail to Megalithic Trail

St Peter's Church and Loughcrew also connect to the Plunkett Trail's own stops, and will resume their role as linking stops once that trail rejoins public view.

The ↗ symbol denotes an active linking stop between two currently live trails.

---

## How it works

A visitor opens [drogheda.streetsceal.ie](https://drogheda.streetsceal.ie) on any modern smartphone. They choose a trail. As they move through the town (or across Europe for the Plunkett Trail), GPS proximity unlocks the stories nearest to them. At each location, pointing the camera at the designated image, building, or object launches an augmented layer of audio and visual content anchored to that surface.

The stack is entirely open source and self-hosted:

- [MindAR.js](https://hiukim.github.io/mind-ar-js-doc/) — browser-based image tracking
- [A-Frame](https://aframe.io) — WebXR scene rendering
- Web Geolocation API — GPS proximity detection
- HTML5 / Web Audio API, Audiokinetic Wwise (Web) — audio playback and interactive sound
- GitHub Pages + Cloudflare Workers — free, open hosting with host-based routing across towns

---

## Repository structure

This repository (`streetsceal-drogheda`) serves the entire platform — the island-wide landing page at the root, and Drogheda's trails in their own subfolder. Every future town follows the same pattern: its own subfolder, its own DNS record, and one line in the Cloudflare Worker's routing table.

```
streetsceal-drogheda/
├── index.html                      # streetsceal.ie — island-wide landing page (map, town selector)
├── CNAME                           # Custom domain: streetsceal.ie
├── streetsceal-coi-worker.js       # Cloudflare Worker — host-based routing + cross-origin isolation headers
├── streetsceal-analytics-worker.js # Cloudflare Worker — analytics endpoint (separate route/service)
├── analytics-report.html           # Password-protected analytics dashboard
├── virtual-visit.html              # Prototype — Street View + archive photo overlay (not yet linked publicly)
│
└── drogheda/                       # drogheda.streetsceal.ie — everything specific to this town
    ├── map.html                    # Trail picker / interactive map (loads at the bare subdomain)
    ├── trails.json                 # Trail + stop data consumed by map.html
    ├── town-trail.html             # Town Trail
    ├── plunkett-trail.html         # Plunkett Trail (in development — see above)
    ├── diaspora-trail.html         # Diaspora Trail
    ├── megalithic-trail.html       # Megalithic Trail
    ├── plunkett-ar.html            # Shared Oliver Plunkett AR/lip-sync encounter
    ├── alignment-preview.html      # Dev tool — AR mouth-shape alignment testing, not part of the live site
    ├── aframe.min.js               # Local A-Frame copy (used by town-trail.html for Wwise integration)
    ├── StreetScealTest.js/.wasm/.data, WwiseAudioWorklet.processor.js  # Wwise Web audio engine build
    ├── targets/                    # MindAR .mind files (one per AR image target)
    ├── audio/                      # Archive recordings and soundscapes
    ├── sprites/                    # AR animated figure assets (lip sync)
    └── assets/images/              # Target images and documentation assets
```

---

## Adding a new stop (to an existing town)

1. **Choose a target** — a historical photograph, plaque, mural, or building facade with sufficient visual detail for image tracking
2. **Photograph it** — straight on, even lighting, distinctive architectural detail filling the frame
3. **Compile the `.mind` file** — upload the target image to the [MindAR compiler](https://hiukim.github.io/mind-ar-js-doc/tools/compile), download and place in `drogheda/targets/`
4. **Prepare audio** — export as `.mp3` or `.wav`, place in `drogheda/audio/`
5. **Add to the relevant trail HTML file** — add an entry to the `STOPS` array with coordinates, content text, and file paths
6. **Update `trails.json`** — add the matching entry so it appears on `map.html`
7. **Deploy** — push to GitHub; GitHub Pages builds automatically

---

## Adding a new town

Each new town is a self-contained folder in this same repository, sharing the landing page, Workers, and hosting — not a separate repo or site. Full step-by-step instructions (repo restructure, DNS, Worker configuration, testing checklist, and the gotchas discovered building Drogheda) live in `StreetSceal_Town_Replication_Guide.docx`. In short:

1. New folder at the repo root (e.g. `athlone/`), following the same internal structure as `drogheda/`
2. New CNAME record in Cloudflare for the town's subdomain, proxied
3. One new entry in `TOWN_HOSTS` in `streetsceal-coi-worker.js`
4. Add the town's live pin to `index.html`'s map

---

## Project history

| Year | Development |
|------|-------------|
| 2020 | *Populated Solitude* commissioned for Culture Night 2020. First work: *On A Summer Morning In 1963*, an audio response to Paul Murphy's account of meeting Brendan Behan at the White Horse Hotel |
| 2021 | Seed funding awarded by Droichead Arts, Drogheda |
| 2022 | Expanded to a four-stop audio walk deployed via the ECHOES GPS-triggered sound walk app. New work developed from Louth County Archives oral history recordings |
| 2026 | *StreetScéal* — Web AR iteration. GPS + image tracking, self-hosted on GitHub Pages, no app required. Multi-town platform launched with Drogheda as the first live town; Town Trail, Diaspora Trail, and Megalithic Trail public, with the Plunkett Trail complete and held for a future release |

---

## Archival sources

- **Louth County Archives** — oral history recordings including OHA/0112(1), Maura and Michael Byrne
- **Drogheda Independent** — historical press archive
- Paul Murphy — interview conducted 2020

---

## Credits

**Artist:** Claire Fitch
**Historian and writer:** Martina Murray
**Seed funding:** Droichead Arts, 2021
**Archival partnership:** Louth County Archives
**Original commission:** Culture Night 2020

Claire Fitch is a composer, sound designer, and lecturer at Dundalk Institute of Technology. Her practice spans electroacoustic composition, oral history, and site-specific audio art.

Martina Murray is a historian, writer, and author based in Co. Louth. She is a contributor to Totally Dublin and founder of Greenlight. Her historical research and narrative writing forms the documentary core of the StreetScéal trails.

[clairefitch.github.io](https://clairefitch.github.io) · [fitchsounds.com](https://fitchsounds.com)

---

## Licence

Audio content and archival material is subject to the terms of the originating collections. Code is available under MIT licence. Please contact the artist for use of audio content.

© StreetScéal, 2026. All rights reserved.
