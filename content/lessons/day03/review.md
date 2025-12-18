# Educator Review for Day 3

As a modern electronics educator, I reviewed the Day 3 lesson for clarity, accuracy and engagement. Below are my comments and the actions taken.

| Comment ID | Location / Issue | Recommendation | Status |
|---|---|---|---|
| C1 | **Materials list**: The initial draft omitted typical resistor ranges for pull‑up and pull‑down. | Clarify that external pull‑downs are often between 1 kΩ and 100 kΩ, with 10 kΩ being common【625912433625749†L248-L263】【892551830113941†L505-L512】. Mention that internal pull‑ups are around 20–50 kΩ【625912433625749†L79-L82】. | **Addressed** – The lesson now lists typical ranges and notes that internal pull‑ups are ≈20–50 kΩ and external pull‑downs are commonly 10 kΩ. |
| C2 | **Pull‑up vs pull‑down explanations** lacked a strong contrast between the default states. | Emphasize that pull‑downs make the default state LOW and pull‑ups make it HIGH【625912433625749†L248-L263】【625912433625749†L222-L234】. Explain that logic is inverted when using `INPUT_PULLUP`. | **Addressed** – The lesson clearly contrasts the default states and explains the inverted logic in the internal pull‑up section. |
| C3 | **Debouncing section**: The draft didn’t mention how long to wait and why. | Include typical bounce durations (average 1.5 ms, outliers up to 157 ms)【263116106733561†L218-L236】 and explain that a 50–100 ms delay is common for debouncing【263116106733561†L290-L302】. Provide a sample debounce algorithm. | **Addressed** – The revised lesson states typical bounce times and uses a 50 ms delay, with guidance to experiment. |
| C4 | **Interactivity**: The original version lacked a challenging exercise. | Add a mini‑project that uses debouncing and state tracking, such as a counter or toggle with long‑press reset. | **Addressed** – A “Challenge project: Build a simple counter” section has been added. |
| C5 | **Additional media**: Students benefit from videos or visuals. | Provide links to relevant YouTube videos and specify the segments to watch. Suggest further reading. | **Addressed** – The lesson includes links to AddOhms and debouncing videos with time stamps and a suggested Instructables article. |

Overall, the updated lesson now better contextualizes pull‑up/pull‑down resistors, clarifies resistor values, and introduces debouncing with practical code examples and challenges. Students should be able to build reliable digital input circuits and apply these skills in more complex projects.
