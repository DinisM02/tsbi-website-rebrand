#!/usr/bin/env node

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const imageDir = path.join(__dirname, '../src/assets');
const optimizationConfig = {
  jpeg: { quality: 75, mozjpeg: true },
  png: { quality: 80 },
  webp: { quality: 75 },
};

// Images to optimize (largest first)
const imagesToOptimize = [
  { src: 'team/viktoria.png', formats: ['webp', 'original'] },
  { src: 'hero-images/new-hero-main.png', formats: ['webp', 'original'] },
  { src: 'hero-images/pages/contact-hero.jpg', formats: ['webp', 'original'] },
  { src: 'hero-images/pages/about-hero.jpg', formats: ['webp', 'original'] },
  { src: 'hero-images/pages/training-hero.jpg', formats: ['webp', 'original'] },
  { src: 'hero-images/pages/resources-hero.jpg', formats: ['webp', 'original'] },
  { src: 'team/jinesh.jpg', formats: ['webp', 'original'] },
  { src: 'team/saee.jpg', formats: ['webp', 'original'] },
];

async function optimizeImage(relPath, formats) {
  const fullPath = path.join(imageDir, relPath);
  const ext = path.extname(relPath).toLowerCase();
  const baseName = path.basename(relPath, ext);
  const dirName = path.dirname(relPath);

  console.log(`Processing: ${relPath}`);

  try {
    const stats = fs.statSync(fullPath);
    const originalSize = (stats.size / 1024).toFixed(2);
    console.log(`  Original: ${originalSize} KB`);

    let image = sharp(fullPath);
    const metadata = await image.metadata();

    // Reduce dimensions if very large (hero images: max 1920px width)
    if (metadata.width > 1920) {
      image = image.resize(1920, Math.round((metadata.height * 1920) / metadata.width), {
        withoutEnlargement: true,
      });
    }

    // Generate optimized versions for each format
    for (const fmt of formats) {
      if (fmt === 'webp') {
        const webpPath = path.join(imageDir, dirName, `${baseName}.webp`);
        const webpSize = await image
          .webp({ quality: optimizationConfig.webp.quality })
          .toFile(webpPath)
          .catch((err) => {
            console.error(`  WebP conversion failed:`, err.message);
            return null;
          });

        if (webpSize) {
          const savedKb = (originalSize - webpSize.size / 1024).toFixed(2);
          const savings = (((originalSize - webpSize.size / 1024) / originalSize) * 100).toFixed(1);
          console.log(
            `  WebP: ${(webpSize.size / 1024).toFixed(2)} KB (saved ${savedKb} KB, ${savings}%)`
          );
        }
      } else if (fmt === 'original') {
        // Optimize original format
        if (ext === '.png') {
          const optimizedPath = fullPath.replace('.png', '.opt.png');
          const dest = await image.png({ quality: optimizationConfig.png.quality }).toFile(optimizedPath);
          const reduction = (originalSize - dest.size / 1024).toFixed(2);
          console.log(
            `  PNG optimized: ${(dest.size / 1024).toFixed(2)} KB (saved ${reduction} KB)`
          );
          // Replace original
          fs.renameSync(optimizedPath, fullPath);
        } else if (ext === '.jpg' || ext === '.jpeg') {
          const optimizedPath = fullPath.replace(ext, '.opt' + ext);
          const dest = await image.jpeg({ quality: optimizationConfig.jpeg.quality }).toFile(optimizedPath);
          const reduction = (originalSize - dest.size / 1024).toFixed(2);
          console.log(
            `  JPEG optimized: ${(dest.size / 1024).toFixed(2)} KB (saved ${reduction} KB)`
          );
          // Replace original
          fs.renameSync(optimizedPath, fullPath);
        }
      }
    }
  } catch (err) {
    console.error(`  Error processing ${relPath}:`, err.message);
  }

  console.log('');
}

async function main() {
  console.log('🖼️  Optimizing images...\n');

  for (const img of imagesToOptimize) {
    await optimizeImage(img.src, img.formats);
  }

  console.log('✅ Image optimization complete!');
}

main().catch(console.error);
