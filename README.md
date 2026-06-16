# StreetScéal — Drogheda

*Street Story — a distributed, open-ended audio-visual artwork embedded in the streets of Drogheda, Co. Louth*

**Artists:** Claire Fitch & Martina Murray 
**Live:** [streetsceal.ie](https://streetsceal.ie)  
**Medium:** Web AR, oral history, archival audio, GPS-triggered sound  
**Project site:** [populatedsolitude2020.wordpress.com](https://populatedsolitude2020.wordpress.com) *(original Populated Solitude documentation)*

---

## About

StreetScéal — street story — surfaces the voices, histories, and memories held in the streets, buildings, and public spaces of Drogheda. Accessible to anyone with a smartphone, from any point in the town, it returns stories to the places they belong.

There is no fixed start. No designated route. No end date. The work grows over time as new voices, archive sources, and community contributions are added. The town itself is the canvas. Presence in it is the only entry requirement.

No app download required. Open [streetsceal.ie](https://streetsceal.ie) on any modern smartphone and walk.

---

## Trails

StreetScéal — Drogheda is structured as three interlocking trails, each with its own stops, audio character, and geographic reach. All three share the same platform, GPS and AR infrastructure, and entry point.

### The Town Trail · *Live*
Voices, memories, everyday life — the Drogheda that people remember.

| Stop | Location | Era |
|------|----------|-----|
| The Marcy Hotel (White Horse) | West Street | 1963 |
| Wogans (Connolly's Shop) | Shop Street | 1940s–60s |
| Millmount | Millmount Square | Ancient–present |
| St Laurence's Gate | Laurence Street | 13th century |
| The Quayside | West Gate / River Boyne | 18th–20th century |
| St Peter's Church | West Street, Drogheda | 1921–present |

### The Plunkett Trail · *In development*
A martyr's journey across Europe — from Drogheda to Ghent, Rome, London and beyond.

| Stop | Location | Era |
|------|----------|-----|
| St Peter's Church | West Street, Drogheda | 1921–present |
| Loughcrew | Oldcastle, Co. Meath | 1625 |
| Pontificio Collegio Irlandese | Rome, Italy | 1647–1669 |
| St Bavo's Cathedral | Ghent, Belgium | 1 December 1669 |
| Irish College | Louvain, Belgium | 1669 |
| Tyburn | London, England | 1 July 1681 |
| Benedictine Monastery | Lamspringe, Germany | 1683–1883 |

### The Diaspora Trail · *In development*
Drogheda to Liverpool, Bordeaux and beyond — following the routes of those who left.

| Stop | Location |
|------|----------|
| The Quayside | Drogheda — the departure point |
| Liverpool | TBC |
| Bordeaux | TBC |

The Quayside appears in both the Town Trail and the Diaspora Trail — the linking point between local memory and the wider world.

---

## How it works

A visitor opens streetsceal.ie on any modern smartphone. They choose a trail. As they move through the town (or across Europe for the Plunkett Trail), GPS proximity unlocks the stories nearest to them. At each location, pointing the camera at the designated image, building, or object launches an augmented layer of audio and visual content anchored to that surface.

The stack is entirely open source and self-hosted:

- [MindAR.js](https://hiukim.github.io/mind-ar-js-doc/) — browser-based image tracking
- [A-Frame](https://aframe.io) — WebXR scene rendering
- Web Geolocation API — GPS proximity detection
- HTML5 / Web Audio API — audio playback
- GitHub Pages — free, open hosting

---

## Repository structure

```
streetsceal-drogheda/
├── index.html              # Landing page — trail selector
├── town-trail.html         # Town Trail PWA
├── plunkett-trail.html     # Plunkett Trail PWA (in development)
├── diaspora-trail.html     # Diaspora Trail PWA (in development)
├── CNAME                   # Custom domain: streetsceal.ie
├── targets/                # MindAR .mind files (one per image target)
│   ├── white-horse.mind
│   ├── st-peters.mind
│   └── quayside.mind
├── audio/                  # Archive recordings and soundscapes
│   ├── white-horse.mp3
│   ├── st-peters.mp3
│   └── quayside.mp3
├── assets/
│   └── images/             # Target images and documentation assets
└── README.md
```

---

## Adding a new stop

1. **Choose a target** — a historical photograph, plaque, mural, or building facade with sufficient visual detail for image tracking
2. **Photograph it** — straight on, even lighting, distinctive architectural detail filling the frame
3. **Compile the `.mind` file** — upload the target image to the [MindAR compiler](https://hiukim.github.io/mind-ar-js-doc/tools/compile), download and place in `/targets/`
4. **Prepare audio** — export as `.mp3`, place in `/audio/`
5. **Add to the relevant trail HTML file** — add an entry to the `STOPS` array with coordinates, content text, and file paths
6. **Deploy** — push to GitHub; GitHub Pages builds automatically

---

## Scaling to a new trail

Each new trail is a self-contained HTML file within this repository:

1. Copy `town-trail.html` as a template
2. Update the `STOPS` array with trail-specific locations, coordinates, and content
3. Add the trail card to `index.html` — change `coming-soon` class to active, update the `href`
4. Add audio and image target files

---

## Project history

| Year | Development |
|------|-------------|
| 2020 | *Populated Solitude* commissioned for Culture Night 2020. First work: *On A Summer Morning In 1963*, an audio response to Paul Murphy's account of meeting Brendan Behan at the White Horse Hotel |
| 2021 | Seed funding awarded by Droichead Arts, Drogheda |
| 2022 | Expanded to a four-stop audio walk deployed via the ECHOES GPS-triggered sound walk app. New work developed from Louth County Archives oral history recordings |
| 2026 | *Streetscéal* — Web AR iteration. GPS + image tracking, self-hosted on GitHub Pages, no app required. Multi-trail platform with Town Trail, Plunkett Trail, and Diaspora Trail |

---

## Archival sources

- **Louth County Archives** — oral history recordings including OHA/0112(1), Maura and Michael Byrne
- **Drogheda Independent** — historical press archive
- Paul Murphy — interview conducted 2020

---

## Credits

**Artist:** Claire Fitch  
**Seed funding:** Droichead Arts, 2021  
**Archival partnership:** Louth County Archives  
**Original commission:** Culture Night 2020

Claire Fitch is a composer, sound designer, and lecturer at Dundalk Institute of Technology. Her practice spans electroacoustic composition, oral history, and site-specific audio art.

[clairefitch.github.io](https://clairefitch.github.io) · [fitchsounds.com](https://fitchsounds.com)

---

## Licence

Audio content and archival material is subject to the terms of the originating collections. Code is available under MIT licence. Please contact the artist for use of audio content.

© Claire Fitch, 2026
