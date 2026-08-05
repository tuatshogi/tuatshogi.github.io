import { copyFile, mkdir, rm, stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const generatedRoot = resolve(projectRoot, "src/assets/generated");
const responsiveRoot = resolve(generatedRoot, "responsive");
const publicRoot = resolve(projectRoot, "public");

await rm(responsiveRoot, { recursive: true, force: true });
await Promise.all([
  mkdir(generatedRoot, { recursive: true }),
  mkdir(responsiveRoot, { recursive: true }),
  mkdir(publicRoot, { recursive: true }),
]);

const source = (file) => resolve(projectRoot, file);
const generated = (file) => resolve(generatedRoot, file);
const responsive = (file) => resolve(responsiveRoot, file);
const publicFile = (file) => resolve(publicRoot, file);

const responsiveImageJobs = [
  {
    input: "top.png",
    outputName: "hero",
    widths: [480, 768, 1024, 1254],
    avifQuality: 70,
    webpQuality: 90,
  },
  {
    input: "20260709_180604.jpg",
    outputName: "activity-room",
    widths: [640, 960, 1280, 1600],
    avifQuality: 65,
    webpQuality: 82,
  },
  {
    input: "20260524_191148.jpg",
    outputName: "activity-tournament",
    widths: [640, 960, 1280],
    avifQuality: 65,
    webpQuality: 82,
  },
  {
    input: "cumpasmap.jpg",
    outputName: "campus-map",
    widths: [640, 960, 1280],
    avifQuality: 75,
    webpQuality: 90,
  },
];

for (const job of responsiveImageJobs) {
  for (const width of job.widths) {
    const pipeline = sharp(source(job.input))
      .rotate()
      .resize({ width, withoutEnlargement: true });

    await Promise.all([
      pipeline
        .clone()
        .avif({ quality: job.avifQuality, effort: 2 })
        .toFile(responsive(`${job.outputName}-${width}.avif`)),
      pipeline
        .clone()
        .webp({ quality: job.webpQuality, effort: 4 })
        .toFile(responsive(`${job.outputName}-${width}.webp`)),
    ]);
  }
}

for (const width of [72, 144]) {
  await sharp(source("Designer.png"))
    .rotate()
    .resize({
      width,
      height: width,
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      withoutEnlargement: true,
    })
    .webp({ lossless: true, effort: 6 })
    .toFile(responsive(`emblem-${width}.webp`));
}

for (const width of [160, 280, 560]) {
  await sharp(source("logo.png"))
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ lossless: true, effort: 6 })
    .toFile(responsive(`logo-${width}.webp`));
}

await copyFile(source("favicon.ico"), publicFile("favicon.ico"));

const organizationEmblem = await sharp(source("Designer.png"))
  .resize({
    width: 396,
    height: 396,
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toBuffer();

await sharp({
  create: {
    width: 512,
    height: 512,
    channels: 4,
    background: { r: 15, g: 51, b: 80, alpha: 1 },
  },
})
  .composite([{ input: organizationEmblem, left: 58, top: 58 }])
  .png({ compressionLevel: 9, palette: true })
  .toFile(publicFile("organization-logo.png"));

const ogBackground = await sharp(generated("og-background.png"))
  .resize(1200, 630, { fit: "cover" })
  .toBuffer();
const ogWordmark = await sharp(source("logo.png"))
  .resize({ width: 690, withoutEnlargement: true })
  .png()
  .toBuffer();
const ogEmblem = await sharp(source("Designer.png"))
  .resize({
    width: 125,
    height: 145,
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toBuffer();
const ogCopy = Buffer.from(`
  <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <rect x="72" y="251" width="112" height="4" rx="2" fill="#c9a34a"/>
    <text x="72" y="350" fill="#f8faf8" font-family="Noto Serif CJK JP, Yu Mincho, serif" font-size="61" font-weight="700" letter-spacing="2">詰みは見える。</text>
    <text x="72" y="431" fill="#f8faf8" font-family="Noto Serif CJK JP, Yu Mincho, serif" font-size="61" font-weight="700" letter-spacing="2">将来は見えない。</text>
    <text x="74" y="526" fill="#c9a34a" font-family="Noto Sans CJK JP, Yu Gothic, sans-serif" font-size="24" font-weight="700" letter-spacing="5">公式WEBサイト</text>
  </svg>
`);

await sharp(ogBackground)
  .composite([
    { input: ogWordmark, left: 68, top: 87 },
    { input: ogCopy, left: 0, top: 0 },
    { input: ogEmblem, left: 1000, top: 54 },
  ])
  .jpeg({ quality: 82, progressive: true, mozjpeg: true })
  .toFile(publicFile("og-image.jpg"));

const ogStats = await stat(publicFile("og-image.jpg"));
console.log(
  `Optimized images generated: 33 responsive files; OGP image: ${Math.round(ogStats.size / 1024)} kB`,
);
