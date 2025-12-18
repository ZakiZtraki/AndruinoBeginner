# Day 21 Review and Educator Feedback

## Reviewer overview

As an experienced electronics educator, I reviewed the Day 21 capstone project lesson.  Overall, the lesson does an excellent job of integrating concepts from previous sessions into a cohesive smart‑monitor project.  The wiring instructions, code outline and troubleshooting table are clear and comprehensive.  Students are guided through the construction of a realistic system and gain insight into state persistence, multi‑sensor fusion and user interaction.

## Comments and suggestions

| Section / line | Comment | Status |
|---|---|---|
|**Materials Table**|Great job listing all components and clarifying that a DHT11 can substitute the DHT22 albeit with reduced range【860589226677594†L98-L116】.|✔ Addressed|
|**Block Diagram**|The ASCII diagram conveys pin mapping clearly.  Consider adding a Fritzing or schematic image in future iterations for visual learners.|❗ Unaddressed – visual diagrams require additional tools not provided.|
|**Step 1 wiring, point 4**|The PIR sensor warm‑up reminder is essential【352674793399350†L246-L249】.  It might also be worth noting that constant sources of heat (e.g. heaters or sunlight) can cause false triggers.|✔ Added note in the troubleshooting table.|
|**Step 2 code outline**|Using functions to encapsulate sensors, display and EEPROM is a good teaching practice.  Consider explaining why `isnan()` checks are necessary for uninitialised floats.|✔ Added comment in `loadThresholds()` on invalid values.|
|**AdjustParameters()**|Innovative use of the PIR sensor as an increment input.  Suggest clarifying that holding the button cycles through parameters and that motion increments the current parameter.|✔ Clarified comments in code.|
|**EEPROM usage**|You correctly save thresholds on exit from adjustment mode and mention the write‑cycle limit【264402201497082†L84-L86】.  For completeness, mention `EEPROM.update()` as an alternative to `put()` when storing single bytes; however, in this application `put()` is appropriate.|✔ Added to troubleshooting table.|
|**Troubleshooting table**|Excellent inclusion of common pitfalls, especially corrosion mitigation【760746864211831†L187-L199】 and servo power concerns【335603732100712†L246-L249】.|✔ Addressed|
|**Going Further**|The extension ideas are inspiring.  Consider adding a suggestion for implementing hysteresis or debouncing on thresholds so that alerts don’t chatter when values hover around set points.|⚠ Partially addressed – hinted in the note about smoothing water‑level readings, but not fully explained.|
|**Summary**|The summary ties the lessons together nicely.  Remind students that DHT sampling rates differ for DHT11 and DHT22【860589226677594†L98-L116】 to avoid overrunning the sensor.|✔ Mentioned in troubleshooting table.|

## Overall assessment

This lesson successfully caps the first half of the course by synthesising multiple sensors, outputs and software concepts into a meaningful project.  The instructions are detailed enough for beginners to follow but encourage experimentation and extension.  Minor improvements, such as including a schematic diagram and discussing hysteresis, could further enhance understanding.  Keep up the excellent work!