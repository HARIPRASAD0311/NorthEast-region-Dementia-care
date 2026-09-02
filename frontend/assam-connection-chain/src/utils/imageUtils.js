// src/utils/imageUtils.js
//
// Builds real, working Wikimedia Commons image URLs from a file title.
//
// We deliberately use Commons' own "Special:FilePath" redirect instead of
// a hard-coded upload.wikimedia.org/<hash>/<hash>/<file> URL. Special:FilePath
// resolves by the file's title, so it always finds the file's current
// upload location — it can't go stale or point at a mistyped hash the way
// a hand-copied upload URL could. Wikimedia serves these with permissive
// CORS headers, so they load cleanly in a browser <img> or canvas.
//
// docs: https://www.mediawiki.org/wiki/Manual:Special:FilePath

const COMMONS_FILEPATH_BASE = 'https://commons.wikimedia.org/wiki/Special:FilePath/';

/**
 * @param {string} commonsTitle e.g. "Assamese_Gamosha.jpg"
 * @param {number} [width] optional thumbnail width in pixels
 * @returns {string} a real, working HTTPS image URL
 */
export function buildImageUrl(commonsTitle, width = 900) {
  const encoded = encodeURIComponent(commonsTitle);
  return `${COMMONS_FILEPATH_BASE}${encoded}${width ? `?width=${width}` : ''}`;
}

/**
 * @param {string} commonsTitle e.g. "Assamese_Gamosha.jpg"
 * @returns {string} the Commons file description page, for attribution
 */
export function buildFileDescriptionUrl(commonsTitle) {
  return `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(commonsTitle)}`;
}
