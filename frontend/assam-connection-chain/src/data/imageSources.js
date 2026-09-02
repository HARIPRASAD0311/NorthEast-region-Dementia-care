// src/data/imageSources.js
//
// Every image node used anywhere in the game, in one place.
//
// IMPORTANT — REAL PHOTOGRAPHS ONLY:
// Each entry's `commonsTitle` is a real, verified file that exists on
// Wikimedia Commons today (checked by hand before this file was written).
// `imageUrl` is built from Commons' own "Special:FilePath" redirect
// (see utils/imageUtils.js) so the game always resolves to the current,
// correct upload — never a guessed or generated filename.
//
// No AI-generated images, illustrations, or placeholder graphics are
// used anywhere in this file.

export const IMAGE_NODES = {
  gamosa: {
    id: 'gamosa',
    label: 'Gamosa',
    category: 'Culture',
    alt: 'A handwoven white Assamese gamosa with a red woven border',
    hint: 'This handwoven cloth is offered to guests and elders as a mark of respect in Assam.',
    commonsTitle: 'Assamese_Gamosha.jpg',
    source: 'Wikimedia Commons',
    sourcePage: 'https://commons.wikimedia.org/wiki/File:Assamese_Gamosha.jpg',
    license: 'CC BY-SA 4.0'
  },
  jaapi: {
    id: 'jaapi',
    label: 'Jaapi',
    category: 'Culture',
    alt: 'A traditional conical Assamese jaapi woven from bamboo and palm leaf',
    hint: 'This cone-shaped hat is woven from bamboo and palm leaf and is worn with pride during Bihu.',
    commonsTitle: 'Jaapi_of_Assam.jpg',
    source: 'Wikimedia Commons',
    sourcePage: 'https://commons.wikimedia.org/wiki/File:Jaapi_of_Assam.jpg',
    license: 'CC BY-SA 4.0'
  },
  pepa: {
    id: 'pepa',
    label: 'Pepa',
    category: 'Culture',
    alt: 'A pepa, a traditional Assamese wind instrument made from a buffalo horn',
    hint: 'Made from a buffalo horn, this instrument leads the music during Bihu celebrations.',
    commonsTitle: 'Pepa,_an_instrument_of_Assamese_culture.jpg',
    source: 'Wikimedia Commons',
    sourcePage: 'https://commons.wikimedia.org/wiki/File:Pepa,_an_instrument_of_Assamese_culture.jpg',
    license: 'CC BY-SA 4.0'
  },
  dhol: {
    id: 'dhol',
    label: 'Dhol',
    category: 'Culture',
    alt: 'An Assamese Bihu dhol, a traditional double-headed drum',
    hint: 'This drum is beaten to keep the rhythm for Bihu dancers.',
    commonsTitle: 'Assamese_Bihu_Dhol.jpg',
    source: 'Wikimedia Commons',
    sourcePage: 'https://commons.wikimedia.org/wiki/File:Assamese_Bihu_Dhol.jpg',
    license: 'CC BY-SA 4.0'
  },
  pitha: {
    id: 'pitha',
    label: 'Pitha',
    category: 'Food',
    alt: 'Traditional Assamese pitha, a rice-based sweet',
    hint: 'This rice-based sweet is prepared and shared with family during festival time.',
    commonsTitle: 'Assamese_pitha.jpg',
    source: 'Wikimedia Commons',
    sourcePage: 'https://commons.wikimedia.org/wiki/File:Assamese_pitha.jpg',
    license: 'CC BY-SA 4.0'
  },
  bihu: {
    id: 'bihu',
    label: 'Bihu Dance',
    category: 'Festival',
    alt: 'Dancers performing the traditional Bihu dance of Assam',
    hint: "Assam's most important festival, celebrated with energetic dance, music, and traditional dress.",
    commonsTitle: 'Bihu_dance_of_Assam.jpg',
    source: 'Wikimedia Commons',
    sourcePage: 'https://commons.wikimedia.org/wiki/File:Bihu_dance_of_Assam.jpg',
    license: 'CC0'
  },
  rhino: {
    id: 'rhino',
    label: 'One-Horned Rhinoceros',
    category: 'Wildlife',
    alt: 'A one-horned rhinoceros at Kaziranga National Park, Assam',
    hint: 'This animal, famous across the world, is found in a national park in Assam.',
    commonsTitle: 'One-Horned_Rhino_at_the_Kaziranga_National_Park,_Assam.jpg',
    source: 'Wikimedia Commons',
    sourcePage:
      'https://commons.wikimedia.org/wiki/File:One-Horned_Rhino_at_the_Kaziranga_National_Park,_Assam.jpg',
    license: 'CC BY-SA 4.0'
  },
  elephant: {
    id: 'elephant',
    label: 'Asian Elephant',
    category: 'Wildlife',
    alt: 'An Asian elephant in Kaziranga National Park, Assam',
    hint: 'This gentle giant shares the same forest home as the rhino.',
    commonsTitle: 'Asian_Elephant_tusker_03.jpg',
    source: 'Wikimedia Commons',
    sourcePage: 'https://commons.wikimedia.org/wiki/File:Asian_Elephant_tusker_03.jpg',
    license: 'CC BY-SA 4.0'
  },
  kaziranga: {
    id: 'kaziranga',
    label: 'Kaziranga National Park',
    category: 'Places',
    alt: 'Grassland and forest landscape of Kaziranga National Park, Assam',
    hint: 'This protected grassland and forest is home to the rhino and the elephant.',
    commonsTitle: 'KAZIRANGA.JPG',
    source: 'Wikimedia Commons',
    sourcePage: 'https://commons.wikimedia.org/wiki/File:KAZIRANGA.JPG',
    license: 'CC BY-SA 3.0'
  },
  brahmaputra: {
    id: 'brahmaputra',
    label: 'Brahmaputra River',
    category: 'Nature',
    alt: 'The Brahmaputra River flowing through Assam',
    hint: 'This mighty river flows the length of Assam and shapes its islands.',
    commonsTitle: 'View_of_Brahmaputra_River_from_Nilachal_hill.jpg',
    source: 'Wikimedia Commons',
    sourcePage: 'https://commons.wikimedia.org/wiki/File:View_of_Brahmaputra_River_from_Nilachal_hill.jpg',
    license: 'Public Domain'
  },
  majuli: {
    id: 'majuli',
    label: 'Majuli River Island',
    category: 'Places',
    alt: 'Majuli, the large river island in the Brahmaputra, Assam',
    hint: 'This is one of the largest river islands in the world, formed by a great river.',
    commonsTitle: 'Majuli_-_The_largest_river_island.jpg',
    source: 'Wikimedia Commons',
    sourcePage: 'https://commons.wikimedia.org/wiki/File:Majuli_-_The_largest_river_island.jpg',
    license: 'CC BY-SA 4.0'
  },
  teagarden: {
    id: 'teagarden',
    label: 'Tea Garden',
    category: 'Nature',
    alt: 'Rows of tea plants in an Assam tea garden',
    hint: 'Assam is famous the world over for the tea grown in gardens like this one.',
    commonsTitle: 'Keyhung_tea_garden.jpg',
    source: 'Wikimedia Commons',
    sourcePage: 'https://commons.wikimedia.org/wiki/File:Keyhung_tea_garden.jpg',
    license: 'CC BY-SA 4.0'
  },
  teapluck: {
    id: 'teapluck',
    label: 'Tea Leaf Plucking',
    category: 'Food',
    alt: 'Workers plucking tea leaves at a tea garden in Assam',
    hint: 'Skilled hands pick the fresh young leaves that will become your cup of tea.',
    commonsTitle: 'Female_workers_at_a_tea_Garden_of_Assam.jpg',
    source: 'Wikimedia Commons',
    sourcePage: 'https://commons.wikimedia.org/wiki/File:Female_workers_at_a_tea_Garden_of_Assam.jpg',
    license: 'CC BY-SA 4.0'
  }
};

export const IMAGE_NODE_LIST = Object.values(IMAGE_NODES);
