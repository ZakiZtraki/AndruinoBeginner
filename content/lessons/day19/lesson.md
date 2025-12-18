## Day 19 – RFID Reader and Access Control

### Learning objectives

By the end of this lesson you should be able to:

1. **Explain how passive RFID systems work** at a high level and describe the difference between the reader and tag.
2. **Identify the pins and technical specifications** of the RC522 RFID reader module and wire it correctly to an Arduino.
3. **Install and use the MFRC522 library** to read the unique identifier (UID) from an RFID tag.
4. **Create a simple access‑control system** that grants or denies entry based on a tag’s UID and drives an actuator (e.g. a servo) for a lock.
5. **Troubleshoot common issues** such as power problems, range limitations and library errors.

### Introduction – how RFID works

Radio‑frequency identification (RFID) is a non‑contact technology used for identification and tracking.  An RFID system comprises a **reader**, which generates an electromagnetic field, and a **tag** containing a small antenna and memory.  When a passive tag enters the reader’s field, the tag coils pick up enough power to wake up and send back its stored data by modulating the reader’s field (backscatter).  The MFRC522 module used in this lesson communicates using the MIFARE protocol and operates at **13.56 MHz**.  Typical MIFARE tags store **1 kB** of data and can be read at distances up to **5–10 cm** depending on antenna geometry【742639483060541†L95-L99】.

RFID readers contain a radio module, control unit and antenna coil.  The tag is usually a passive component consisting only of an antenna and a microchip; it receives power inductively from the reader’s field and sends data back via load modulation【742639483060541†L65-L79】.  Because the tag has no battery, the read range is limited and strongly affected by antenna size, orientation and nearby metal objects.

### RC522 technical specifications

The RC522 is a compact, low‑cost reader/writer designed around NXP’s MFRC522 chip.  It is widely used with Arduino for hobby projects.  Key specifications are summarised below:

| Parameter | Value | Notes |
|---|---|---|
| **Operating voltage (logic)** | 2.5–3.3 V【173897610469086†L190-L206】 | Use the Arduino’s **3.3 V** pin; pins are 5 V tolerant for logic but the module must not be powered from 5 V【173897610469086†L190-L206】【934284775381414†L70-L80】. |
| **Operating current** | 13–26 mA【173897610469086†L190-L206】 | Low enough to power directly from the Arduino’s 3.3 V regulator. |
| **Operating frequency** | 13.56 MHz【173897610469086†L190-L206】【742639483060541†L95-L97】 | Industry‑standard HF band used by MIFARE and ISO/IEC 14443 tags. |
| **Communication** | SPI (default), I²C or UART【173897610469086†L199-L205】【976556237860093†L157-L164】 | SPI provides fastest throughput; this lesson uses SPI on Arduino hardware pins. |
| **Reading distance** | Up to 5 cm【173897610469086†L190-L206】【976556237860093†L164-L165】 | Practical range depends on tag and antenna. |
| **Logic inputs** | 5 V tolerant【173897610469086†L190-L206】 | Only the VCC pin must be kept at 3.3 V. |
| **Tag compatibility** | ISO/IEC 14443 Type A/B (e.g. MIFARE Classic 1 K)【976556237860093†L275-L287】 | The module can both read and write to compatible tags. |

### Pinout and wiring

The RC522 module has eight pins (VCC, RST, GND, IRQ, MISO, MOSI, SCK and SS/SDA).  When using the module with an Arduino UNO or similar, connect it via **SPI** as follows【173897610469086†L260-L297】【976556237860093†L185-L194】:

1. **Power** – connect **VCC** to the Arduino’s **3.3 V** pin.  Supplying 5 V can damage the module【173897610469086†L218-L224】.  Connect **GND** to Arduino GND.
2. **Reset** – connect **RST** to digital pin 9 (or any free digital pin).  The MFRC522 library will use this to reset the module【173897610469086†L260-L273】.
3. **SPI pins** – connect **MISO** to digital 12, **MOSI** to digital 11, **SCK** to digital 13 and **SS/SDA** to digital 10【173897610469086†L274-L297】【934284775381414†L70-L78】.  These are the hardware SPI pins on the Arduino UNO.
4. **IRQ** – leave disconnected.  The common Arduino library does not use the interrupt pin.【173897610469086†L268-L273】

