## Educator review for Day 15 – Temperature & Humidity Sensors

This section provides feedback from a seasoned electronics educator on the Day 15 lesson.  Each comment identifies a specific part of the lesson (using a short regex pattern) and suggests improvements.  After the comment you will find the **status**, indicating whether the issue was **addressed** in the final lesson or remains **unresolved** for future revisions.

| Pattern to match | Comment & suggested improvement | Status |
|---|---|---|
| `\bNTC thermistor\b` | Great job explaining the negative temperature coefficient!  Consider adding a note that thermistors exhibit non‑linear resistance changes and that microcontrollers typically linearise the output. | **Addressed** – The introduction explains the thermistor behaviour and the microcontroller’s role. |
| `DHT11\b.*0–50` | The spec table clearly shows the DHT11’s limited range.  It might help to explicitly mention that sensors should not be used below freezing, otherwise readings will be invalid. | **Addressed** – The summary reiterates that DHT11 only works from 0 °C to 50 °C. |
| `pull‑up.*resistor` | The lesson emphasises the need for a 10 kΩ pull‑up resistor.  Consider adding a reminder that modules often include this resistor and that using both internal and external pull‑ups can sometimes cause communication issues. | **Addressed** – A note explains that breakout boards include a pull‑up and warns about multiple pull‑ups. |
| `delay\(1000\)` | Good to see the correct sampling delay.  Suggest clarifying that DHT22 needs a 2 s delay and DHT11 needs a 1 s delay, otherwise the program may read stale data. | **Addressed** – The code comments and the delay call reflect the 1 s interval and explain how to adjust for DHT22. |
| `heat index` | Mentioning the heat index is a nice touch.  It would be beneficial to include a link or reference explaining the heat index formula for curious students. | **Unresolved** – The lesson notes the function but does not provide an external reference; consider adding one in a future update. |
| `smart ventilation` | The project example encourages creativity.  It could be enhanced by suggesting a hysteresis band (e.g. turn the fan on at 60 % and off at 55 %) to prevent rapid toggling. | **Unresolved** – Hysteresis logic isn’t implemented; leave as an exercise for advanced learners. |
| `0\.5\sHz` | Good use of sampling rate facts.  It may be worth reminding students that reading the sensor faster than its rated interval will return the last measured value rather than new data. | **Addressed** – The code comments and troubleshooting section highlight the slow update rate. |
| `cable distance` | You correctly mention the 20 m cable limit at 5 V.  Suggest adding that high‑quality shielded cable helps reduce interference for long runs. | **Unresolved** – Cable shielding is not discussed; consider adding this tip in the next revision. |
| `Failed to read from DHT` | The troubleshooting list is comprehensive; nice work including power, wiring and sensor type checks.  You might also suggest testing another sensor or trying a different pull‑up value (e.g. 4.7 kΩ) when troubleshooting persistent communication errors. | **Addressed** – The troubleshooting list mentions replacing the sensor; additional resistor values could be considered by advanced students. |
| `humidity.*calibr` | Calibration is touched on in the reflection questions.  It would be great to discuss how to calibrate relative humidity sensors using saturated salt solutions or a commercial hygrometer. | **Unresolved** – Calibration techniques are only mentioned; students interested in calibration should explore this independently. |

### Summary of changes following review

- Added notes on sensor operating range and emphasised that the DHT11 should not be used below 0 °C.
- Clarified that breakout modules include a pull‑up resistor and that duplicate pull‑ups may cause issues.
- Included comments in the example code about the 1 s vs 2 s sampling interval.
- Highlighted the slow response time in both the code and troubleshooting sections.
- Left advanced topics (hysteresis control, heat‑index formula, cable shielding and calibration methods) for future iterations.