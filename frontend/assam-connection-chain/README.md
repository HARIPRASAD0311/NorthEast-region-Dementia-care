# 🌿 Assam Connection Chain

A cognitive activity module for the "AI-Based Interactive Cognitive Support Platform for
Elderly People with Dementia-Related Cognitive Difficulties" (SIH project).

Elderly-friendly, calm, no timers, no penalties — a node-to-node visual association game
built around real photographs of Assamese culture, wildlife, nature, and festivals.

## 1. Project folder structure

```
assam-connection-chain/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx                 # React entry point
│   ├── App.jsx                  # Top-level view router (welcome/instructions/game/memory/result)
│   ├── index.css                # All styling — calm, high-contrast, accessible
│   ├── components/
│   │   ├── WelcomeScreen.jsx
│   │   ├── InstructionsScreen.jsx
│   │   ├── GameScreen.jsx       # Core Connection Chain gameplay
│   │   ├── MemoryMode.jsx       # "Remember & Connect" second mode
│   │   ├── NodeChain.jsx        # Renders the discovered chain with arrows
│   │   ├── NodeCard.jsx         # A single node's photo + label
│   │   ├── AnswerCard.jsx       # A clickable answer choice with feedback
│   │   ├── SafeImage.jsx        # Loading/error/fallback-safe image wrapper
│   │   ├── VoiceButton.jsx      # 🔊 read-aloud button (Web Speech API)
│   │   ├── HintButton.jsx       # 💡 hint reveal button
│   │   ├── ProgressBar.jsx      # "Level X of 10" indicator
│   │   ├── LevelComplete.jsx    # Between-level celebration screen
│   │   └── ResultScreen.jsx     # Final screen (both modes)
│   ├── data/
│   │   ├── imageSources.js      # Every real photograph node + attribution
│   │   └── questions.js         # The 10 levels + Memory Mode pairs
│   └── utils/
│       ├── imageUtils.js        # Builds real Wikimedia Commons image URLs
│       └── speech.js            # Web Speech API wrapper
└── public/                      # (empty — no local image assets needed)
```

## 2. Installation

```bash
npm install
```

## 3. Run (development)

```bash
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`).

## 4. Build (production)

```bash
npm run build
npm run preview   # to sanity-check the production build locally
```

> **Note on verification:** this environment has no outbound network access, so I could
> not run `npm install` / `npm run dev` myself here. Every `.js` data/utility file was
> syntax-checked with `node --check`, and I wrote a small script to verify that every
> level's chain length matches its level number, every step's `promptId`/`correctId`
> line up with the chain, every answer choice list contains its correct answer with no
> duplicates, and every node ID referenced anywhere actually exists in the image
> registry — all of that passed. The `.jsx` component files were checked for balanced
> brackets/parens and for every relative import resolving to a real file. Please run
> the two commands above on your machine to confirm the dev server and build both
> work end-to-end before your demo.

## 5. How the node-chain logic works

- **`src/data/imageSources.js`** is the single source of truth for every image node:
  its id, label, category, real Wikimedia Commons file title, alt text, a gentle hint,
  and its source/license.
- **`src/utils/imageUtils.js`** turns a Commons file title into a real, working image
  URL using Commons' own `Special:FilePath` redirect (`.../wiki/Special:FilePath/<file>`)
  rather than a hand-copied `upload.wikimedia.org/<hash>/...` URL. This redirect always
  resolves to the file's current location by title, so it can't go stale or point at a
  mistyped hash — and Commons serves these with permissive CORS headers, so they load
  cleanly in the browser.
- **`src/data/questions.js`** defines `LEVELS`, an array of 10 levels. Each level has:
  - `chain`: the ordered sequence of node IDs that make up the "correct" answer chain
    for that level (length = level number + 1 nodes = level number of *connections*).
  - `steps`: one entry per connection, each holding `promptId` (the node currently shown
    as "CURRENT"), `correctId` (the next node in the chain), and `choiceIds` (2–3 answer
    options, always including the correct one).
