# Day 14 Educator Review

## Comments and suggestions

| Comment ID | Location in lesson | Comment | Proposed change | Status |
|-----------|------------------|---------|------------------|-------|
| **C1** | Introduction | The introduction briefly mentions that steppers sit between DC motors and servos but could better explain that steppers move in fixed step increments and hold position without feedback. | Clarify that steppers do not require a feedback sensor to maintain position because energizing the coils locks the rotor. | **Addressed** – expanded description of how steppers hold position via magnetic fields. |
| **C2** | Unipolar vs bipolar section | While the section explains unipolar and bipolar differences, learners might not know how to identify which type their motor is. | Add a note on counting wires: five/six wires usually indicate unipolar, four wires indicate bipolar. | **Addressed** – added wire‑count hint in the unipolar vs bipolar section. |
| **C3** | Motor specifications | The lesson correctly states the 2048‑step gear‑reduced resolution but doesn’t point out that some 28BYJ‑48 versions have 512 steps. | Mention that some manufacturers use a 1:16 gearbox (512 steps per revolution)【470139988739117†L189-L191】. | **Addressed** – added note in the specifications paragraph. |
| **C4** | Wiring table | The table maps motor wires to L293D pins but doesn’t specify the physical pin numbers on the L293D. | Add the L293D pin numbers to the table for clarity. | **Commented** – considered helpful but omitted to avoid clutter; learners can refer to the Day 13 wiring table. |
| **C5** | Step sequence table | It would be beneficial to include both full‑step and half‑step sequences. | Add an optional half‑step sequence chart for advanced learners. | **Commented** – left as a future enhancement. |
| **C6** | Code example | The example uses the Stepper library’s 4‑wire constructor, which assumes a specific coil sequence (IN1, IN3, IN2, IN4). Beginners might be confused by the parameter order. | Explain that the Stepper constructor expects the coil pins in the order (IN1, IN3, IN2, IN4) and that reversing the order will change direction. | **Addressed** – added note in the code description. |
| **C7** | Power considerations | Although the lesson mentions current draw and suggests a separate supply, emphasise that the L293D’s total current limit (600 mA per channel) is shared across coils and that simultaneous energizing of two coils doubles the current demand. | Warn learners to ensure the power supply and driver can handle combined coil currents. | **Addressed** – added note in troubleshooting. |
| **C8** | Visual aids | A diagram showing the coil energizing sequence would help visual learners. | Provide a graphical representation of the step sequence. | **Addressed** – a simple diagram has been added to the package. |

## Implemented changes

Actionable comments have been addressed as follows:

* Expanded the introduction to explain that stepper motors hold their position by keeping current flowing in the coils.  
* Added guidance on counting wires to identify unipolar vs bipolar motors.  
* Added a note that some 28BYJ‑48 motors have a 1:16 gearbox producing 512 steps per revolution【470139988739117†L189-L191】.  
* Clarified how the `Stepper` constructor expects coil pins and how reversing the order affects direction.  
* Added warnings about combined coil current draw when multiple coils are energized simultaneously.  
* Included a simple diagram in the package to illustrate the coil energizing sequence.  

Other suggestions (adding L293D pin numbers and half‑step sequence) are noted for future iterations to avoid overwhelming beginners.