> **Tip:** The communication pins are 5 V tolerant【173897610469086†L190-L206】, so level‑shifting for MISO/MOSI/SCK is not required.  However, the VCC pin **must** be 3.3 V.  If your project uses long cables or multiple devices, add a 0.1 µF decoupling capacitor across VCC and GND near the module to reduce noise.

### Installing the MFRC522 library

To communicate with the RC522, we’ll use the **MFRC522** library developed by the community.  Install it via the Arduino IDE Library Manager: search for “mfrc522” and click **Install**【173897610469086†L306-L322】.  After installation you will find several example sketches under **File → Examples → MFRC522**.  We will begin with **DumpInfo**, which prints out everything stored on a tag.

### Reading an RFID tag – basic sketch

1. Connect the RC522 module as described above.
2. Open `DumpInfo` from **File → Examples → MFRC522** and upload it to your Arduino.  When you place a tag or key fob near the reader (within ~5 cm) the sketch will show the tag’s **UID** and memory layout in the serial monitor【173897610469086†L325-L342】.
3. Note the UID printed in the monitor.  You will use this in the access‑control example.

> **Understanding the memory map:** MIFARE Classic 1 K tags consist of **16 sectors**, each with **4 blocks** of 16 bytes.  Only three blocks per sector are available for user data; the fourth contains access bits and keys【173897610469086†L346-L376】.  Never overwrite the manufacturer block (sector 0, block 0) as it stores the UID and other immutable information【173897610469086†L378-L389】.

### Example project – simple RFID access system

In this project we will build a basic door‑access system using the RC522 reader, a servo motor from Day 12 and a buzzer from Day 4.  The system compares the UID of an approaching tag with a predefined authorized UID.  If it matches, the servo rotates to unlock the door and a short “success” tone plays; otherwise a different tone signals denial.

**Materials**

* RC522 reader module and MIFARE tag or key fob
* Servo motor (SG90)
* Buzzer (active type)
* Arduino UNO and breadboard
* Jumper wires

**Wiring**

| Component | Arduino pin | Notes |
|---|---|---|
| RC522 VCC | 3.3 V | Use 3.3 V only; do not connect to 5 V【173897610469086†L218-L224】. |
| RC522 GND | GND | Shared ground. |
| RC522 RST | 9 | Reset pin. |
| RC522 SS/SDA | 10 | Slave Select pin. |
| RC522 MOSI | 11 | SPI MOSI. |
| RC522 MISO | 12 | SPI MISO. |
| RC522 SCK | 13 | SPI clock. |
| Servo signal | 6 | Connect servo’s control wire to PWM pin.  Power the servo from 5 V and ground, with a capacitor across supply (see Day 12). |
| Buzzer + | 5 | Active buzzer positive.  Negative to ground. |

**Sketch overview**

This sketch uses the MFRC522 library to read the UID and compares it with an authorized UID stored in a character array.  When a valid tag is detected, the servo moves to an unlocked position for three seconds and the buzzer emits a tone.  Invalid tags trigger a denial tone.  Feel free to customize the authorized UID by replacing the placeholder bytes with your tag’s UID (found using `DumpInfo`).  A simplified listing is shown below; refer to the official examples for full implementation.

