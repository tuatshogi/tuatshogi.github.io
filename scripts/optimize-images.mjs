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
const responsive = (file) => resolve(responsiveRoot, file);
const publicFile = (file) => resolve(publicRoot, file);

const responsiveImageJobs = [
  {
    input: "top.png",
    outputName: "hero",
    widths: [480, 640, 768, 1024, 1254],
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

for (const width of [72, 96, 144]) {
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

for (const width of [160, 280, 320, 560]) {
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

// Preserve the approved sharing image as a static asset across builds.
const ogStats = await stat(publicFile("og-image.jpg"));
console.log(
  `Optimized images generated: 37 responsive files; OGP image: ${Math.round(ogStats.size / 1024)} kB`,
);
