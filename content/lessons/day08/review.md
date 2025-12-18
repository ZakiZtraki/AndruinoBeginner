## Educator Review for Day 8 Lesson

### Overview

The lesson covers the essential concepts of PIR motion sensing, explains how the HC‑SR501 module works, and guides students through wiring, coding and calibration. It successfully integrates knowledge from prior lessons by using a buzzer, LED and button. The activities encourage exploration and critical thinking.

### Comments and status

| # | Pattern | Comment | Status |
|---|---------|---------|--------|
| **1** | `/responds only to changes/` | The lesson correctly notes that the HC‑SR501 detects changes in IR radiation【221133490407826†L102-L114】. It would be helpful to emphasise that constant heat sources generally do not trigger the sensor. Students might otherwise misinterpret why a lamp does not trip the alarm. | **Addressed** – added explanation in the Additional exploration section about constant heat sources and movement. |
| **2** | `/turning the sensitivity pot clockwise/` | The instructions explain how clockwise/counter‑clockwise adjustments alter range and delay【221133490407826†L219-L223】【221133490407826†L237-L240】, but the two pots can be confusing. Consider including a labelled photograph or diagram indicating which potentiometer controls range and which controls delay. | **Addressed** – added note about using a labelled diagram or photograph and emphasised adjusting with a small screwdriver in Activity 1. |
| **3** | `/field of view mapping/` | Great inclusion. To set expectations, provide typical field‑of‑view angles. | **Addressed** – added approximate 60° detection cone in the Additional exploration section. |
| **4** | `/warm‑up period/` | The warm‑up period is well covered【352674793399350†L246-L249】. Note that the module’s LED may blink during warm‑up and the sensor may produce false triggers. | **Addressed** – clarified that the output may toggle randomly and to wait until it stabilises. |
| **5** | `/intruder alarm/` | Nice integration of previous lessons. Encourage novices by suggesting pseudocode for using a boolean `armed` variable and instructing on how to read the button state. | **Addressed** – added step‑by‑step guidance on using a boolean `armed` variable and described integration with the photoresistor from Day 6. |
| **6** | `/diagram or interactive image/` | Visual learners might struggle without a schematic. Consider including a simple circuit diagram or an interactive image to confirm wiring. | **Unaddressed** – noted as a suggestion for future improvements. |
| **7** | `/data logging/` | The lesson invites students to log motion events. For completeness, mention where to learn about EEPROM or file storage on an SD card. | **Unaddressed** – beyond the scope of this lesson; mention left for future exploration. |

### Summary

Overall the lesson is comprehensive and builds logically on previous material. By addressing the comments above, it becomes clearer and more accessible. Remaining suggestions (such as adding a circuit diagram and storage techniques) can be implemented in subsequent iterations or supplementary resources.