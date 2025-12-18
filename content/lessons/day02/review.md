# Educator Review – Day 2 Lesson

As an experienced instructor in DIY electronics, I have reviewed the Day 2 lesson document.  Overall the lesson is thoughtfully structured and covers all essential concepts for beginners.  The clear objectives, detailed steps and interactive challenges will help students build confidence as they construct their first circuit.  Here are my observations and improvement suggestions.

## General feedback

* **Well‑organised content:** The lesson progresses logically from explaining LED polarity and resistors to hands‑on circuit assembly and coding.  The numbered steps in Section 2 (lines 49–53) make it easy for learners to follow along.
* **Interactive activities:** The “Try this,” “Hands‑on” and “Challenge” boxes encourage students to engage actively with the material.  This promotes deeper understanding rather than passive reading.
* **Good use of citations and media:** Authoritative references support key explanations (e.g. resistor calculation lines 37–41) and a clear schematic diagram helps visual learners (line 54).

## Specific improvement suggestions

1. **Mention the built‑in LED:** Many Arduino boards have an on‑board LED connected to pin 13.  Including a note about using `LED_BUILTIN` allows students without spare LEDs to practice the blink code (see lines 45–47 of the source article)【723163177447044†L45-L47】.  Suggest adding a short paragraph in the coding section explaining how to use this built‑in LED.

2. **List PWM‑capable pins:** The lesson briefly introduces PWM but does not specify which pins support it.  On the Arduino Uno, pins 3, 5, 6, 9, 10 and 11 are PWM‑enabled【353571490454733†L117-L119】.  Adding this list will prevent learners from attempting `analogWrite()` on an unsupported pin.  Also mention that these pins are marked with a “~” symbol on the board.

3. **Clarify the 3.3 V resistor calculation:** The interactive question on line 43 asks students to compute a resistor value for a 3.3 V system.  Consider providing the answer or a guideline (e.g., a 100 Ω–180 Ω resistor) in an appendix or note so students can check their work.

4. **Emphasize the danger of skipping the resistor:** The question in Section 4 (line 91) invites learners to reflect on what happens without a resistor.  Reinforce this earlier in the resistor explanation (e.g., at line 34) by clearly stating that connecting an LED directly to a supply can permanently damage the LED and the board.

5. **Connect with future lessons:** To build continuity, add a sentence in the summary hinting at how today’s resistor and LED concepts relate to upcoming topics (e.g., buttons, sensors, or ESP32 boards).  This helps students see the bigger picture.

## Instructor responses & updates

| Suggestion | Action taken |
|---|---|
|1. Mention the built‑in LED | Added a note in the coding section explaining that most Arduino boards have a built‑in LED on pin 13 (accessible via the constant `LED_BUILTIN`) and that students can use it to test the blink code without wiring an external LED. |
|2. List PWM‑capable pins | Expanded the PWM section to list the Arduino Uno pins that support PWM (3, 5, 6, 9, 10 and 11) and noted that they are marked with a “~” on the board【353571490454733†L117-L119】. |
|3. Clarify the 3.3 V resistor calculation | Added a footnote after the interactive question providing a sample calculation for a 3.3 V supply and suggesting a 100 Ω–180 Ω resistor for typical LEDs. |
|4. Emphasize the danger of skipping the resistor | Added an explicit warning in the resistor explanation section that connecting an LED directly to 5 V or 3.3 V can damage the LED and the microcontroller, and highlighted the protective role of the resistor. |
|5. Connect with future lessons | Added a sentence in the summary linking the concepts of resistors and LED control to upcoming lessons on buttons and ESP32, encouraging learners to see the continuity of concepts. |
