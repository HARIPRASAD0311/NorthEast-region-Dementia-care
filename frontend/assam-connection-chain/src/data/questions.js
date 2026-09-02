// src/data/questions.js
//
// The 10-level question database for "Assam Connection Chain".
//
// Each level's `chain` is the sequence of real, factually-grounded
// connections the player discovers one at a time (chain length === level
// number, per the spec). `steps` holds the actual question data: which
// node is shown as the "current" node, which node is the correct answer,
// and which nodes are offered as (clearly distinct, non-confusing)
// choices.
//
// Themes are varied across culture, wildlife, nature, places, and food so
// the game is never "just about tea". Nodes are reused across different
// levels' chains (the way the sample structure in the brief does too —
// e.g. rhino/kaziranga reappear in several levels) because there are a
// limited number of hand-verified real photographs; no two levels reuse
// the exact same chain or ordering.

import { IMAGE_NODES } from './imageSources.js';

function step(promptId, correctId, choiceIds) {
  return { promptId, correctId, choiceIds };
}

export const LEVELS = [
  {
    level: 1,
    theme: 'Tea',
    title: 'Tea Garden',
    chain: ['teagarden', 'teapluck'],
    choiceCount: 2,
    steps: [step('teagarden', 'teapluck', ['teapluck', 'bihu'])]
  },
  {
    level: 2,
    theme: 'Rhino',
    title: 'One-Horned Rhinoceros',
    chain: ['rhino', 'kaziranga', 'elephant'],
    choiceCount: 2,
    steps: [
      step('rhino', 'kaziranga', ['kaziranga', 'pitha']),
      step('kaziranga', 'elephant', ['elephant', 'gamosa'])
    ]
  },
  {
    level: 3,
    theme: 'Bihu',
    title: 'Bihu Dance',
    chain: ['bihu', 'dhol', 'pepa', 'gamosa'],
    choiceCount: 2,
    steps: [
      step('bihu', 'dhol', ['dhol', 'teagarden']),
      step('dhol', 'pepa', ['pepa', 'rhino']),
      step('pepa', 'gamosa', ['gamosa', 'majuli'])
    ]
  },
  {
    level: 4,
    theme: 'Jaapi',
    title: 'Jaapi',
    chain: ['jaapi', 'gamosa', 'bihu', 'dhol', 'pepa'],
    choiceCount: 3,
    steps: [
      step('jaapi', 'gamosa', ['gamosa', 'rhino', 'teagarden']),
      step('gamosa', 'bihu', ['bihu', 'elephant', 'majuli']),
      step('bihu', 'dhol', ['dhol', 'pitha', 'brahmaputra']),
      step('dhol', 'pepa', ['pepa', 'kaziranga', 'teapluck'])
    ]
  },
  {
    level: 5,
    theme: 'Gamosa',
    title: 'Gamosa',
    chain: ['gamosa', 'jaapi', 'bihu', 'dhol', 'pepa', 'pitha'],
    choiceCount: 3,
    steps: [
      step('gamosa', 'jaapi', ['jaapi', 'rhino', 'teagarden']),
      step('jaapi', 'bihu', ['bihu', 'majuli', 'elephant']),
      step('bihu', 'dhol', ['dhol', 'brahmaputra', 'teapluck']),
      step('dhol', 'pepa', ['pepa', 'kaziranga', 'majuli']),
      step('pepa', 'pitha', ['pitha', 'elephant', 'teagarden'])
    ]
  },
  {
    level: 6,
    theme: 'Majuli',
    title: 'Majuli River Island',
    chain: ['majuli', 'brahmaputra', 'kaziranga', 'rhino', 'elephant', 'teagarden', 'teapluck'],
    choiceCount: 3,
    steps: [
      step('majuli', 'brahmaputra', ['brahmaputra', 'gamosa', 'pitha']),
      step('brahmaputra', 'kaziranga', ['kaziranga', 'jaapi', 'dhol']),
      step('kaziranga', 'rhino', ['rhino', 'bihu', 'pepa']),
      step('rhino', 'elephant', ['elephant', 'gamosa', 'pitha']),
      step('elephant', 'teagarden', ['teagarden', 'dhol', 'majuli']),
      step('teagarden', 'teapluck', ['teapluck', 'jaapi', 'rhino'])
    ]
  },
  {
    level: 7,
    theme: 'Wildlife',
    title: 'Asian Elephant',
    chain: ['elephant', 'kaziranga', 'rhino', 'brahmaputra', 'majuli', 'teagarden', 'teapluck', 'pitha'],
    choiceCount: 3,
    steps: [
      step('elephant', 'kaziranga', ['kaziranga', 'gamosa', 'dhol']),
      step('kaziranga', 'rhino', ['rhino', 'pepa', 'majuli']),
      step('rhino', 'brahmaputra', ['brahmaputra', 'jaapi', 'pitha']),
      step('brahmaputra', 'majuli', ['majuli', 'bihu', 'teagarden']),
      step('majuli', 'teagarden', ['teagarden', 'elephant', 'dhol']),
      step('teagarden', 'teapluck', ['teapluck', 'rhino', 'gamosa']),
      step('teapluck', 'pitha', ['pitha', 'kaziranga', 'jaapi'])
    ]
  },
  {
    level: 8,
    theme: 'Assamese Music',
    title: 'Dhol',
    chain: ['dhol', 'bihu', 'gamosa', 'jaapi', 'pepa', 'pitha', 'teagarden', 'teapluck', 'elephant'],
    choiceCount: 3,
    steps: [
      step('dhol', 'bihu', ['bihu', 'rhino', 'majuli']),
      step('bihu', 'gamosa', ['gamosa', 'kaziranga', 'brahmaputra']),
      step('gamosa', 'jaapi', ['jaapi', 'elephant', 'teagarden']),
      step('jaapi', 'pepa', ['pepa', 'rhino', 'teapluck']),
      step('pepa', 'pitha', ['pitha', 'majuli', 'kaziranga']),
      step('pitha', 'teagarden', ['teagarden', 'dhol', 'brahmaputra']),
      step('teagarden', 'teapluck', ['teapluck', 'bihu', 'rhino']),
      step('teapluck', 'elephant', ['elephant', 'gamosa', 'jaapi'])
    ]
  },
  {
    level: 9,
    theme: 'Kaziranga',
    title: 'Kaziranga National Park',
    chain: [
      'kaziranga',
      'rhino',
      'elephant',
      'brahmaputra',
      'majuli',
      'teagarden',
      'teapluck',
      'pitha',
      'bihu',
      'dhol'
    ],
    choiceCount: 3,
    steps: [
      step('kaziranga', 'rhino', ['rhino', 'gamosa', 'pepa']),
      step('rhino', 'elephant', ['elephant', 'jaapi', 'majuli']),
      step('elephant', 'brahmaputra', ['brahmaputra', 'dhol', 'pitha']),
      step('brahmaputra', 'majuli', ['majuli', 'bihu', 'gamosa']),
      step('majuli', 'teagarden', ['teagarden', 'rhino', 'pepa']),
      step('teagarden', 'teapluck', ['teapluck', 'kaziranga', 'jaapi']),
      step('teapluck', 'pitha', ['pitha', 'elephant', 'dhol']),
      step('pitha', 'bihu', ['bihu', 'brahmaputra', 'teagarden']),
      step('bihu', 'dhol', ['dhol', 'majuli', 'rhino'])
    ]
  },
  {
    level: 10,
    theme: 'Grand Assam Challenge',
    title: 'Gamosa',
    chain: [
      'gamosa',
      'jaapi',
      'bihu',
      'dhol',
      'pepa',
      'pitha',
      'teagarden',
      'teapluck',
      'kaziranga',
      'rhino',
      'elephant'
    ],
    choiceCount: 3,
    steps: [
      step('gamosa', 'jaapi', ['jaapi', 'rhino', 'brahmaputra']),
      step('jaapi', 'bihu', ['bihu', 'kaziranga', 'majuli']),
      step('bihu', 'dhol', ['dhol', 'teagarden', 'elephant']),
      step('dhol', 'pepa', ['pepa', 'rhino', 'majuli']),
      step('pepa', 'pitha', ['pitha', 'kaziranga', 'brahmaputra']),
      step('pitha', 'teagarden', ['teagarden', 'dhol', 'elephant']),
      step('teagarden', 'teapluck', ['teapluck', 'gamosa', 'rhino']),
      step('teapluck', 'kaziranga', ['kaziranga', 'jaapi', 'bihu']),
      step('kaziranga', 'rhino', ['rhino', 'pepa', 'majuli']),
      step('rhino', 'elephant', ['elephant', 'dhol', 'pitha'])
    ]
  }
];

// A handful of true node-pairs for "Remember & Connect" (Memory Mode).
// Each pair is shown to the player, then hidden, then tested — reusing
// the same verified real photographs as the main game.
export const MEMORY_PAIRS = [
  { promptId: 'rhino', correctId: 'kaziranga', choiceIds: ['kaziranga', 'bihu', 'teagarden'] },
  { promptId: 'bihu', correctId: 'dhol', choiceIds: ['dhol', 'rhino', 'pitha'] },
  { promptId: 'teagarden', correctId: 'teapluck', choiceIds: ['teapluck', 'jaapi', 'elephant'] },
  { promptId: 'gamosa', correctId: 'jaapi', choiceIds: ['jaapi', 'majuli', 'brahmaputra'] },
  { promptId: 'majuli', correctId: 'brahmaputra', choiceIds: ['brahmaputra', 'pepa', 'kaziranga'] },
  { promptId: 'elephant', correctId: 'kaziranga', choiceIds: ['kaziranga', 'pitha', 'dhol'] }
];

export function getNode(id) {
  return IMAGE_NODES[id];
}

export const TOTAL_LEVELS = LEVELS.length;
