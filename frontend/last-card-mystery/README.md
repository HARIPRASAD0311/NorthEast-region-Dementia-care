# Last Card Mystery — A Cultural Memory Challenge

An elder-friendly Human-vs-AI memory and cognitive stimulation game.
Players must **observe, remember, and track** the AI opponent's cards
as they are played, then **eliminate** possibilities to **guess** the
one card left in its hand.

Built for the Assam cultural deck as the first prototype; architected
so the other 7 Northeast Indian states can be added without touching
the game engine.

## 1. Install

```
npm install
```

## 2. Run (development)

```
npm run dev
```

This opens the game at `http://localhost:5173`. Works fully offline —
no network calls are made once the page has loaded (sound is
synthesized locally, no external images/fonts are fetched).

## 3. Build for production (optional)

```
npm run build
npm run preview
```

## 4. Where to place real cultural photographs

The prototype currently ships **placeholder images** (plain colored
cards clearly marked "PLACEHOLDER — replace with real photo"), per the
project rule against AI-generated or illustrated cultural artwork.

Real photographs go in:

```
assets/cards/assam/gamosa.jpg
assets/cards/assam/jaapi.jpg
assets/cards/assam/pepa.jpg
assets/cards/assam/pitha.jpg
assets/cards/assam/bihu.jpg
assets/cards/assam/changghar.jpg
assets/cards/assam/dhol.jpg
assets/cards/assam/mekhela.jpg
```

Full sourcing guidance (recommended search queries, licensing notes,
image sizing) is in **`assets/cards/assam/README.md`**. After adding a
photo, update the matching `image` path in
`src/data/culturalDecks.js`.

## 5. How to add another state's deck

1. Open `src/data/culturalDecks.js`.
2. Find the scaffolded entry for the state (e.g. `meghalaya`).
3. Set `available: true` and fill `cards` with 5–8 real items:
   ```js
   meghalaya: {
     key: 'meghalaya',
     name: 'Meghalaya',
     tagline: 'Abode of Clouds',
     available: true,
     cards: [
       { id: 'khasi-jainsem', name: 'Jainsem', image: '/assets/cards/meghalaya/jainsem.jpg', description: '...' },
       // ...more cards
     ]
   }
   ```
4. Create `assets/cards/meghalaya/` and drop in real photographs.
5. That's it — the State Selection screen, difficulty screen, memory
   phase, gameplay, and mystery round all read from this data
   structure automatically. **No engine code changes required.**

## 6. How the AI works

The AI opponent is intentionally simple and rule-based (no ML) — see
`src/ai.js`:

- **Deal:** `dealHand()` randomly deals it a hand from the active deck.
- **Play:** `aiChooseCardToPlay()` picks uniformly at random among its
  remaining cards each turn (transparent, not adversarial).
- **Track:** the game controller (`src/game.js`) records every AI card
  once it's been revealed/played, in `state.aiHandRevealedIds`.
- **Flavor prediction:** `aiPredictPlayerLastCard()` uses pure
  elimination logic to "guess" the player's last card — shown after
  the mystery round purely for opponent presence. It never affects
  scoring.

## 7. Where the difficulty settings are

Single source of truth: `src/data/difficultySettings.js`

```js
easy:   { cardCount: 3, memorizeSeconds: 8, basePoints: 100 }
medium: { cardCount: 5, memorizeSeconds: 6, basePoints: 200 }
hard:   { cardCount: 7, memorizeSeconds: 4, basePoints: 300 }
```

Change any number here to rebalance the whole game — nothing else
needs to be touched.

## 8. Where game-performance data is collected

`src/analytics.js` → `logPerformance(record)`, called once per
completed round from `src/game.js` (right after the mystery
answer is revealed). It currently:

1. `console.log`s the record (visible in devtools), and
2. Appends it to `localStorage` under `lcm_performance_log` so a
   developer can inspect session history across reloads
   (`getPerformanceLog()` reads it back).

**No backend exists in this prototype.** To connect a real adaptive
engine later, replace the body of `logPerformance()` with a `fetch()`
POST call — every screen already funnels through this one function,
so no other file needs to change.

Record shape:

```js
{
  state,              // e.g. "assam"
  difficulty,         // "easy" | "medium" | "hard"
  score,
  correct,            // boolean
  responseTime,       // seconds
  memorizationTime,   // seconds, from difficulty settings
  cardsUsed,          // hand size, from difficulty settings
  mistakes,
  timestamp
}
```

## 9. Project structure

```
last-card-mystery/
├── index.html
├── package.json
├── vite.config.js
├── scripts/
│   └── generate-placeholders.mjs   (regenerates placeholder card art)
├── src/
│   ├── main.js              # bootstraps the app
│   ├── game.js               # screen controller / render loop (all 7 screens)
│   ├── ai.js                  # rule-based AI opponent
│   ├── gameState.js          # central mutable state object
│   ├── scoring.js            # score + accuracy calculation
│   ├── analytics.js          # performance logging (future backend hook)
│   ├── audio.js               # offline WebAudio sound feedback
│   └── data/
│       ├── culturalDecks.js       # all state decks (data-driven)
│       └── difficultySettings.js  # difficulty tuning
├── styles/
│   └── main.css              # full design system (colors, type, cards, buttons)
└── assets/
    ├── cards/assam/           # card images + sourcing README
    └── sounds/                # (optional — swap in real audio files here)
```

## 10. Design notes

- **No framework beyond Vite** — the whole UI is plain DOM rendering
  driven by one state object, which keeps it easy for another
  developer to read top-to-bottom and modify.
- **DOM over Phaser/canvas**: chosen because the experience is large
  accessible photographs + buttons, not sprite/physics animation —
  DOM gives better text accessibility, zoom behavior, and touch target
  sizing for elderly users with less code.
- **Elder-friendly defaults**: all primary buttons ≥60px tall, large
  bold typography, high-contrast warm palette, generous spacing, and
  slow (400ms) easing on transitions — no flashing or rapid effects.
