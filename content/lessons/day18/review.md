## Educator Review – Accelerometer and Tilt Sensing (Day 18)

### General Feedback

This lesson gives a solid introduction to using the ADXL345 accelerometer with an Arduino.  It clearly explains what an accelerometer measures, summarises key specifications and highlights the importance of powering the sensor at 3.3 V.  The wiring instructions and code examples are well structured, and the projects (digital spirit level, servo control ideas) naturally build on concepts learned earlier in the course.  The inclusion of trigonometric calculations for pitch and roll helps students move beyond raw data to meaningful applications.

### Comments and Suggestions

1. **Explain static vs dynamic acceleration** – While the introduction mentions static and dynamic acceleration, it would be helpful to briefly describe that static acceleration is the constant 1 g due to gravity, whereas dynamic acceleration results from motion.  Clarifying this distinction will help students understand why tilt measurements can be extracted from the Z‑axis reading.

2. **Calibrating zero‑offsets** – Consumer MEMS accelerometers often have small offsets on each axis (e.g., the X‑axis might read 0.05 g when level).  Encourage students to take a baseline reading with the board level and subtract those offsets from subsequent measurements to improve angle accuracy.

3. **More on ranges and resolution trade‑offs** – The lesson correctly notes that the ADXL345 has selectable ranges【478834150142700†L153-L162】.  Explain that increasing the range (e.g., from ±4 g to ±16 g) reduces sensitivity and resolution.  For tilt sensing, ±2 g or ±4 g provides finer granularity, whereas higher ranges are useful for detecting shocks or rapid motion.

4. **Add a note on converting raw counts** – When not using a library, raw acceleration values are signed 16‑bit integers (two’s complement) where each LSB represents 4 mg (for ±2 g range)【478834150142700†L153-L162】.  Provide the conversion formula (e.g., `g = rawValue * 0.004`) so students can verify the library’s scaling.

5. **Warn about 3.3 V current limits** – The Arduino Uno’s 3.3 V rail can supply only about 50 mA.  Even though the ADXL345 draws very little current, remind students not to power multiple 3.3 V devices or servos from that pin.  For larger projects they should use a separate 3.3 V regulator.

6. **Include advanced sensor features as optional exploration** – Mention that the ADXL345 supports tap detection, free‑fall interrupts and a FIFO buffer【775380886381479†L172-L180】.  Suggest exploring these features after mastering basic readings.

7. **Encourage smoothing/filtering** – Raw accelerometer data can be noisy.  Introduce the idea of applying a simple moving average or low‑pass filter before computing angles or triggering events.  Point to Arduino functions or libraries that implement filters.

8. **Safety note on motion projects** – When using the accelerometer to control motors or servos, emphasise that rapid or excessive motion can damage the sensor or attached components.  Suggest implementing limits and using physically stable mounting.

### Status of Comments

| Comment | Addressed? | Explanation |
| --- | --- | --- |
| Explain static vs dynamic acceleration | **➖ Not yet** | The lesson mentions both types of acceleration but does not explicitly define them.  A brief definition could be added in the introduction. |
| Calibrating zero‑offsets | **➖ Not yet** | Offsets are not discussed.  Adding a subsection on calibration would improve angle accuracy for students. |
| More on ranges and resolution trade‑offs | **✓ Added** | The lesson notes that ±4 g is a compromise and lists available ranges; further emphasis on sensitivity trade‑offs can be added when discussing `setRange()`. |
| Conversion formula for raw counts | **➖ Not yet** | The lesson uses a library that returns SI units, but an example conversion formula would benefit those reading registers directly. |
| Warn about 3.3 V current limits | **➖ Not yet** | There is mention of using 3.3 V and level shifting【775380886381479†L267-L270】, but no warning about limited current capability. |
| Include advanced features | **✓ Added as optional** | The lesson notes that tap/double tap, activity and free‑fall detection exist【775380886381479†L172-L180】 and suggests exploring them later. |
| Encourage smoothing/filtering | **➖ Not yet** | No filtering methods are mentioned.  A future iteration could add a moving average filter example. |
| Safety note on motion projects | **➖ Not yet** | Safety considerations are implied but not explicit.  Adding a cautionary note would help prevent hardware damage. |

### Overall Assessment

Students who follow this lesson will gain hands‑on experience with reading accelerometer data and mapping it to real‑world tilt indications.  The use of a library simplifies the initial learning curve, and the extension ideas encourage exploration.  Addressing the suggestions above—especially calibration and safety considerations—would further strengthen the lesson and prepare learners for more advanced motion‑sensing applications.