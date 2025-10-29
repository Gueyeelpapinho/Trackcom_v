import fs from "fs";
import path from "path";
import sharp from "sharp";
import pngToIco from "png-to-ico";

const projectRoot = process.cwd();
const publicDir = path.resolve(projectRoot, "public");
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

async function findSourceImage() {
  const inputArg = process.argv[2];
  if (inputArg) {
    const p = path.resolve(projectRoot, inputArg);
    if (fs.existsSync(p)) return p;
  }

  // Try common locations
  const candidates = [
    path.resolve(projectRoot, "assets/trackcom-logo.png"),
    path.resolve(projectRoot, "assets/trackcom-logo.jpg"),
    path.resolve(projectRoot, "assets/trackcom-logo.svg"),
    path.resolve(publicDir, "favicon.ico"), // Use existing favicon as fallback
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }

  return null;
}

async function main() {
  const inputPath = await findSourceImage();
  if (!inputPath) {
    console.error("No source image found.");
    console.error("Options:");
    console.error("  1. Place your logo at assets/trackcom-logo.png");
    console.error("  2. Pass a path: npm run assets:gen path/to/image.png");
    console.error("  3. Or ensure public/favicon.ico exists (will be used as fallback)");
    process.exit(1);
  }

  console.log(`Using source image: ${inputPath}`);

  const isFavicon = inputPath.endsWith(".ico");
  let shouldGenerateFavicon = !isFavicon;

  // Generate favicon only if source is not .ico
  if (shouldGenerateFavicon) {
    const sizes = [16, 32, 48, 64, 128, 256];
    const pngBuffers = [];
    for (const size of sizes) {
      const buf = await sharp(inputPath)
        .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer();
      pngBuffers.push(buf);
    }

    const icoBuffer = await pngToIco(pngBuffers);
    fs.writeFileSync(path.join(publicDir, "favicon.ico"), icoBuffer);
    console.log("✓ Generated: public/favicon.ico");
  } else {
    console.log("✓ Using existing: public/favicon.ico");
  }

  // Always generate Open Graph image (1200x630)
  const ogBuffer = await sharp(inputPath)
    .resize(1200, 630, { fit: "contain", background: { r: 10, g: 18, b: 30, alpha: 1 } })
    .png({ compressionLevel: 9 })
    .toBuffer();
  fs.writeFileSync(path.join(publicDir, "trackcom-og.png"), ogBuffer);
  console.log("✓ Generated: public/trackcom-og.png");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


