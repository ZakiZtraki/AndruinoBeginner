# Day 12 Educator Review

## Comments and suggestions

| Comment ID | Location in lesson | Comment | Proposed change | Status |
|-----------|------------------|---------|------------------|-------|
| **C1** | Introduction | The introduction briefly mentions continuous‑rotation servos but doesn’t explain how they differ from standard servos. | Add a sentence defining continuous‑rotation servos and noting that they respond to pulse width as speed commands rather than position. | **Addressed** – added explanatory note in introduction. |
| **C2** | Calibration section | While the calibration section warns against exceeding mechanical limits, it could reinforce that you should never force a servo horn by hand and that doing so can damage the gears. | Explicitly state that servos should be moved by code and not by physically twisting the horn when powered. | **Addressed** – added statement in calibration section. |
| **C3** | Example code | The lesson uses `servo.write()` which is easy to understand, but advanced students may benefit from seeing `writeMicroseconds()` for fine calibration. | Include a small example using `servo.writeMicroseconds()` and explain how to adjust the pulse widths for a non‑standard servo. | **Commented** – left for a future extension. |
| **C4** | Power considerations | It would be helpful to remind learners not to power servos directly from an Arduino pin and to avoid connecting the servo to inappropriate voltage rails (e.g. 3.3 V or 9 V). | Add a sentence emphasising that only the 5 V power pin should be used and never a digital I/O pin. | **Addressed** – the wiring section now clarifies this. |
| **C5** | servo.detach() | Mention that detaching the servo when it’s not moving can reduce jitter and power consumption. | Add a brief note about the `detach()` function in the code discussion. | **Commented** – not essential for first introduction. |
| **C6** | Visual aids | A wiring diagram or labelled photograph of the servo connector would help visual learners. | Include an image showing the pinout and wiring orientation. | **Commented** – external resources with images are referenced instead. |

## Implemented changes

The lesson text has been updated to address actionable comments:

- Added a sentence defining continuous‑rotation servos and explaining how they interpret pulse width as speed rather than position.
- Reinforced the warning in the calibration section that servos should be moved only via software and not by twisting the horn when powered.
- Added clarification in the wiring section that servos must be powered from the 5 V pin or an external supply, not from a digital I/O pin.
- Left advanced topics such as `writeMicroseconds()` and `servo.detach()` as future extensions to avoid overwhelming beginners.
- Noted the suggestion to include visual diagrams; external references with images are provided instead.