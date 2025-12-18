## Educator Review for Day 9 Lesson

### Overview

This lesson gives learners a solid introduction to ultrasonic distance sensing. It clearly explains how the HC‑SR04 operates, including its 5 V supply and 40 kHz bursts, and uses citations to support claims【525653356484419†L141-L149】【525653356484419†L161-L165】. The activities are well structured, moving from wiring and basic distance measurement to a practical parking‑assistant project and calibration experiments. The code examples are easy to follow and build on prior knowledge of timers and buzzers.

### Comments and status

| # | Pattern | Comment | Status |
|---|---------|---------|--------|
| **1** | `/2 cm to 4 m/` | Mentioning the detection range and accuracy is helpful. Consider reminding students that objects closer than 2 cm may produce erratic readings and that environmental factors (temperature, humidity) influence the speed of sound. | **Addressed** – calibration section notes the range limit and temperature effects. |
| **2** | `/Trig to D9/` | The wiring table is clear. However, adding a labelled photo or schematic of the HC‑SR04 would help learners identify the pins easily. | **Unaddressed** – would require an additional graphic; deferred to future improvements. |
| **3** | `/pulseIn()/` | `pulseIn()` is simple but blocks the program while waiting for the echo. For advanced students, suggest exploring the `NewPing` library to handle multiple sensors or non‑blocking measurements【525653356484419†L265-L271】. | **Unaddressed** – mention of NewPing library left as a suggestion for curious learners. |
| **4** | `/parking sensor/` | The variable‑frequency buzzer project is a great application of previous lessons. Some students may find the mapping values confusing. Include a brief explanation of why `map()` is used to translate distances into frequencies. | **Addressed** – code includes comments explaining clamping and mapping; encourage experimentation. |
| **5** | `/temperature effect/` | Excellent inclusion of temperature’s influence on sound speed. Provide a reference value (e.g., 0.034 cm/µs at 20°C) and note how to adjust the constant. | **Addressed** – calibration section mentions using 0.033 or 0.035 depending on temperature and suggests comparing indoor vs outdoor results. |
| **6** | `/angle test/` | Good exploration of beam width. Encourage using a protractor or printed grid to measure angles precisely. | **Addressed** – suggested in the angle test instructions and emphasised the specification of 15°. |
| **7** | `/error handling/` | The code handles “Out of range” but does not consider the case where the echo pin reads noise. Suggest adding a maximum threshold or repeated measurements to filter noise. | **Unaddressed** – left as an exercise for advanced learners; beyond the scope of the introduction. |

### Summary

Overall, the lesson is comprehensive and engaging. It builds on prior concepts (tone, mapping, Serial) and prepares students for upcoming topics like displays and servo motors. Future iterations could include a schematic of the sensor, non‑blocking distance measurement with the `NewPing` library, and more robust error handling.