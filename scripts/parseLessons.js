import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Convert markdown to structured JSON
function parseLesson(markdownContent, lessonId) {
  const lines = markdownContent.split('\n');

  const lesson = {
    id: lessonId,
    title: '',
    order: parseInt(lessonId.replace('day', '')),
    category: getCategoryForDay(parseInt(lessonId.replace('day', ''))),
    objectives: [],
    materials: [],
    sections: [],
    images: [],
    videos: [],
    activities: [],
    quizzes: [],
    nextLesson: getNextLesson(lessonId),
    prevLesson: getPrevLesson(lessonId)
  };

  let currentSection = null;
  let currentCodeBlock = null;
  let inCodeBlock = false;
  let codeLanguage = '';
  let codeLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Extract title (first # heading)
    if (line.startsWith('# ') && !lesson.title) {
      lesson.title = line.replace('# ', '').trim();
      continue;
    }

    // Start of code block
    if (line.startsWith('```')) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeLanguage = line.replace('```', '').trim() || 'cpp';
        codeLines = [];
      } else {
        // End of code block
        inCodeBlock = false;
        lesson.sections.push({
          type: 'code',
          language: codeLanguage,
          code: codeLines.join('\n'),
          explanation: ''
        });
        codeLines = [];
      }
      continue;
    }

    // Inside code block
    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    // Section headings
    if (line.startsWith('## ')) {
      const heading = line.replace('## ', '').trim();

      // Check for special sections
      if (heading.toLowerCase().includes('objective')) {
        currentSection = 'objectives';
      } else if (heading.toLowerCase().includes('materials')) {
        currentSection = 'materials';
      } else if (heading.toLowerCase().includes('summary') || heading.toLowerCase().includes('next')) {
        currentSection = 'summary';
        lesson.sections.push({
          type: 'theory',
          title: heading,
          content: '',
          citations: []
        });
      } else {
        currentSection = 'theory';
        lesson.sections.push({
          type: 'theory',
          title: heading,
          content: '',
          citations: []
        });
      }
      continue;
    }

    // Extract objectives (bulleted list after ## Objectives)
    if (currentSection === 'objectives' && line.startsWith('- ')) {
      lesson.objectives.push(line.replace('- ', '').trim());
      continue;
    }

    // Extract images
    const imageMatch = line.match(/!\[([^\]]*)\]\(([^)]+)\)/);
    if (imageMatch) {
      const [, alt, imagePath] = imageMatch;
      const localPath = imagePath.includes('/') ? imagePath.split('/').pop() : imagePath;
      const publicPath = `/assets/${lessonId}/${localPath}`;

      lesson.images.push({
        alt,
        path: publicPath,
        localPath: localPath
      });

      // Add image to current section if in a theory section with corrected path
      if (currentSection === 'theory' && lesson.sections.length > 0) {
        const lastSection = lesson.sections[lesson.sections.length - 1];
        if (lastSection.type === 'theory') {
          // Replace the image path with the public assets path
          const correctedLine = line.replace(imagePath, publicPath);
          lastSection.content += `\n${correctedLine}\n`;
        }
      }
      continue;
    }

    // Extract video references
    const videoMatch = line.match(/\[([^\]]+)\]\((https?:\/\/(?:www\.)?youtube\.com[^)]+)\)/);
    if (videoMatch) {
      const [, title, url] = videoMatch;
      lesson.videos.push({
        title,
        url,
        timestamp: extractTimestamp(lines.slice(Math.max(0, i - 3), i + 1).join('\n'))
      });

      lesson.sections.push({
        type: 'video',
        title: title,
        url: url,
        timestamps: extractTimestamp(lines.slice(Math.max(0, i - 3), i + 1).join('\n'))
      });
      continue;
    }

    // Extract interactive activities
    if (line.includes('**Interactive activity:**') || line.includes('**Try this:**') ||
        line.includes('**Hands‑on:**') || line.includes('**Challenge:**')) {
      const activityText = extractBlockquoteContent(lines, i);
      lesson.activities.push({
        type: 'interactive',
        prompt: activityText,
        id: `activity-${lesson.activities.length + 1}`
      });

      lesson.sections.push({
        type: 'activity',
        prompt: activityText,
        activityType: 'interactive',
        id: `activity-${lesson.activities.length}`
      });
      continue;
    }

    // Extract quiz questions
    if (line.includes('**Interactive quiz:**') || line.includes('**Question:**')) {
      const quizText = extractBlockquoteContent(lines, i);
      const questions = parseQuizQuestions(quizText);

      if (questions.length > 0) {
        lesson.quizzes.push({
          id: `quiz-${lesson.quizzes.length + 1}`,
          questions
        });

        lesson.sections.push({
          type: 'quiz',
          questions,
          quizId: `quiz-${lesson.quizzes.length}`
        });
      }
      continue;
    }

    // Extract citations from line
    const citations = extractCitations(line);

    // Add content to current theory section
    if (currentSection === 'theory' && lesson.sections.length > 0) {
      const lastSection = lesson.sections[lesson.sections.length - 1];
      if (lastSection.type === 'theory') {
        lastSection.content += line + '\n';
        if (citations.length > 0) {
          lastSection.citations.push(...citations);
        }
      }
    } else if (currentSection === 'summary' && lesson.sections.length > 0) {
      const lastSection = lesson.sections[lesson.sections.length - 1];
      if (lastSection.type === 'theory') {
        lastSection.content += line + '\n';
      }
    }

    // Parse materials table
    if (currentSection === 'materials' && line.includes('|')) {
      const materialRow = parseMaterialRow(line);
      if (materialRow) {
        lesson.materials.push(materialRow);
      }
    }
  }

  return lesson;
}

