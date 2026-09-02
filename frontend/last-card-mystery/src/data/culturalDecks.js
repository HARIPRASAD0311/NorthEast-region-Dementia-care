/**
 * culturalDecks.js
 * ------------------------------------------------------------------
 * Data-driven definition of every cultural deck in the game.
 *
 * To add a NEW STATE later:
 *   1. Duplicate one of the entries below.
 *   2. Set `available: true`.
 *   3. Fill `cards` with at least 7 real items (id, name, image path).
 *   4. Drop real photographs into: assets/cards/<stateKey>/<id>.jpg
 *   5. That's it — the game engine (game.js, ai.js) needs NO changes.
 *
 * IMAGE RULE (per project spec):
 *   Only real photographs of authentic cultural items should ship in
 *   production. This prototype ships clearly-labelled PLACEHOLDER
 *   images (SVG) because no network/image-sourcing tool was available
 *   while generating this build. Each placeholder embeds the exact
 *   filename and a recommended search query — see
 *   assets/cards/assam/README.md for the full sourcing list.
 * ------------------------------------------------------------------
 */

export const culturalDecks = {
  assam: {
    key: 'assam',
    name: 'Assam',
    tagline: 'Land of the Brahmaputra',
    available: true,
    cards: [
      {
        id: 'gamosa',
        name: 'Gamosa',
        image: '/assets/cards/assam/gamosa.png',
        description: 'A woven cotton cloth symbolizing Assamese identity and respect.'
      },
      {
        id: 'jaapi',
        name: 'Jaapi',
        image: '/assets/cards/assam/jaapi.png',
        description: 'A traditional conical hat woven from bamboo and palm leaf.'
      },
      {
        id: 'pepa',
        name: 'Pepa',
        image: '/assets/cards/assam/pepa.png',
        description: 'A buffalo-horn wind instrument played during Bihu.'
      },
      {
        id: 'pitha',
        name: 'Pitha',
        image: '/assets/cards/assam/pitha.png',
        description: 'A traditional rice cake prepared during festivals.'
      },
      {
        id: 'bihu',
        name: 'Bihu Dance',
        image: '/assets/cards/assam/bihu.png',
        description: 'The energetic folk dance celebrating the Assamese new year.'
      },
      {
        id: 'changghar',
        name: 'Chang Ghar',
        image: '/assets/cards/assam/changghar.png',
        description: 'A traditional stilted Assamese house built for flood safety.'
      },
      {
        id: 'dhol',
        name: 'Dhol',
        image: '/assets/cards/assam/dhol.png',
        description: 'A double-headed drum central to Bihu performances.'
      },
      {
        id: 'mekhela',
        name: 'Mekhela Chador',
        image: '/assets/cards/assam/mekhela.png',
        description: 'The traditional two-piece garment worn by Assamese women.'
      }
    ]
  },

  arunachal: {
    key: 'arunachal',
    name: 'Arunachal Pradesh',
    tagline: 'Land of the Dawn-Lit Mountains',
    available: false,
    cards: []
  },
  meghalaya: {
    key: 'meghalaya',
    name: 'Meghalaya',
    tagline: 'Abode of Clouds',
    available: false,
    cards: []
  },
  manipur: {
    key: 'manipur',
    name: 'Manipur',
    tagline: 'Jewel of India',
    available: false,
    cards: []
  },
  mizoram: {
    key: 'mizoram',
    name: 'Mizoram',
    tagline: 'Land of the Highlanders',
    available: false,
    cards: []
  },
  nagaland: {
    key: 'nagaland',
    name: 'Nagaland',
    tagline: 'Land of Festivals',
    available: false,
    cards: []
  },
  tripura: {
    key: 'tripura',
    name: 'Tripura',
    tagline: 'Land of Fourteen Deities',
    available: false,
    cards: []
  },
  sikkim: {
    key: 'sikkim',
    name: 'Sikkim',
    tagline: 'Land of the Monasteries',
    available: false,
    cards: []
  }
};

export function getDeckList() {
  return Object.values(culturalDecks);
}

export function getDeck(key) {
  return culturalDecks[key];
}