- **`GameScreen.jsx`** walks through a level's `steps` one at a time. When the player
  taps the correct answer, that node is appended to the visible chain (`NodeChain.jsx`),
  the score goes up by one star, and the game moves to the next step. An incorrect tap
  never penalizes — it's marked, an encouraging voice line plays, and the player tries
  again. After the last step, `LevelComplete.jsx` shows the finished chain with
  **Next Level** / **Replay Level** options. After Level 10, `ResultScreen.jsx` shows the
  final score out of 55 (1+2+...+10 total connections across all levels).
- **`MemoryMode.jsx`** ("Remember & Connect") is a separate, simpler mode: it shows a
  true node pair, lets the player confirm they've studied it (no timer), hides it, then
  asks which of 2–3 choices was the connected node — across 6 rounds pulled from the
  same real-photograph pool.

## 6. Image source / attribution information

Every photograph is real, hand-verified to exist on Wikimedia Commons at the time this
project was built (checked via web search before being wired into the code — nothing
was invented or guessed). No AI-generated images, illustrations, emoji, or placeholder
graphics are used for any card. If a photograph's *file itself* is ever moved, renamed,
or deleted upstream (not something we control), `SafeImage.jsx` shows a clean
"Photograph unavailable" state and logs `Missing cultural photograph: <url>` to the
console — never a broken-image icon and never a substitute image.

| Node | Label | Commons file | License |
|---|---|---|---|
| gamosa | Gamosa | Assamese_Gamosha.jpg | CC BY-SA 4.0 |
| jaapi | Jaapi | Jaapi_of_Assam.jpg | CC BY-SA 4.0 |
| pepa | Pepa | Pepa,_an_instrument_of_Assamese_culture.jpg | CC BY-SA 4.0 |
| dhol | Dhol | Assamese_Bihu_Dhol.jpg | CC BY-SA 4.0 |
| pitha | Pitha | Assamese_pitha.jpg | CC BY-SA 4.0 |
| bihu | Bihu Dance | Bihu_dance_of_Assam.jpg | CC0 |
| rhino | One-Horned Rhinoceros | One-Horned_Rhino_at_the_Kaziranga_National_Park,_Assam.jpg | CC BY-SA 4.0 |
| elephant | Asian Elephant | Asian_Elephant_tusker_03.jpg | CC BY-SA 4.0 |
| kaziranga | Kaziranga National Park | KAZIRANGA.JPG | CC BY-SA 3.0 |
| brahmaputra | Brahmaputra River | View_of_Brahmaputra_River_from_Nilachal_hill.jpg | Public Domain |
| majuli | Majuli River Island | Majuli_-_The_largest_river_island.jpg | CC BY-SA 4.0 |
| teagarden | Tea Garden | Keyhung_tea_garden.jpg | CC BY-SA 4.0 |
| teapluck | Tea Leaf Plucking | Female_workers_at_a_tea_Garden_of_Assam.jpg | CC BY-SA 4.0 |

Each file's Commons page (full attribution + license text) is linked from its entry in
`src/data/imageSources.js` (`sourcePage`), and is also intended to be surfaced from an
in-game "Image Sources" panel later — the data is already structured for that
(`source`, `sourcePage`, `license` on every node).

## 7. Design choices worth knowing about

- **13 real nodes, reused across levels, never repeated within one chain.** Rather than
  invent generic/abstract nodes ("Assamese Culture", "Conservation") that would have no
  real photograph, every node in every chain is something concretely photographable.
  Longer chains (levels 6–10) combine culture, wildlife, and nature nodes into one
  chain — reusing individual nodes across *different* levels (exactly like the sample
  chains in the brief reuse "Rhino"/"Kaziranga" across Levels 2, 9, and 10) but never
  repeating a node within a single level's own chain.
- **Plain CSS instead of Tailwind.** The brief listed Tailwind as a suggested stack, but
  since I can't run a build here to verify a Tailwind/PostCSS pipeline compiles cleanly,
  I wrote hand-crafted CSS (`src/index.css`) to the same design goals (large touch
  targets, high contrast, warm cultural palette, `prefers-reduced-motion` support) so
  there's nothing extra to configure — `npm install && npm run dev` is all that's
  needed.
- **No countdown timers anywhere**, including in Memory Mode's "study" phase — the
  player taps "I Remember — Hide It" whenever they're ready.
