import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Extract YouTube video ID from URL
 */
function extractYouTubeId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/,
    /youtube\.com\/embed\/([^&\s?]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * Generate search query for alternative videos
 */
function generateSearchQuery(title, context) {
  // Extract keywords from title and context
  const keywords = [];

  // Common Arduino/Electronics keywords to prioritize
  const priorityTerms = ['Arduino', 'ESP32', 'sensor', 'tutorial', 'beginner', 'basics'];

  const combined = `${title} ${context}`.toLowerCase();

  priorityTerms.forEach(term => {
    if (combined.includes(term.toLowerCase())) {
      keywords.push(term);
    }
  });

  // Clean up and create search query
  const searchQuery = keywords.length > 0
    ? keywords.join(' ') + ' tutorial'
    : 'Arduino tutorial';

  return {
    query: searchQuery,
    youtubeUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`,
    googleUrl: `https://www.google.com/search?q=${encodeURIComponent(searchQuery + ' youtube')}`
  };
}

/**
 * Analyze lesson for YouTube links
 */
function analyzeLesson(lessonPath, dayId) {
  const content = fs.readFileSync(lessonPath, 'utf-8');
  const lines = content.split('\n');
  const videos = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Match YouTube links in markdown format
    const match = line.match(/\[([^\]]+)\]\((https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)[^)]+)\)/);

    if (match) {
      const [, title, url] = match;
      const videoId = extractYouTubeId(url);

      // Get context (previous few lines for better search suggestions)
      const contextStart = Math.max(0, i - 3);
      const context = lines.slice(contextStart, i + 1).join(' ');

      const searchAlternative = generateSearchQuery(title, context);

      videos.push({
        lineNumber: i + 1,
        title,
        url,
        videoId,
        embedUrl: videoId ? `https://www.youtube.com/embed/${videoId}` : null,
        watchUrl: videoId ? `https://www.youtube.com/watch?v=${videoId}` : null,
        searchAlternative,
        context: context.substring(0, 200) // First 200 chars of context
      });
    }
  }

  return {
    dayId,
    lessonPath,
    videoCount: videos.length,
    videos
  };
}

/**
 * Main validation function
 */
async function main() {
  console.log('🎥 YouTube Link Validation Report\n');
  console.log('=' .repeat(80));
  console.log('\n');

  const rootDir = path.join(__dirname, '..');
  const lessonsDir = path.join(rootDir, 'content', 'lessons');

  const allVideos = [];
  let totalVideos = 0;

  // Process all 30 lessons
  for (let i = 1; i <= 30; i++) {
    const dayId = `day${String(i).padStart(2, '0')}`;
    const lessonPath = path.join(lessonsDir, dayId, 'lesson.md');

    if (!fs.existsSync(lessonPath)) {
      console.log(`⚠️  ${dayId}: lesson.md not found, skipping`);
      continue;
    }

    const analysis = analyzeLesson(lessonPath, dayId);

    if (analysis.videoCount > 0) {
      allVideos.push(analysis);
      totalVideos += analysis.videoCount;

      console.log(`\n📘 ${dayId.toUpperCase()}`);
      console.log('-'.repeat(80));

      analysis.videos.forEach((video, idx) => {
        console.log(`\n  Video ${idx + 1}:`);
        console.log(`  📌 Title: ${video.title}`);
        console.log(`  🔗 URL: ${video.url}`);
        console.log(`  🆔 Video ID: ${video.videoId || 'N/A'}`);
        console.log(`  📍 Line: ${video.lineNumber}`);

        if (video.searchAlternative) {
          console.log(`  🔍 Alternative Search:`);
          console.log(`     Query: "${video.searchAlternative.query}"`);
          console.log(`     YouTube: ${video.searchAlternative.youtubeUrl}`);
          console.log(`     Google: ${video.searchAlternative.googleUrl}`);
        }
      });
    }
  }

  console.log('\n');
  console.log('=' .repeat(80));
  console.log('\n📊 Summary:');
  console.log(`   Total lessons with videos: ${allVideos.length}`);
  console.log(`   Total YouTube links found: ${totalVideos}`);
  console.log('\n💡 Manual Testing Required:');
  console.log('   Please test each video link manually in a browser');
  console.log('   If a video is unavailable, use the alternative search links above');
  console.log('   to find suitable replacements.\n');

  console.log('📝 Recommendations:');
  console.log('   1. Test all links in an incognito/private browser window');
  console.log('   2. Check for region restrictions');
  console.log('   3. Look for "Video unavailable" or "Private video" messages');
  console.log('   4. For broken links, use the provided search queries');
  console.log('   5. Prefer official Arduino channel videos when available');
  console.log('   6. Ensure replacement videos have captions/transcripts');
  console.log('\n');

  // Write detailed report to JSON file
  const reportPath = path.join(rootDir, 'scripts', 'youtube-links-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(allVideos, null, 2));
  console.log(`📄 Detailed report saved to: ${reportPath}\n`);
}

main().catch(console.error);
