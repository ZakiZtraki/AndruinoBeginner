# Day 5 Lesson Review (Educator Feedback)

## Review summary

Overall this lesson provides a clear and engaging introduction to analog input and PWM output for beginners.  The objectives are well defined, the step‑by‑step instructions build logically on previous lessons, and the wiring instructions and code samples are easy to follow.  The use of citations from the Arduino documentation strengthens the technical accuracy, and the addition of a simple mapping graph helps visual learners.  The troubleshooting section anticipates common errors, and the extension ideas encourage exploration beyond the core exercise.

## Comments and recommendations

| ID | Section | Comment / Suggestion | Status |
|---|---|---|---|
| C1 | Background – ADC explanation | Clarify that the ADC returns 0–1023 **inclusive** (1024 values) and that the resolution (step size) is derived by dividing the reference voltage by 1023【538618890236897†screenshot】.  Also mention that calling `analogReadResolution()` can change the resolution on some boards. | **Addressed** – The lesson states that `analogRead()` returns 0–1023 and explains the 4.9 mV step size【538618890236897†screenshot】.  A note on `analogReadResolution()` appears in the background section. |
| C2 | Materials list | Suggest including a 10 kΩ potentiometer specifically, because linear taper is preferable for smooth changes. | **Addressed** – The materials list specifies a 10 kΩ potentiometer and recommends a linear taper. |
| C3 | Wiring the potentiometer | Students sometimes connect both outer pins of the potentiometer to the same rail.  Emphasise that one side must go to 5 V and the other to ground. | **Addressed** – Step 1 explains that one outer pin goes to 5 V and the other to ground and warns about swapping them. |
| C4 | Voltage conversion formula | Note that the divisor in the voltage calculation should be **1023.0**, not 1024, because the maximum index is 1023.  Also remind users to adjust the reference voltage for 3.3 V boards【731371549656911†screenshot】. | **Addressed** – The example uses 1023.0 and includes a warning about adjusting the numerator for 3.3 V boards【731371549656911†screenshot】. |
| C5 | Map vs manual scaling | Provide both methods (using `map()` and dividing by 4) and explain when each is appropriate. | **Addressed** – Step 4 describes `map()` and explains that dividing by 4 is an alternative because 1023 ÷ 4 ≈ 255. |
| C6 | PWM limitations | Mention that PWM output is a digital square wave, not true analog, and note the limit of four concurrent PWM channels【987426609487138†screenshot】. | **Addressed** – The PWM background section notes that `analogWrite()` produces a digital square wave, lists the six PWM pins and highlights the four-channel limitation【453991055661574†L32-L37】【987426609487138†screenshot】. |
| C7 | Image/visual aids | Include a simple plot to illustrate how a 10‑bit reading is mapped to an 8‑bit output. | **Addressed** – A line graph shows the mapping between analogRead and PWM ranges. |
| C8 | Extension ideas | Encourage students to reuse previous components (e.g., buttons or buzzers) to reinforce prior learning. | **Addressed** – Step 6 suggests controlling a buzzer’s frequency with the potentiometer and combining with a photoresistor for a night‑light. |
| C9 | Reference to external media | Provide a short list of recommended videos or tutorials with timestamps for further exploration. | **Not addressed** – While the lesson suggests watching external videos, specific links and timestamps are not included.  This could be improved in a future revision. |

## Overall assessment

The lesson is comprehensive and well sequenced.  The only significant missing element is the explicit inclusion of specific external media references (C9).  For future iterations, consider linking to a YouTube demonstration of potentiometer wiring and PWM control, with guidance on which sections to watch.  Otherwise, the lesson successfully guides students from reading an analog voltage to controlling a device with PWM and offers creative extensions for further learning.