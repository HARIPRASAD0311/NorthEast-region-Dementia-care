/**
 * generate-placeholders.mjs
 * ------------------------------------------------------------------
 * Generates clearly-labeled SVG PLACEHOLDER images for each card in
 * the Assam deck. These are NOT meant to represent the actual
 * cultural items — they are intentionally plain so nobody mistakes
 * them for finished art. Replace with real photographs before any
 * public/production use (see assets/cards/assam/README.md).
 *
 * Run with: node scripts/generate-placeholders.mjs
 * ------------------------------------------------------------------
 */
import { writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'assets', 'cards', 'assam');
mkdirSync(outDir, { recursive: true });

const cards = [
  { id: 'gamosa', name: 'Gamosa', color: '#B5772E', query: 'Assamese gamosa woven cotton cloth photograph' },
  { id: 'jaapi', name: 'Jaapi', color: '#D97706', query: 'traditional Assamese jaapi bamboo hat photograph' },
  { id: 'pepa', name: 'Pepa', color: '#2E7D5B', query: 'Assamese pepa buffalo horn instrument Bihu photograph' },
  { id: 'pitha', name: 'Pitha', color: '#C62828', query: 'Assamese pitha rice cake festival food photograph' },
  { id: 'bihu', name: 'Bihu Dance', color: '#2563EB', query: 'Bihu dance Assam festival photograph' },
  { id: 'changghar', name: 'Chang Ghar', color: '#6D4C41', query: 'traditional Assamese stilted house chang ghar photograph' },
  { id: 'dhol', name: 'Dhol', color: '#8E24AA', query: 'Assamese dhol drum Bihu photograph' },
  { id: 'mekhela', name: 'Mekhela Chador', color: '#00796B', query: 'Assamese mekhela chador traditional attire photograph' }
];

function svgFor(card) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 320" width="400" height="320">
  <rect width="400" height="320" fill="${card.color}"/>
  <rect x="0" y="0" width="400" height="320" fill="black" opacity="0.12"/>
  <circle cx="200" cy="120" r="46" fill="white" opacity="0.9"/>
  <text x="200" y="132" font-family="Arial, sans-serif" font-size="34" font-weight="bold" fill="${card.color}" text-anchor="middle">?</text>
  <text x="200" y="205" font-family="Arial, sans-serif" font-size="26" font-weight="bold" fill="white" text-anchor="middle">${card.name}</text>
  <text x="200" y="238" font-family="Arial, sans-serif" font-size="13" fill="white" text-anchor="middle" opacity="0.9">PLACEHOLDER — replace with real photo</text>
  <text x="200" y="260" font-family="Arial, sans-serif" font-size="11" fill="white" text-anchor="middle" opacity="0.75">${card.id}.jpg</text>
</svg>`;
}

cards.forEach((card) => {
  const filePath = path.join(outDir, `${card.id}.svg`);
  writeFileSync(filePath, svgFor(card), 'utf-8');
  console.log('Generated', filePath);
});

console.log('\nDone. See assets/cards/assam/README.md for real-photo sourcing guidance.');
