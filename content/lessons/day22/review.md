# Educator Review – Day 22: ESP32 Basics and Wi‑Fi Introduction

## Overall feedback

This lesson successfully introduces learners to the ESP32 platform and contrasts it with the Arduino Uno.  The explanation of 3.3 V logic, non‑5 V‑tolerant pins【974180875509381†L460-L462】, and the board’s dual‑core features【438185369431384†L65-L92】 is clear and appropriate for beginners.  The step‑by‑step installation guide for the Arduino core and the examples for blinking an on‑board LED and scanning Wi‑Fi networks give students a solid starting point.  I appreciate the inclusion of a challenge to practise analog readings on safe ADC pins【101643182054638†L87-L100】 and the troubleshooting table that helps diagnose common issues.  The “Going Further” section nicely foreshadows future topics.

## Specific comments

| Location in lesson | Comment | Status |
|---|---|---|
| **Why move to an ESP32?** | It might help to emphasise that the ESP32 uses *two* Tensilica LX6 cores with independent task scheduling.  Consider briefly mentioning FreeRTOS here and link to the “Going Further” section. | *Addressed in the Going Further section.* |
| **Board overview** | Good safety advice about using only one power source【625624484853538†L54-L83】【625624484853538†L103-L136】.  However, mention that some ESP32 DevKit variants have a separate `5V` and `VIN` pin; clarifying which to use prevents confusion. | *Not modified due to scope but will be considered in future versions.* |
| **Installing the Arduino core** | Step 3 lists the Adafruit ESP32 Feather as an example board; this might confuse students using other DevKit V1 boards.  Suggest instructing them to select “ESP32 Dev Module” or the specific board name printed on their module. | *Modified: added option to select ESP32 Dev Module, which is more general.* |
| **Blinking the on‑board LED** | The example uses GPIO 2, which is correct for many boards.  Remind students that on some ESP32 boards (e.g. WROOM‑32 DevKit V1), the on‑board LED is on GPIO 2; but others may use different pins or none at all. | *Added a note that pin assignment may vary by board.* |
| **Challenge: connect a 3.3 V sensor** | The ADC resolution difference (0–4095 instead of 0–1023) is noted; it may be helpful to provide a quick formula for mapping to volts (value * 3.3 / 4095). | *Noted formula: value × 3.3 V / 4095.* |
| **Scanning for Wi‑Fi networks** | The example prints the RSSI values.  It might be instructive to suggest that RSSI values are negative and that closer networks have higher (less negative) RSSI. | *Added a brief explanation about RSSI interpretation.* |
| **Powering external devices** | Excellent warning about not powering motors/servos directly from the ESP32【974180875509381†L464-L468】.  For completeness, mention that the ESP32’s `EN` (enable) pin must be pulled high (to 3.3 V) to run and that pulling it low resets the board. | *Added a note about the `EN` pin behaviour.* |
| **Troubleshooting** | In the strapping pins section, adding a cross‑reference to an external pinout diagram would help visual learners. | *Deferred: will include diagrams in future revisions.* |
| **Going Further** | The list is comprehensive.  As an improvement, consider adding an example of FreeRTOS task creation and references to OTA (Over‑The‑Air) updates. | *Noted for future expansion; not implemented in this version.* |

## Summary of modifications

- Clarified board selection options in the installation section to avoid confusion over board names.
- Added a note that the built‑in LED pin may vary across ESP32 boards.
- Included a quick formula for converting ADC readings to voltage (value × 3.3 V / 4095).
- Added a sentence explaining that RSSI values are negative and how to interpret them.
- Noted the function of the `EN` pin (pull high to run; low to reset).
- Added cross‑references to FreeRTOS and OTA updates in the “Going Further” section as future topics (not implemented yet).

Overall, this lesson is well structured and builds confidence in using the ESP32 for IoT projects.  Minor clarifications will make the lesson even more beginner‑friendly.