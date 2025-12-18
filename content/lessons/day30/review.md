## Educator Review – Day 30: Final Capstone – Smart Home Demo System

Congratulations on bringing together everything from the previous lessons into a comprehensive smart‑home project! The lesson is ambitious and successfully demonstrates how sensors, actuators, networking and reliability measures can work together. Below are my detailed observations:

| Comment | Status |
| --- | --- |
| **Strong integration of prior topics.** The capstone references relevant lessons (sensors, EEPROM, networking, reliability) and provides citations to help students recall where each concept was introduced. | *Addressed.* The overview lists prior lesson references and the code uses techniques from earlier days. |
| **Clear power and decoupling guidance.** It reminds students to use a 5 V 2 A supply, large and small capacitors and short, thick wires to prevent brownouts【755226503047356†L90-L113】. | *Addressed.* The power section and hands‑on steps specify capacitor values and placement. |
| **System architecture explained but lacks a block diagram.** A schematic showing how the Arduino, ESP32, sensors and actuators connect would help visual learners. | *Not addressed.* The lesson uses textual descriptions only. A diagram could be added in future. |
| **Arduino code outlines sensor reading and automatic control but could be modularized.** Consider encapsulating each sensor into a function and adding hysteresis to prevent rapid toggling of the fan and servo. | *Not addressed.* The pseudocode remains monolithic for brevity. Hysteresis could be added by storing previous states and only changing when thresholds are crossed with a margin. |
| **ESP32 code summary is high level.** The lesson suggests adapting the Day 28 code but does not provide a complete example. | *Partially addressed.* It outlines key features (Wi‑Fi, MQTT, EEPROM, forms). Students comfortable with Day 28 should be able to extend it, but a full listing would be helpful. |
| **Threshold storage and web forms.** Excellent idea to use EEPROM to store threshold values; ensure forms validate input and avoid blocking operations. | *Addressed.* The configuration interface section describes saving thresholds via web forms and using EEPROM on both boards. |
| **Reliability testing suggestions.** The lesson encourages intentionally triggering brownouts and watchdog resets to verify robustness【755226503047356†L64-L87】【576069459775266†L176-L191】. | *Addressed.* Testing section covers removing capacitors and disabling watchdog resets. |
| **Safety considerations.** The note about avoiding mains voltage and preventing corrosion is appreciated【760746864211831†L186-L199】. The lesson also mentions network security. | *Addressed.* Safety notes are present. |
| **Expand on MQTT topics and payloads.** Suggest explaining topic naming conventions and how to subscribe to individual sensors. | *Not addressed.* The lesson uses a single JSON payload; further examples could illustrate per‑sensor topics and quality‑of‑service. |

### Summary

This capstone ties together 30 days of learning and demonstrates a functional smart‑home system. It gives learners confidence in combining sensors, actuators and networking while maintaining reliability. Future improvements could include adding schematic diagrams, modularizing the code with hysteresis, and providing complete ESP32 examples with more detailed MQTT usage. Overall, the lesson meets its objectives and offers a solid foundation for real‑world IoT projects.