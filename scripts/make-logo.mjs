// Builds public/logo.png from the client's source logo:
// removes the white background, erases the screenshot "info" icon and bottom bar, trims, resizes.
import sharp from "sharp";

const SRC = "public/images/Herbal tea.jpg";
const OUT = "public/logo.png";
const WHITE = 225; // channel value above which a pixel counts as background white
const SOFT = 160; // edge pixels lighter than this get partial transparency (anti-halo)

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: w, height: h } = info;
const at = (x, y) => (y * w + x) * 4;

function paintWhite(x0, y0, x1, y1) {
  for (let y = Math.floor(y0 * h); y < Math.ceil(y1 * h); y++) {
    for (let x = Math.floor(x0 * w); x < Math.ceil(x1 * w); x++) {
      const i = at(x, y);
      data[i] = data[i + 1] = data[i + 2] = 255;
    }
  }
}

// 1. Erase screenshot artefacts: the circled "!" icon (bottom-right) and the dark bar on the bottom edge.
paintWhite(0.892, 0.88, 0.958, 0.95);
paintWhite(0, 0.99, 1, 1);

// 2. Flood-fill from every edge pixel through near-white pixels and make them transparent.
const isWhite = (i) => data[i] > WHITE && data[i + 1] > WHITE && data[i + 2] > WHITE;
const removed = new Uint8Array(w * h);
const stack = [];
for (let x = 0; x < w; x++) stack.push(x, 0, x, h - 1);
for (let y = 0; y < h; y++) stack.push(0, y, w - 1, y);
while (stack.length) {
  const y = stack.pop();
  const x = stack.pop();
  if (x < 0 || y < 0 || x >= w || y >= h) continue;
  const p = y * w + x;
  if (removed[p] || !isWhite(p * 4)) continue;
  removed[p] = 1;
  data[p * 4 + 3] = 0;
  stack.push(x + 1, y, x - 1, y, x, y + 1, x, y - 1);
}

// 3. Soften the halo: light pixels touching the removed area become partly transparent.
for (let y = 1; y < h - 1; y++) {
  for (let x = 1; x < w - 1; x++) {
    const p = y * w + x;
    if (removed[p]) continue;
    const touches = removed[p - 1] || removed[p + 1] || removed[p - w] || removed[p + w];
    if (!touches) continue;
    const i = p * 4;
    const min = Math.min(data[i], data[i + 1], data[i + 2]);
    if (min > SOFT) data[i + 3] = Math.round(((255 - min) / (255 - SOFT)) * 255);
  }
}

// 4. Trim transparent margins, resize, write.
const trimmed = await sharp(data, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer();
const result = await sharp(trimmed).trim().resize({ width: 800 }).png({ compressionLevel: 9 }).toFile(OUT);
console.log(`wrote ${OUT} ${result.width}x${result.height}`);
