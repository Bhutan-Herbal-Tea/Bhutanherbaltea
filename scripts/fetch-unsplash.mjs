// Downloads free Unsplash photos used as stand-ins for the client's own photography,
// resizes them with sharp (ships with Next.js) and writes public/images/CREDITS.md.
// Replace any file with the client's photo of the same name; then update its line in CREDITS.md.
// Pass file names to fetch only those (e.g. `npm run assets:photos -- teas/chrysanthemum.jpg`);
// CREDITS.md is always written for the full list.
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const OUT = join(process.cwd(), "public", "images");

// [file, Unsplash photo id, photographer, subject, max width]
const PHOTOS = [
  ["hero/terraced-fields.jpg", "K32tIswSJTc", "PENDEN Wangchuk", "Terraced fields and farmhouses on a Bhutanese hillside", 1600],
  ["fields/farm.jpg", "QkbIxJhALtk", "Pema Gyamtsho", "Golden fields below a Bhutanese building", 1800],
  ["fields/herb-rows.jpg", "LUW-ROb7P9I", "David Guliciuc", "Rows of young plants below mountains", 1800],
  ["fields/drying.jpg", "UN-VxzWSmYc", "malwina nogaj", "Bunches of herbs hung up to dry", 1600],
  ["story/stage-1.jpg", "_QdFx92MO2U", "Luca Bravo", "New York skyline at dusk", 1600],
  ["story/stage-2.jpg", "7JvERsMVkCg", "Passang Tobgay", "Thimphu valley past a line of prayer flags", 1600],
  ["story/stage-3.jpg", "bdfozlEMQVI", "Erda Estremera", "Young seedlings in dark soil", 1600],
  ["story/stage-4.jpg", "GqNxNI0fivw", "Md Efthakhar Ul Alam", "Mountain ridges above the clouds", 1800],
  ["story/stage-5.jpg", "tbiV-yc903g", "Zoe Richardson", "A hand holding a young plant", 1400],
  ["story/stage-6.jpg", "qEcWgrTG578", "Drew Jemmett", "A cup of tea among dried herbs", 1600],
  ["story/summit.jpg", "9uylKZlgW_0", "Luc Santeramo", "Prayer flags at a snowy mountain pass", 1800],
  ["teas/chamomile.jpg", "m_osD-h26dI", "Chirag Saini", "Chamomile flowers in bloom", 1200],
  ["teas/mint.jpg", "bHWRSq8fUUE", "SIMON LEE", "Fresh mint leaves", 1200],
  ["teas/lemon-verbena.jpg", "_zdARSmCZh4", "Alejandro Piñero Amerio", "Leafy green herb stems", 1200],
  ["teas/himalayan-sea-berry.jpg", "UEsg8t4Oky4", "Juneta Jurgaityte", "Orange sea buckthorn berries", 1200],
  ["teas/chrysanthemum.jpg", "RHjqD23qfHs", "Yang Yu", "Yellow chrysanthemum flowers", 1200],
  ["teas/hypericum.jpg", "1-Qg951Wwfs", "Ronin", "Yellow hypericum flowers", 1200],
  ["people/farmer-1.jpg", "Mw1bnPE4MI0", "一只猫的橘", "A person working among tea bushes", 1200],
  ["people/farmer-2.jpg", "9zVMF1HJiic", "Charlotte Thomas", "Hands holding freshly picked herbs", 1200],
  ["people/farmer-3.jpg", "TNtnoTSXJmg", "Jessie Maxwell", "A basket of freshly cut herbs", 1200],
  ["people/farmer-4.jpg", "JLpDkdcuceI", "Annie Spratt", "Hands sorting herbs on a table", 1200],
];

const lines = [
  "# Photo credits",
  "",
  "Stand-in photography from [Unsplash](https://unsplash.com/license), free to use under the Unsplash License.",
  "Replace each file with the client's own photo of the same name, then update or remove its line here.",
  "",
  "| File | Subject | Photographer | Source |",
  "| --- | --- | --- | --- |",
];

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Unsplash rate-limits bursts (HTTP 429), so pause between photos and back off on 429.
async function download(id, file) {
  for (let attempt = 1; attempt <= 6; attempt++) {
    const response = await fetch(`https://unsplash.com/photos/${id}/download?force=true&w=2400`, {
      headers: { "User-Agent": "Mozilla/5.0 (asset script)" },
    });
    if (response.ok) return Buffer.from(await response.arrayBuffer());
    if (response.status !== 429) throw new Error(`${file}: HTTP ${response.status}`);
    console.log(`${file}: rate limited, waiting ${attempt * 20}s`);
    await wait(attempt * 20_000);
  }
  throw new Error(`${file}: still rate limited after 6 attempts`);
}

const only = process.argv.slice(2);

for (const [file, id, photographer, subject, width] of PHOTOS) {
  lines.push(`| \`${file}\` | ${subject} | ${photographer} | https://unsplash.com/photos/${id} |`);
  if (only.length > 0 && !only.includes(file)) continue;
  const input = await download(id, file);
  await wait(2_500);
  const path = join(OUT, file);
  await mkdir(dirname(path), { recursive: true });
  // The hero has a 300 KB budget, so it gets a lower quality setting.
  const quality = file.startsWith("hero/") ? 66 : 72;
  const info = await sharp(input)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .jpeg({ quality, mozjpeg: true })
    .toFile(path);
  console.log(`${file}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB`);
}

await writeFile(join(OUT, "CREDITS.md"), lines.join("\n") + "\n");
console.log("wrote public/images/CREDITS.md");
