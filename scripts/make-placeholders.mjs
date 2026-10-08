// Generates labelled placeholder photos. Replace any file with a real photo of the same name.
// sharp ships with Next.js; this script is a dev tool and is not part of the site build.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";

const OUT = join(process.cwd(), "public", "images");

// [file, width, height, sky, glow, land, label]
const scenes = [
  ["hero/thimphu-fields.jpg", 1920, 1280, "#1d2530", "#c98a4a", "#4f6b3a", "Hero · Thimphu herb fields"],
  ["story/stage-1.jpg", 1600, 1200, "#161c26", "#6a6f8a", "#3d4a5a", "Story 1 · New York, 2007"],
  ["story/stage-2.jpg", 1600, 1200, "#1a2028", "#8a6a4a", "#4a5d3a", "Story 2 · Thimphu, 2015"],
  ["story/stage-3.jpg", 1600, 1200, "#1c2420", "#9aa86a", "#4f6b3a", "Story 3 · The farm, 2016"],
  ["story/stage-4.jpg", 1600, 1200, "#202833", "#6f7a86", "#3f5a33", "Story 4 · Above 2,750 m"],
  ["story/stage-5.jpg", 1600, 1200, "#1f2620", "#b99a6a", "#5DAE3B", "Story 5 · Herbs up close"],
  ["story/stage-6.jpg", 1600, 1200, "#241e18", "#D9822B", "#6b5a3a", "Story 6 · Tea in the cup"],
  ["story/summit.jpg", 1920, 1280, "#2a3442", "#d9b27a", "#5a6650", "Summit"],
  ["fields/herb-rows.jpg", 1920, 1080, "#1c2420", "#9aa86a", "#5DAE3B", "Herb rows"],
  ["fields/drying.jpg", 1920, 1080, "#241e18", "#D9822B", "#6b5a3a", "Drying herbs"],
  ["fields/farm.jpg", 1920, 1080, "#1a2028", "#8a6a4a", "#4a5d3a", "The farm"],
  ["teas/chamomile.jpg", 1000, 1250, "#16130f", "#e9d27a", "#2a2a22", "Tea · Chamomile"],
  ["teas/peppermint.jpg", 1000, 1250, "#16130f", "#5DAE3B", "#2a2a22", "Tea · Peppermint"],
  ["teas/lemon-verbena.jpg", 1000, 1250, "#16130f", "#9fc25a", "#2a2a22", "Tea · Lemon Verbena"],
  ["teas/sea-buckthorn.jpg", 1000, 1250, "#16130f", "#E86A1C", "#2a2a22", "Tea · Sea Buckthorn"],
  ["teas/hypericum.jpg", 1000, 1250, "#16130f", "#F2C230", "#2a2a22", "Tea · Hypericum"],
  ["people/farmer-1.jpg", 1000, 1250, "#1f2620", "#b99a6a", "#4f6b3a", "Farmer photo 1"],
  ["people/farmer-2.jpg", 1000, 1250, "#1f2620", "#9aa86a", "#4f6b3a", "Farmer photo 2"],
  ["people/farmer-3.jpg", 1000, 1250, "#1f2620", "#c98a4a", "#4f6b3a", "Farmer photo 3"],
  ["people/farmer-4.jpg", 1000, 1250, "#1f2620", "#8a6a4a", "#4f6b3a", "Farmer photo 4"],
];

// Small deterministic PRNG so placeholders are identical on every run.
function random(seed) {
  let t = seed;
  return () => {
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function ridge(w, h, base, amp, seed, fill, opacity) {
  const next = random(seed);
  const steps = 14;
  const points = [`0,${h}`];
  for (let i = 0; i <= steps; i++) {
    const x = Math.round((w * i) / steps);
    const y = Math.round(h * (base - amp * next()));
    points.push(`${x},${y}`);
  }
  points.push(`${w},${h}`);
  return `<polygon points="${points.join(" ")}" fill="${fill}" fill-opacity="${opacity}"/>`;
}

function svg(w, h, sky, glow, land, label, seed) {
  const fontSize = Math.max(18, Math.round(w / 55));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${sky}"/><stop offset="1" stop-color="${glow}"/>
  </linearGradient></defs>
  <rect width="${w}" height="${h}" fill="url(#sky)"/>
  ${ridge(w, h, 0.62, 0.3, seed, "#3a4048", 0.8)}
  ${ridge(w, h, 0.74, 0.2, seed + 1, land, 0.9)}
  ${ridge(w, h, 0.88, 0.12, seed + 2, "#141512", 1)}
  <text x="${Math.round(w * 0.05)}" y="${Math.round(h * 0.08)}" font-family="Segoe UI, Arial, sans-serif"
    font-size="${fontSize}" letter-spacing="2" fill="#F4F1EA" fill-opacity="0.6">PLACEHOLDER · ${label}</text>
</svg>`;
}

let seed = 11;
for (const [file, w, h, sky, glow, land, label] of scenes) {
  const path = join(OUT, file);
  await mkdir(dirname(path), { recursive: true });
  await sharp(Buffer.from(svg(w, h, sky, glow, land, label, seed)))
    .jpeg({ quality: 72, mozjpeg: true })
    .toFile(path);
  seed += 10;
  console.log(`wrote public/images/${file}`);
}