```cpp
// Include required libraries
#include <SPI.h>
#include <MFRC522.h>
#include <Servo.h>
#define RST_PIN 9
#define SS_PIN 10
MFRC522 rfid(SS_PIN, RST_PIN);
Servo doorServo;
// Change this to the UID of your master tag
byte authorizedUID[4] = {0xDE, 0xAD, 0xBE, 0xEF};
const int servoLocked = 10;    // angle for locked position
const int servoUnlocked = 90;  // angle for unlocked position
const int buzzerPin = 5;

void setup() {
  Serial.begin(9600);
  SPI.begin();
  rfid.PCD_Init();
  doorServo.attach(6);
  doorServo.write(servoLocked);
  pinMode(buzzerPin, OUTPUT);
  Serial.println("Place tag...");
}

bool uidMatch(byte *uid) {
  for (byte i = 0; i < rfid.uid.size; i++) {
    if (uid[i] != authorizedUID[i]) return false;
  }
  return true;
}

void loop() {
  // Look for new cards
  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) {
    return;
  }
  if (uidMatch(rfid.uid.uidByte)) {
    Serial.println("Authorized!");
    tone(buzzerPin, 880, 200);
    doorServo.write(servoUnlocked);
    delay(3000);
    doorServo.write(servoLocked);
  } else {
    Serial.println("Denied");
    tone(buzzerPin, 440, 500);
  }
  // Halt tag until it leaves the field
  rfid.PICC_HaltA();
}
```

**Explanation**

* `PCD_Init()` wakes up the RC522.  Without calling this, the module will not respond【976556237860093†L185-L204】.
* `PICC_IsNewCardPresent()` returns true when a tag has entered the field.
* `PICC_ReadCardSerial()` reads the UID into `rfid.uid.uidByte` and `rfid.uid.size`.
* The helper function `uidMatch()` compares the detected UID to the authorized list.
* The `tone()` function from Day 4 generates a high tone (880 Hz) for success and a lower tone (440 Hz) for denial.
* Always halt the current tag with `PICC_HaltA()` after processing; otherwise the module may continuously report the same tag.

### Troubleshooting and FAQs

| Symptom | Possible cause | Solution |
|---|---|---|
| **Module not responding** | Incorrect wiring or powering from 5 V | Double‑check that VCC is on 3.3 V and all SPI pins are correct【976556237860093†L185-L194】【976556237860093†L199-L206】. |
| **Unable to read tags** | Tag out of range or incompatible | Keep the tag within 5 cm and use ISO/IEC 14443 Type A/B tags【976556237860093†L164-L165】【976556237860093†L275-L287】. |
| **Interference** | Metal near the antenna or cables | Remove metal objects near the reader and use shorter, shielded cables if necessary【976556237860093†L204-L206】. |
| **Library not found** | MFRC522 library not installed | Install the “MFRC522” library via the Arduino Library Manager【173897610469086†L306-L322】. |
| **Power issues with servo** | Servo draws too much current | Power the servo from a separate 5 V supply and ground it with the Arduino; add a capacitor across the servo supply (see Day 12). |

### Project ideas and extensions

* **Door access control** – Expand the example by adding a LCD from Day 16 to display “Access granted” or “Access denied”, and store multiple UIDs in EEPROM (Day 17) to build a fully autonomous access system.
* **Attendance logger** – Save the UIDs and timestamps to an SD card module for logging attendance.  Consider time‑stamping entries with a Real‑Time Clock (RTC).
* **Cashless vending machine** – Combine the RFID reader with a keypad and display to deduct credit stored on tags and control a relay for dispensing goods.
* **Anti‑collision & tag writing** – Use the library functions to handle multiple tags and write custom data to user blocks.  Remember not to overwrite sector 0 block 0【173897610469086†L378-L389】.

### Summary

RFID adds contact‑less identification to your Arduino projects.  You learned how the RC522 module communicates with passive tags, discovered its pinout and specifications (3.3 V supply, 13 mA–26 mA current, 13.56 MHz frequency, ~5 cm range)【173897610469086†L190-L206】【976556237860093†L157-L165】 and wired it correctly via SPI.  After installing the MFRC522 library you read tag UIDs, then built a simple access control project using a servo and buzzer.  Common issues such as range, power and interference can be overcome by following the best practices and troubleshooting tips provided【976556237860093†L199-L206】.  With RFID in your toolbox you can now create secure locks, attendance systems and interactive products.