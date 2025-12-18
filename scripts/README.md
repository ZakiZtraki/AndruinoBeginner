# Build & Validation Scripts

This directory contains scripts for processing lesson content, validating assets, and building the learning platform.

## Available Scripts

### 📚 `parseLessons.js`
Converts Markdown lesson files into structured JSON format for the frontend application.

**What it does:**
- Parses all 30 lesson files from `content/lessons/dayXX/lesson.md`
- Extracts objectives, materials, code blocks, activities, quizzes, and videos
- Fixes image paths to use `/assets/dayXX/filename.png` format
- Preserves citation markers 【documentID†lineRange】
- Outputs JSON files to `frontend/src/data/lessons/`

**Usage:**
```bash
npm run parse-lessons
```

**Output Example:**
```
✅ day01: Parsed successfully
   - Title: Day 1 – Orientation & Safety
   - Objectives: 4
   - Sections: 11
   - Images: 1
   - Videos: 2
```

---

### 🖼️ `copyAssets.js`
Copies images and assets from lesson source folders to the frontend public directory.

**What it does:**
- Scans all lesson directories for images (.png, .jpg, .jpeg, .gif, .svg, .webp)
- Copies them to `frontend/public/assets/dayXX/`
- Maintains folder structure for proper URL resolution

**Usage:**
```bash
npm run copy-assets
```

**Output Example:**
```
✅ day01/IMG_A57F87DF.jpeg
✅ day02/led_circuit.png
📊 Asset Copy Summary:
   ✅ Images copied: 7
   ❌ Errors: 0
```

---

### 🎥 `validateYouTubeLinks.js`
Scans lesson files for YouTube video links and generates alternative search queries.

**What it does:**
- Finds all YouTube links in lesson Markdown files
- Extracts video IDs and generates embed URLs
- Creates alternative search queries for finding replacements
- Generates detailed JSON report with all findings

**Usage:**
```bash
npm run validate-youtube
```

**Output:**
```
🎥 YouTube Link Validation Report

📘 DAY01
  Video 1:
  📌 Title: Video link
  🔗 URL: https://www.youtube.com/watch?v=ZBD3x6-MgiA
  🆔 Video ID: ZBD3x6-MgiA
  🔍 Alternative Search:
     Query: "Arduino tutorial"
     YouTube: https://www.youtube.com/results?search_query=Arduino%20tutorial
     Google: https://www.google.com/search?q=Arduino%20tutorial%20youtube

📄 Detailed report saved to: scripts/youtube-links-report.json
```

**Report File (`youtube-links-report.json`):**
Contains full details about each video including:
- Line number in source file
- Video title and URL
- Video ID for embedding
- Alternative search queries
- Context around the video reference

---

### 📦 `generateCourseStructure.js`
Creates the course structure metadata file organizing lessons into categories.

**What it does:**
- Defines the 6 learning phases (Foundation, Environmental Sensors, etc.)
- Maps all 30 lessons to their categories
- Generates `frontend/src/data/courseStructure.json`

**Usage:**
```bash
node scripts/generateCourseStructure.js
```

---

## Combined Workflows

### Full Data Migration
Re-parse all lessons and copy all assets:
```bash
npm run migrate-data
```
This runs both `parse-lessons` and `copy-assets` in sequence.

### Content Update Workflow
When updating lesson content:

1. Edit the Markdown file in `content/lessons/dayXX/lesson.md`
2. If images changed, ensure they're in the lesson folder
3. Run data migration:
   ```bash
   npm run migrate-data
   ```
4. Validate YouTube links if video content changed:
   ```bash
   npm run validate-youtube
   ```
5. Rebuild frontend:
   ```bash
   npm run build
   ```

---

## Troubleshooting

### Images Not Showing
1. Verify image exists: `ls frontend/public/assets/dayXX/`
2. Re-run asset copy: `npm run copy-assets`
3. Check browser console for 404 errors
4. Verify image path in JSON: should be `/assets/dayXX/filename.png`

### Videos Not Embedding
1. Run validator: `npm run validate-youtube`
2. Check `youtube-links-report.json` for video details
3. Test video URL in browser (incognito mode)
4. If broken, use alternative search queries provided in report
5. Update Markdown file with working video URL
6. Re-parse lessons: `npm run parse-lessons`

### Parser Errors
- Ensure all lesson.md files use UTF-8 encoding
- Check for unclosed code blocks (```)
- Verify Markdown syntax is valid
- Look for special characters that may need escaping

---

## File Structure

```
scripts/
├── parseLessons.js              # Markdown → JSON converter
├── copyAssets.js                # Image copier
├── validateYouTubeLinks.js      # Link validator
├── generateCourseStructure.js   # Course metadata generator
├── youtube-links-report.json    # Generated validation report
└── README.md                    # This file
```

---

## Development Notes

### Image Path Convention
- Source: `content/lessons/dayXX/image.png`
- Public: `frontend/public/assets/dayXX/image.png`
- Reference: `/assets/dayXX/image.png` (absolute from public root)

### Video URL Patterns
Supported YouTube URL formats:
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`

### Citation Markers
The parser preserves all citation markers in the format:
```
【documentID†lineRange】
```
These provide traceability to original source materials.

---

## Future Enhancements

Potential script improvements:
- [ ] Automated YouTube link availability checker (requires API key)
- [ ] Image optimization (compression, WebP conversion)
- [ ] Broken link detection for external references
- [ ] Accessibility checker for alt text and captions
- [ ] Spell checker for lesson content
- [ ] Code syntax validator for Arduino sketches
