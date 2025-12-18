# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a 30-day Arduino beginner's course organized into daily lessons. Each lesson teaches fundamental electronics and microcontroller programming concepts through hands-on activities with Arduino Uno, ESP32, and common sensors/actuators.

## Repository Structure

```
AndruinoBeginner/
├── content/                   # Source lesson materials
│   └── lessons/               # Daily lesson folders (day01-day30)
│       ├── day01/
│       │   ├── lesson.md      # Primary lesson content
│       │   ├── review.md      # Educator review and feedback
│       │   └── [images]       # Supporting visual materials
│       ├── day02/
│       └── ...day30/
├── frontend/                  # React web application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Route pages
│   │   ├── contexts/          # React context providers
│   │   ├── hooks/             # Custom React hooks
│   │   ├── data/lessons/      # Generated JSON lesson data
│   │   └── utils/             # Utility functions and API client
│   ├── public/assets/         # Copied images from lessons
│   └── package.json
├── backend/                   # Express.js API server
│   ├── src/
│   │   ├── models/            # Mongoose schemas
│   │   ├── controllers/       # Route handlers
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Auth and error handling
│   │   └── config/            # Configuration files
│   └── package.json
├── scripts/                   # Build and utility scripts
│   ├── parseLessons.js        # Markdown to JSON converter
│   ├── copyAssets.js          # Image asset copier
│   └── generateCourseStructure.js
├── CLAUDE.md                  # This file
└── package.json               # Workspace configuration
```

### Lesson Organization

- **Days 1-5**: Foundation (breadboard, safety, LEDs, buttons, PWM, sensors)
- **Days 6-9**: Environmental sensors (DHT, PIR, flame, ultrasonic)
- **Days 10-14**: Displays and motors (7-segment, LCD, servo, DC motor, stepper)
- **Days 15-21**: Advanced sensors and persistence (accelerometer, EEPROM, RTC, water level, IR)
- **Days 22-28**: Networking and ESP32 (Wi-Fi, web servers, MQTT, advanced communication)
- **Days 29-30**: Reliability and capstone project

## Content Structure

Each lesson follows a consistent format:

1. **Learning Objectives** - Clear, measurable goals
2. **Materials Needed** - Required components with specifications
3. **Theory Section** - Component operation and principles
4. **Wiring Instructions** - Detailed connection diagrams and pin assignments
5. **Code Examples** - Complete, tested Arduino/ESP32 sketches with explanations
6. **Activities** - Hands-on challenges and extensions
7. **Troubleshooting** - Common issues and solutions
8. **Summary** - Recap and preview of next lesson

### Review Files

Each `review.md` contains:
- Expert educator feedback on the lesson
- Line-specific improvement suggestions
- Instructor responses documenting implemented changes
- Table format tracking suggestion implementation

## Technical Context

### Hardware Platforms

**Arduino Uno** (primary platform for Days 1-21):
- ATmega328P microcontroller, 16 MHz
- 14 digital I/O pins (6 PWM-capable)
- 6 analog input pins (10-bit ADC)
- Operating voltage: 5V logic
- Recommended supply: 7-12V via barrel jack
- 2 KB EEPROM for persistent storage

**ESP32** (introduced Day 22):
- Dual-core processor, Wi-Fi and Bluetooth
- Operating voltage: 3.3V logic
- Requires level shifting when interfacing with 5V Arduino components
- Used for networking, web servers, MQTT communication

### Common Components Referenced

- **Sensors**: DHT11/DHT22 (temperature/humidity), HC-SR04 (ultrasonic), PIR (motion), water level, accelerometer, photoresistor, flame sensor
- **Displays**: 7-segment, LCD1602 (I²C), dot matrix
- **Actuators**: Servo motors, DC motors (with L293D driver), stepper motors, relays, buzzers
- **Power management**: Voltage regulators, decoupling capacitors (470µF electrolytic + 0.1µF ceramic)
- **Communication**: I²C, serial UART, MQTT

### Safety Standards Emphasized

- Voltage limits: 7-12V supply, never exceed 20V on barrel jack or 5V on 5V pin
- Current limits: 20-40mA per I/O pin maximum
- Flyback diodes required for inductive loads (motors, relays)
- 3.3V device protection when using ESP32
- Water sensor corrosion prevention (power only during readings)

## Citation Format

Lessons use inline citations in the format `【documentID†lineRange】` pointing to authoritative external sources. These citations are maintained throughout lessons to provide traceability to reference materials.

## Working with Lessons

### When Editing Lesson Content

1. **Preserve structure**: Maintain the consistent format across all lessons
2. **Technical accuracy**: Verify component specifications, pin assignments, and voltage/current ratings
3. **Citation integrity**: Keep citation markers intact; they reference external documentation
4. **Code completeness**: Ensure all Arduino/ESP32 sketches are complete and uploadable
5. **Progressive complexity**: Each lesson builds on previous concepts
6. **Cross-references**: Lessons reference previous days (e.g., "using the button from Day 3")

### When Creating New Content

- Follow the established learning objectives → theory → wiring → code → activities format
- Include pin assignments in table format for clarity
- Provide both explanation paragraphs and inline code comments
- Add troubleshooting tables with symptom/cause/solution columns
- Reference specific component datasheets and specifications
- Include interactive activities and challenges

### Image Handling

Images are embedded using standard markdown format. Some lessons include:
- Component photographs for identification
- Wiring diagrams
- Comparison charts (e.g., `dht_comparison.png` in day15)
- Breadboard layouts

## Key Educational Principles

1. **Scaffolded learning**: Concepts build incrementally from basic (LED blink) to complex (multi-sensor smart home)
2. **Hands-on emphasis**: Every lesson includes practical activities, not just theory
3. **Safety-first approach**: Voltage/current limits and protection circuits emphasized from Day 1
4. **Real-world applications**: Project ideas connect to practical use cases
5. **Troubleshooting skills**: Systematic debugging taught alongside implementation
6. **Accessibility**: Alternative video sources suggested, captions/transcripts mentioned

## Capstone Project (Day 30)

The course culminates in a Smart Home Demo System integrating:
- Multiple sensors (DHT22, PIR, water level, ultrasonic)
- Multiple actuators (DC motor fan, servo gate, water pump)
- Arduino ↔ ESP32 serial communication with level shifting
- Web dashboard on ESP32 for monitoring and control
- MQTT cloud communication
- EEPROM-persisted threshold configuration
- Reliability techniques (watchdog timers, decoupling capacitors)

This demonstrates the integration of all prior lessons into a cohesive system.
