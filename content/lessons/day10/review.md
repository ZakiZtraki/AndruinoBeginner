## Educator Review for Day 10 Lesson

### Overview

The Day 10 lesson introduces seven‑segment displays effectively. It explains the difference between common cathode and common anode types【8206320365204†L150-L164】【865751415830727†L179-L193】, emphasises the need for current‑limiting resistors【865751415830727†L245-L258】, and provides clear wiring instructions and sample code. The activities build on prior lessons by integrating a pushbutton for a countdown timer and using the ultrasonic sensor to display distance. The concept of multiplexing is presented conceptually, preparing learners for future modules.

### Comments and status

| # | Pattern | Comment | Status |
|---|---------|---------|--------|
| **1** | `/common cathode display has pins 3 and 8 connected to ground/` | Good identification of common cathode pins【8206320365204†L150-L154】. Suggest adding a diagram or photo indicating which physical pins correspond to segments a–g and dp to aid beginners. | **Unaddressed** – requires a graphic; note for future improvements. |
| **2** | `/220 Ω resistor/` | The lesson explains why a resistor is needed and cites typical values【865751415830727†L245-L258】. It might be helpful to briefly show how the resistor value is calculated (5 V minus forward voltage divided by current) to reinforce Ohm’s law. | **Unaddressed** – an exercise for students or a reference to Day 2; not included due to space. |
| **3** | `/digitCodes array/` | Excellent use of a lookup table to drive segments. Encourage students to extend the array to include hexadecimal characters A–F or the decimal point if needed. | **Addressed** – added comment in code inviting expansion; students can modify the array. |
| **4** | `/countdown timer/` | The countdown timer challenge leverages past lessons; however, novices may need hints on debouncing the pushbutton and using a state variable. Include pseudocode or a brief explanation. | **Addressed** – challenge description suggests using a `state` variable and refers back to Day 3 for button handling. |
| **5** | `/multiplexing/` | The overview of multiplexing is concise and references the Jameco tutorial demonstrating that multiplexing uses only a couple of extra pins【820333238483188†L93-L99】. Encourage adding at least one example of how to update `displayBuf` with sensor data. | **Addressed** – provided bullet points describing how to cycle through digits and update a buffer; full implementation deferred to future lessons. |
| **6** | `/driver ICs/` | The lesson briefly mentions driver ICs like the CD4511 and MAX7219【820333238483188†L154-L167】, which is good context. Suggest adding that these drivers offload the multiplexing and reduce pin usage. | **Addressed** – noted in the multiplexing section that driver ICs can simplify multi‑digit displays. |
| **7** | `/LED forward voltage/` | Consider mentioning that forward voltage and current vary by colour (e.g., blue LEDs may need a different resistor). | **Unaddressed** – not included to keep focus on standard red displays; mention reserved for advanced study. |

### Summary

This lesson provides a strong foundation for using seven‑segment displays. Future iterations could include a labelled pinout diagram, a brief Ohm’s law calculation for resistor values, and examples of driving displays via a 74HC595 or MAX7219. These additions would enhance comprehension without overwhelming beginners.