import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Copy image assets from lesson directories to frontend public folder
async function main() {
  console.log('🖼️  Starting asset copy process...\n');

  const rootDir = path.join(__dirname, '..');
  const publicAssetsDir = path.join(rootDir, 'frontend', 'public', 'assets');

  // Create public assets directory if it doesn't exist
  if (!fs.existsSync(publicAssetsDir)) {
    fs.mkdirSync(publicAssetsDir, { recursive: true });
  }

  let copiedCount = 0;
  let errorCount = 0;
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'];

  // Process all 30 lesson directories
  for (let i = 1; i <= 30; i++) {
    const dayId = `day${String(i).padStart(2, '0')}`;
    const sourceDayDir = path.join(rootDir, 'content', 'lessons', dayId);
    const targetDayDir = path.join(publicAssetsDir, dayId);

    // Skip if source directory doesn't exist
    if (!fs.existsSync(sourceDayDir)) {
      console.log(`⚠️  ${dayId}: Directory not found, skipping`);
      continue;
    }

    // Read all files in the day directory
    const files = fs.readdirSync(sourceDayDir);
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return imageExtensions.includes(ext);
    });

    if (imageFiles.length === 0) {
      console.log(`   ${dayId}: No images found`);
      continue;
    }

    // Create target directory
    if (!fs.existsSync(targetDayDir)) {
      fs.mkdirSync(targetDayDir, { recursive: true });
    }

    // Copy each image
    imageFiles.forEach(imageFile => {
      try {
        const sourcePath = path.join(sourceDayDir, imageFile);
        const targetPath = path.join(targetDayDir, imageFile);

        fs.copyFileSync(sourcePath, targetPath);

        console.log(`✅ ${dayId}/${imageFile}`);
        copiedCount++;
      } catch (error) {
        console.error(`❌ ${dayId}/${imageFile}: ${error.message}`);
        errorCount++;
      }
    });
  }

  console.log('\n📊 Asset Copy Summary:');
  console.log(`   ✅ Images copied: ${copiedCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   📁 Destination: ${publicAssetsDir}`);
}

main().catch(console.error);
