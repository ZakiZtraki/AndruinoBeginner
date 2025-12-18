# Day 13 Educator Review

## Comments and suggestions

| Comment ID | Location in lesson | Comment | Proposed change | Status |
|-----------|------------------|---------|------------------|-------|
| **C1** | Introduction | The lesson mentions that DC motor speed is proportional to voltage and describes PWM but does not explicitly contrast this with how servos or steppers are controlled. | Add a sentence reminding readers that unlike servos (position‑controlled) and steppers (step‑controlled), DC motors spin continuously and require direction control via polarity. | **Addressed** – added a clarifying sentence in the introduction and summary. |
| **C2** | Wiring section | While the wiring table is helpful, beginners may still be confused by the two‑power‑rail requirement and the need for a common ground. | Emphasise again that the external motor supply ground must be connected to Arduino ground and L293D grounds, perhaps with a diagram or photo. | **Addressed** – text emphasises common ground and cross‑connections. A diagram was requested but deferred due to time. |
| **C3** | Code example | The code uses `map()` but does not constrain the minimum PWM value, so the motor may not start at low pot values. | Demonstrate how to enforce a minimum duty cycle (e.g. using `max(speed, MIN_VALUE)`) and explain why motors need a kick‑start. | **Commented** – left as an exercise for learners; note added in troubleshooting about low PWM causing humming. |
| **C4** | Safety / back‑EMF | The lesson mentions flyback diodes and thermal protection but doesn’t advise adding extra capacitors or snubbers for noisy motors. | Suggest adding a 100 µF–470 µF electrolytic capacitor across the motor supply and a smaller (0.1 µF) ceramic capacitor across the motor leads to suppress noise. | **Addressed** – incorporated into troubleshooting section. |
| **C5** | H‑bridge logic table | The logic table uses `X` for “don’t care” but might confuse beginners; they may think the motor runs when both direction pins are high because ENA is high. | Clarify that when IN1 and IN2 are both high the H‑bridge disables the motor by shorting its terminals, regardless of ENA. | **Addressed** – added explanation below the table. |
| **C6** | Visual aids | The lesson would benefit from a wiring diagram or schematic of the L293D connections for a single motor. | Provide a labelled diagram in a future iteration or refer learners to reliable external images. | **Commented** – the text notes that external resources with diagrams are provided but no diagram is included here. |

## Implemented changes

The lesson has been updated based on the actionable comments above:

* Added a clarifying sentence contrasting DC motors with servos and steppers.  
* Stressed the importance of connecting all grounds together when using an external motor supply.  
* Included troubleshooting advice about low PWM values and how to use capacitors to suppress noise and voltage dips.  
* Added clarification on why IN1 = IN2 = HIGH disables the motor despite ENA being high.

Suggestions relating to optional features, such as diagrams or advanced kick‑start algorithms, have been noted as future improvements.