// Extract citations in format 【documentID†lineRange】
function extractCitations(text) {
  const citationPattern = /【([^】]+)】/g;
  const citations = [];
  let match;

  while ((match = citationPattern.exec(text)) !== null) {
    citations.push(match[1]);
  }

  return citations;
}

// Extract blockquote content (lines starting with >)
function extractBlockquoteContent(lines, startIndex) {
  let content = '';
  let i = startIndex;

  while (i < lines.length && (lines[i].startsWith('>') || lines[i].trim() === '')) {
    if (lines[i].startsWith('>')) {
      content += lines[i].replace(/^>\s*/, '') + '\n';
    }
    i++;
  }

  return content.trim();
}

// Extract video timestamp from text like "minutes 0:00 – 3:00" or "0:00-3:00"
function extractTimestamp(text) {
  const timestampMatch = text.match(/(\d+):(\d+)\s*[–-]\s*(\d+):(\d+)/);
  if (timestampMatch) {
    const [, startMin, startSec, endMin, endSec] = timestampMatch;
    return {
      start: parseInt(startMin) * 60 + parseInt(startSec),
      end: parseInt(endMin) * 60 + parseInt(endSec)
    };
  }
  return { start: 0, end: null };
}

// Parse quiz questions from text
function parseQuizQuestions(text) {
  const questions = [];
  const questionLines = text.split('\n').filter(l => l.trim());

  questionLines.forEach((line, index) => {
    if (line.match(/^\d+\./)) {
      const questionText = line.replace(/^\d+\.\s*/, '').replace(/\*\*/g, '');
      questions.push({
        id: `q${index + 1}`,
        question: questionText,
        type: 'text',
        answer: null,
        explanation: ''
      });
    }
  });

  return questions;
}

// Parse material row from markdown table
function parseMaterialRow(line) {
  const cells = line.split('|').map(c => c.trim()).filter(c => c);

  // Skip header and separator rows
  if (cells.length < 2 || cells[0].includes('---') || cells[0].toLowerCase() === 'item') {
    return null;
  }

  return {
    item: cells[0] || '',
    quantity: cells[1] || '',
    notes: cells[2] || ''
  };
}

// Get category based on day number
function getCategoryForDay(dayNum) {
  if (dayNum <= 5) return 'Foundation';
  if (dayNum <= 9) return 'Environmental Sensors';
  if (dayNum <= 14) return 'Displays and Motors';
  if (dayNum <= 21) return 'Advanced Sensors';
  if (dayNum <= 28) return 'Networking and ESP32';
  return 'Reliability and Capstone';
}

// Get next lesson ID
function getNextLesson(lessonId) {
  const dayNum = parseInt(lessonId.replace('day', ''));
  if (dayNum >= 30) return null;
  return `day${String(dayNum + 1).padStart(2, '0')}`;
}

// Get previous lesson ID
function getPrevLesson(lessonId) {
  const dayNum = parseInt(lessonId.replace('day', ''));
  if (dayNum <= 1) return null;
  return `day${String(dayNum - 1).padStart(2, '0')}`;
}

// Main execution
async function main() {
  console.log('🔄 Starting lesson parsing...\n');

  const rootDir = path.join(__dirname, '..');
  const outputDir = path.join(rootDir, 'frontend', 'src', 'data', 'lessons');

  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  let successCount = 0;
  let errorCount = 0;

  // Parse all 30 lessons
  for (let i = 1; i <= 30; i++) {
    const dayId = `day${String(i).padStart(2, '0')}`;
    const lessonPath = path.join(rootDir, 'content', 'lessons', dayId, 'lesson.md');
    const outputPath = path.join(outputDir, `${dayId}.json`);

    try {
      if (!fs.existsSync(lessonPath)) {
        console.log(`⚠️  ${dayId}: lesson.md not found, skipping`);
        errorCount++;
        continue;
      }

      const markdownContent = fs.readFileSync(lessonPath, 'utf-8');
      const lessonData = parseLesson(markdownContent, dayId);

      fs.writeFileSync(outputPath, JSON.stringify(lessonData, null, 2));

      console.log(`✅ ${dayId}: Parsed successfully`);
      console.log(`   - Title: ${lessonData.title}`);
      console.log(`   - Objectives: ${lessonData.objectives.length}`);
      console.log(`   - Sections: ${lessonData.sections.length}`);
      console.log(`   - Images: ${lessonData.images.length}`);
      console.log(`   - Videos: ${lessonData.videos.length}`);
      console.log(`   - Activities: ${lessonData.activities.length}`);
      console.log('');

      successCount++;
    } catch (error) {
      console.error(`❌ ${dayId}: Error parsing - ${error.message}`);
      errorCount++;
    }
  }

  console.log('\n📊 Parsing Summary:');
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   📁 Output directory: ${outputDir}`);
}

main().catch(console.error);
