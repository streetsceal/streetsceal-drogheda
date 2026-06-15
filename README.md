# StreetScéal

*Street Story — a distributed, open-ended audio-visual artwork embedded in the streets of Irish towns*

**Artist:** Claire Fitch  
**Pilot location:** Drogheda, Co. Louth  
**Medium:** Web AR, oral history, archival audio, GPS-triggered sound  
**Project site:** [populatedsolitude2020.wordpress.com](https://populatedsolitude2020.wordpress.com) *(original Populated Solitude documentation)*

---

## About the work

*StreetScéal* — street story — is a distributed, open-ended audio-visual artwork that surfaces the voices, histories, and memories held in the streets, buildings, and public spaces of Irish towns. Accessible to anyone with a smartphone, from any point in the town, it returns stories to the places they belong.

There is no fixed start. No designated route. No end date. The work grows over time as new voices, archive sources, and community contributions are added. The town itself is the canvas. Presence in it is the only entry requirement.

The pilot is **StreetScéal — Drogheda**, developed from *Populated Solitude* (2020–), an ongoing practice-based artwork rooted in oral history, archival research, and the specific memory of Drogheda, Co. Louth. Streetscéal extends that methodology into a replicable civic model applicable to any Irish town.

---

## How it works

A visitor opens the URL on any modern smartphone — no app download required. As they move through the town, GPS proximity unlocks the stories nearest to them. At each location, pointing the camera at the designated image, building, or object launches an augmented layer of audio and visual content anchored to that surface.

**The entry point is the town itself.** A single URL — shared on a sign at the town entrance, a library leaflet, a social media post, or the local tourist office — opens the full experience. After that, the streets do the work.

The stack is entirely open source and self-hosted:

- [MindAR.js](https://hiukim.github.io/mind-ar-js-doc/) — browser-based image tracking
- [A-Frame](https://aframe.io) — WebXR scene rendering
- Web Geolocation API — GPS proximity detection
- HTML5 / Web Audio API — audio playback
- GitHub Pages — free, open hosting

---

## Structure

StreetScéal is designed as a replicable model. Each town is a standalone deployment within the same GitHub organisation:

```
github.com/streetsceal/
├── streetsceal-drogheda      ← pilot
├── streetsceal-dundalk
├── streetsceal-ardee
└── streetsceal-[town]
```

Each town deploys to its own URL:
```
streetsceal-drogheda.github.io
```

Or, with the custom domain, via subdomain:
```
drogheda.streetsceal.ie
dundalk.streetsceal.ie
```

---

## Pilot: StreetScéal — Drogheda

Developed from *Populated Solitude* (Claire Fitch, 2020–), seed-funded by Droichead Arts and first presented on Culture Night 2020. The Drogheda pilot draws on oral history recordings and archival material held at the Louth County Archives.

### Current stops

**01 — The White Horse Hotel, Shop Street** · *1963 · oral history · literary*  
Paul Murphy, former editor of the Drogheda Independent, describes meeting Brendan Behan at the bar in the summer of 1963. The hotel no longer exists under that name. The encounter does.

**02 — Connolly's Shop, Shop Street** · *1940s–60s · oral history · archive*  
Drawing on the testimony of Maura and Michael Byrne, held in the Louth County Archives (OHA/0112(1)). The rhythms of a community — St John's Eve bonfires, the texture of commerce on Shop Street — mapped onto specific memory.

**03 — Millmount** · *Ancient–present · landscape · archaeology*  
Neolithic passage tomb. Viking settlement. Cromwellian siege point. Civil War artillery target. Five thousand years of continuous human presence in a single mound above the town.

**04 — St Laurence's Gate, Laurence Street** · *13th century · medieval · architecture*  
One of the finest surviving medieval barbican gates in Ireland. The road through it has not changed in eight hundred years.

---

## Adding a new stop

1. **Choose a target** — a historical photograph, plaque, mural, or building facade with sufficient visual detail for image tracking
2. **Compile the `.mind` file** — upload the target image to the [MindAR compiler](https://hiukim.github.io/mind-ar-js-doc/tools/compile), download and place in `/targets/`
3. **Prepare audio** — export as `.mp3`, place in `/audio/`
4. **Add to `index.html`** — add an entry to the `STOPS` array with coordinates, content text, and file paths
5. **Deploy** — push to GitHub; GitHub Pages builds automatically

---

## Adding a new town

1. Fork this repository as `streetsceal-[townname]`
2. Update the `STOPS` array with local locations, coordinates, and content
3. Replace audio and image target files with town-specific material
4. Enable GitHub Pages on the new repo
5. Add the town subdomain to `streetsceal.ie` DNS if using the custom domain

---

## Repository structure

```
streetsceal-drogheda/
├── index.html          # Main PWA — trail app, GPS logic, AR launcher
├── targets/            # MindAR .mind files (one per image target)
│   ├── white-horse.mind
│   ├── connollys-shop.mind
│   ├── millmount.mind
│   └── laurence-gate.mind
├── audio/              # Archive recordings and soundscapes
│   ├── white-horse-paul-murphy.mp3
│   ├── connollys-shop-byrnes.mp3
│   ├── millmount-soundscape.mp3
│   └── laurence-gate-soundscape.mp3
├── assets/
│   └── images/         # Target images and documentation assets
└── README.md
```

---

## Archival sources

- **Louth County Archives** — oral history recordings including OHA/0112(1), Maura and Michael Byrne
- **Drogheda Independent** — historical press archive
- Paul Murphy — interview conducted 2020

---

## Project history

| Year | Development |
|------|-------------|
| 2020 | *Populated Solitude* commissioned for Culture Night 2020 by Brian Hegarty. First work: *On A Summer Morning In 1963*, an audio response to Paul Murphy's account of meeting Brendan Behan at the White Horse Hotel |
| 2021 | Seed funding awarded by Droichead Arts, Drogheda |
| 2022 | Expanded to a four-stop audio walk, deployed via the ECHOES GPS-triggered sound walk app. New work developed from Louth County Archives oral history recordings |
| 2024– | *StreetScéal* — current development. Web AR iteration: GPS + image tracking, self-hosted on GitHub Pages, no app required. Replicable model for any Irish town |

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

&copy; Claire Fitch
