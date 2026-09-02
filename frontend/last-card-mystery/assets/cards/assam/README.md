# Assam Deck — Photograph Sourcing Guide

This prototype ships with clearly-labeled **SVG placeholders**, not real
photographs, because the code-execution sandbox used to build this
project has **no internet access** — there is no way to download and
write real image files into the project automatically. The project
spec also explicitly forbids AI-generated or illustrated "cultural"
artwork, so placeholders (not fabricated art) are the correct stand-in.

## Real, properly-licensed photos (verified via web search)

Below are actual Creative-Commons-licensed photographs found on
**Wikimedia Commons** for every card in the Assam deck — not random
stock photos. Commons requires uploaders to license their own work, so
these are safe to reuse **as long as you follow the attribution terms
of each license** (CC BY / CC BY-SA require crediting the photographer
and linking the license — see each file page for exact wording).

| Card ID | Display Name | Commons file / category | License | Save as |
|---|---|---|---|---|
| gamosa | Gamosa | [Koch Rajbongshi Gamosa.jpg](https://commons.wikimedia.org/wiki/File:Koch_Rajbongshi_Gamosa.jpg) | CC BY-SA 4.0 | `assets/cards/assam/gamosa.jpg` |
| jaapi | Jaapi | [Category:Jaapi](https://commons.wikimedia.org/wiki/Category:Jaapi) — pick e.g. "A Conical Wicker Hat(জাপি).jpg" | CC BY-SA (check file page) | `assets/cards/assam/jaapi.jpg` |
| pepa | Pepa | [Pepa (musical instrument made of cow or buffalo horn) from Assam.jpg](https://commons.wikimedia.org/wiki/File:Pepa_(musical_instrument_made_of_cow_or_buffalo_horn)_from_Assam.jpg) | CC BY 3.0 | `assets/cards/assam/pepa.jpg` |
| pitha | Pitha | [Category:Wiki Loves Folklore-Seven Sisters (2025)](https://commons.wikimedia.org/wiki/Category:Wiki_Loves_Folklore-Seven_Sisters_(2025)) — "Assamese Magh Bihu Pitha Preparation in Sivasagar,Assam.jpg" | CC BY-SA 4.0 | `assets/cards/assam/pitha.jpg` |
| bihu | Bihu Dance | [Bihu Dance , Festival of India.jpg](https://commons.wikimedia.org/wiki/File:Bihu_Dance_,_Festival_of_India.jpg) | CC BY-SA 4.0 | `assets/cards/assam/bihu.jpg` |
| changghar | Chang Ghar | [Category:Houses in Assam](https://commons.wikimedia.org/wiki/Category:Houses_in_Assam) — "Traditional missing chang ghar,Majuli.jpg" | Check file page | `assets/cards/assam/changghar.jpg` |
| dhol | Dhol | [Dhol, Pepa and Taal.jpg](https://commons.wikimedia.org/wiki/File:Dhol,_Pepa_and_Taal.jpg) (crop to the dhol) | CC BY-SA 3.0 | `assets/cards/assam/dhol.jpg` |
| mekhela | Mekhela Chador | [Category:Wiki Loves Folklore-Seven Sisters (2025)](https://commons.wikimedia.org/wiki/Category:Wiki_Loves_Folklore-Seven_Sisters_(2025)) — "Assamese traditional dress ( Mekhela Chador Jute cloth ).jpg" | CC BY-SA 4.0 | `assets/cards/assam/mekhela.jpg` |

**To use one:** open the link → click "Original file" / the largest
resolution → save it with the exact filename in the table above →
crop to roughly a 5:4 landscape ratio if you want a tighter card. Some
rows link to a category page because the individual file page wasn't
directly confirmed — open the category and pick the best photo of the
item itself (not a person/crowd shot) from the listed files.

**Attribution:** CC BY / BY-SA licenses require credit. The simplest
approach for a prototype: add a small "Photo credits" footer or About
screen listing each photographer/Commons file link. Don't strip
attribution if this goes into a public build.

## How to replace a placeholder

1. Download the photo per the table above (or your own alternative,
   as long as it's a real photograph you have rights to use).
2. Save it using the **exact filename** listed.
3. Update the matching `image` path in `src/data/culturalDecks.js`
   from `.svg` to `.jpg` (see below).

## After adding the real files

Open `src/data/culturalDecks.js` and update each card's `image` field,
e.g.:

```js
{
  id: 'gamosa',
  name: 'Gamosa',
  image: '/assets/cards/assam/gamosa.jpg',   // <-- change extension here
  description: '...'
}
```

No other file needs to change — the game engine reads the `image` path
directly and does not care what format it is.

## Regenerating placeholders

If you ever need fresh SVG placeholders (e.g. after adding a new
card), run:

```
node scripts/generate-placeholders.mjs
```
