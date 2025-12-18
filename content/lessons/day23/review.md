# Educator Review – Day 23: ESP32 GPIO & Sensors

## Overall feedback

This lesson takes a significant step into the ESP32’s I/O capabilities.  It clearly differentiates between safe GPIOs, strapping pins and input‑only pins【101643182054638†L87-L100】 and shows how to adapt previous Arduino projects to 3.3 V logic.  The hands‑on examples build confidence in reading buttons, measuring analog voltages and generating PWM with the LEDC library.  The light‑sensitive night‑light project demonstrates how to combine analog input and PWM output in a simple yet meaningful way.  The troubleshooting section is practical and emphasises common pitfalls such as Wi‑Fi interference with ADC2【798521705858314†L96-L101】 and boot issues caused by strapping pins【101643182054638†L96-L100】.  The “Going further” suggestions point students towards useful advanced topics.

## Specific comments

| Section | Comment | Status |
|---|---|---|
| GPIO overview | Excellent summary of safe, strapping and input‑only pins.  Consider adding a note that the pin numbers printed on some boards don’t always match the GPIO numbering (e.g. D0, D1 on NodeMCU).  A diagram would help visual learners. | *Deferred: diagrams to be added in a future update.* |
| Digital input example | Using an external pull‑down resistor is great for learning.  Mention that `INPUT_PULLUP` simplifies wiring and that the logic is inverted.  Also note that `delay(10)` is a crude debounce; encourage students to reuse the state‑change code from Day 3. | *Added a paragraph describing internal pull‑ups and noting inverted logic.* |
| Analog input | The explanation of 12‑bit resolution and voltage conversion is clear【798521705858314†L52-L57】.  Suggest mentioning that the ESP32 ADC is non‑linear near 0 V and 3.3 V and that calibration functions exist. | *Added a note about non‑linearity and referenced calibration.* |
| PWM and LEDC | The five‑step description of configuring LEDC is concise【35371649993462†L270-L297】.  Suggest clarifying that `ledcWrite()` takes values from 0 to (2^{resolution} − 1) and that higher resolutions reduce PWM frequency for a fixed 80 MHz APB clock. | *Not modified for brevity; may be addressed in an advanced PWM lesson.* |
| Light‑sensitive night‑light | Excellent integration of analog reading and PWM.  Encourage students to adjust the `map()` ranges or implement a moving average to smooth abrupt changes. | *Noted in the project description; smoothing left as an exercise.* |
| Troubleshooting | Good coverage of common issues.  Add that ADC2 pins cannot be used if the Wi‑Fi radio is powered on【798521705858314†L96-L101】, but they work in sleep modes.  Clarify that the boot strapping pins can still be used safely **after** boot. | *Clarified that ADC2 limitation is due to Wi‑Fi and that strapping pins may be used after boot.* |
| Going further | The suggestions are appropriate.  Including links to ESP32Servo library and examples of GPIO interrupts would enhance the section. | *Deferred for future expansion.* |

## Summary of modifications

- Added a paragraph describing internal pull‑ups and inverted logic for `INPUT_PULLUP`.
- Added a note that the ESP32 ADC is non‑linear near 0 V and 3.3 V and that calibration functions can help【798521705858314†L70-L74】.
- Clarified that ADC2 pins are unavailable while Wi‑Fi is active but can be used in sleep or when Wi‑Fi is off【798521705858314†L96-L101】.
- Clarified that strapping pins may be used as outputs after boot.

Overall, the lesson is well structured, with clear examples and relevant projects.  Incorporating diagrams and deeper explorations of PWM channels and ISR‑based input handling would further enrich the material.