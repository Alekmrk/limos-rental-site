import sharp from 'sharp';
import path from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ASSETS_DIR = path.join(__dirname, '../src/assets');
const OUTPUT_DIR = path.join(__dirname, '../src/assets/optimized');

const IMAGE_CONFIGS = {
  banner: {
    sizes: [2048, 1536, 1024, 768],
    quality: 80,
  },
  car: {
    sizes: [800, 600, 400],
    quality: 85,
  },
  logo: {
    sizes: [192, 96],
    quality: 90,
  },
  feature: {
    sizes: [400, 200],
    quality: 85,
  },
};

async function ensureDir(dir) {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

async function optimizeImage(inputPath, type) {
  const filename = path.basename(inputPath, path.extname(inputPath));
  const config = IMAGE_CONFIGS[type];
  
  if (!config) {
    console.warn(`No configuration found for type: ${type}`);
    return;
  }

  await ensureDir(OUTPUT_DIR);
  
  const promises = config.sizes.map(async (width) => {
    const outputFilename = `${filename}-${width}.webp`;
    const outputPath = path.join(OUTPUT_DIR, outputFilename);
    
    await sharp(inputPath)
      .resize(width, null, {
        withoutEnlargement: true,
        fit: 'inside',
      })
      .webp({
        quality: config.quality,
        effort: 6,
        smartSubsample: true,
      })
      .toFile(outputPath);
      
    console.log(`Optimized: ${outputFilename}`);
  });

  await Promise.all(promises);
}

async function main() {
  try {
    // Optimize banner images
    await optimizeImage(path.join(ASSETS_DIR, 'banner-image.jpg'), 'banner');
    
    // Optimize car images
    const carDir = path.join(ASSETS_DIR, 'cars');
    const carFiles = await fs.readdir(carDir);
    await Promise.all(
      carFiles.map(file => optimizeImage(path.join(carDir, file), 'car'))
    );
    
    // Optimize logo
    await optimizeImage(path.join(ASSETS_DIR, 'elitewaylogo.png'), 'logo');
    
    // Optimize feature icons
    const featureFiles = (await fs.readdir(ASSETS_DIR))
      .filter(file => file.startsWith('feature-'));
    await Promise.all(
      featureFiles.map(file => optimizeImage(path.join(ASSETS_DIR, file), 'feature'))
    );
    
  } catch (error) {
    console.error('Error optimizing images:', error);
    process.exit(1);
  }
}

main();