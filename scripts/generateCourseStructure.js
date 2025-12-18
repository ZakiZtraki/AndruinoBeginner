import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Generate course structure metadata
function generateCourseStructure() {
  const courseStructure = {
    title: '30-Day Arduino Beginner Course',
    description: 'Learn electronics and microcontroller programming through hands-on lessons with Arduino Uno, ESP32, and common sensors/actuators.',
    totalLessons: 30,
    categories: [
      {
        id: 'foundation',
        name: 'Foundation',
        description: 'Breadboard, safety, LEDs, buttons, PWM, sensors',
        lessons: ['day01', 'day02', 'day03', 'day04', 'day05'],
        color: '#3B82F6' // blue
      },
      {
        id: 'environmental-sensors',
        name: 'Environmental Sensors',
        description: 'DHT, PIR, flame, ultrasonic sensors',
        lessons: ['day06', 'day07', 'day08', 'day09'],
        color: '#10B981' // green
      },
      {
        id: 'displays-motors',
        name: 'Displays and Motors',
        description: '7-segment, LCD, servo, DC motor, stepper',
        lessons: ['day10', 'day11', 'day12', 'day13', 'day14'],
        color: '#F59E0B' // amber
      },
      {
        id: 'advanced-sensors',
        name: 'Advanced Sensors & Persistence',
        description: 'Accelerometer, EEPROM, RTC, water level, IR',
        lessons: ['day15', 'day16', 'day17', 'day18', 'day19', 'day20', 'day21'],
        color: '#8B5CF6' // purple
      },
      {
        id: 'networking-esp32',
        name: 'Networking and ESP32',
        description: 'Wi-Fi, web servers, MQTT, advanced communication',
        lessons: ['day22', 'day23', 'day24', 'day25', 'day26', 'day27', 'day28'],
        color: '#EF4444' // red
      },
      {
        id: 'capstone',
        name: 'Reliability and Capstone',
        description: 'System reliability and final project',
        lessons: ['day29', 'day30'],
        color: '#06B6D4' // cyan
      }
    ],
    learningPath: [
      {
        milestone: 'Getting Started',
        completedAfter: 'day05',
        description: 'You understand basic circuit building, safety, and can control LEDs and read button inputs.'
      },
      {
        milestone: 'Sensor Integration',
        completedAfter: 'day09',
        description: 'You can integrate environmental sensors to read temperature, motion, and distance.'
      },
      {
        milestone: 'Output Devices',
        completedAfter: 'day14',
        description: 'You can control displays and motors for interactive projects.'
      },
      {
        milestone: 'Advanced Concepts',
        completedAfter: 'day21',
        description: 'You understand data persistence, timing, and can work with complex sensors.'
      },
      {
        milestone: 'IoT Ready',
        completedAfter: 'day28',
        description: 'You can build networked IoT devices with ESP32, web servers, and cloud communication.'
      },
      {
        milestone: 'Course Complete',
        completedAfter: 'day30',
        description: 'You\'ve built a complete smart home system integrating multiple sensors and actuators!'
      }
    ],
    prerequisites: {
      hardware: [
        'Arduino Uno or compatible board',
        'ESP32 development board',
        'Complete electronics kit (sensors, motors, displays)',
        'USB cable',
        'Power supply (7-12V)',
        'Breadboard and jumper wires'
      ],
      software: [
        'Arduino IDE or compatible software',
        'USB drivers (CP2102 or CH340)',
        'Basic computer literacy'
      ],
      knowledge: [
        'No prior programming experience required',
        'Basic understanding of electricity helpful but not required',
        'Willingness to learn and experiment'
      ]
    },
    safetyGuidelines: [
      'Never exceed 12V on barrel jack or 5V on 5V pin',
      'Limit current draw to 20-40mA per I/O pin',
      'Always use current-limiting resistors with LEDs',
      'Use flyback diodes with inductive loads (motors, relays)',
      'ESP32 pins are 3.3V - use level shifters for 5V devices',
      'Disconnect power when changing wiring'
    ]
  };

  return courseStructure;
}

// Main execution
async function main() {
  console.log('📋 Generating course structure metadata...\n');

  const rootDir = path.join(__dirname, '..');
  const outputPath = path.join(rootDir, 'frontend', 'src', 'data', 'courseStructure.json');

  try {
    const courseStructure = generateCourseStructure();

    // Ensure data directory exists
    const dataDir = path.dirname(outputPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(courseStructure, null, 2));

    console.log('✅ Course structure generated successfully');
    console.log(`   📁 Location: ${outputPath}`);
    console.log(`   📚 Total lessons: ${courseStructure.totalLessons}`);
    console.log(`   🏷️  Categories: ${courseStructure.categories.length}`);
    console.log(`   🎯 Milestones: ${courseStructure.learningPath.length}`);

  } catch (error) {
    console.error(`❌ Error generating course structure: ${error.message}`);
  }
}

main().catch(console.error);
