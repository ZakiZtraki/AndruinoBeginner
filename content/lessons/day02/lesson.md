# Day 2 – LEDs & Resistors: Building Your First Circuit

## Objectives

- Understand LED polarity and why orientation matters.
- Use Ohm’s law to choose an appropriate resistor for an LED circuit.
- Build a simple LED circuit on a breadboard and verify it works.
- Write Arduino code to blink the LED on and off.
- Explore how resistor values affect brightness and experiment with simple variations.

## Materials Needed

| Item | Quantity | Notes |
|---|---|---|
| Arduino‑compatible board | 1 | Use the Uno‑style board from your kit |
| Breadboard | 1 | For prototyping |
| LED (any color) | 1 | Observe the long and short legs |
| Resistors (220 Ω – 1 kΩ) | 2–3 | Start with 220 Ω or 330 Ω【723163177447044†L121-L150】【601654697679610†L88-L90】|
| Jumper wires | a few | Male‑to‑male |
| Multimeter (optional) | 1 | For measuring voltage and current |

> **Tip:** The resistor range listed above comes from common practice; any resistor between about **220 Ω and 1 kΩ** will limit current enough to protect an LED【601654697679610†L88-L90】. Smaller resistances make the LED brighter; larger resistances dim it.

## 1 – LED Polarity and Resistors

### Understanding LED polarity

LEDs are diodes, which means current only flows in one direction.  The **anode (positive)** lead is longer, and the **cathode (negative)** lead is shorter【747266350938052†L169-L172】.  If you reverse these leads, the LED simply won’t light【747266350938052†L169-L174】.  Many LEDs also have a flat edge on the rim next to the cathode or a larger internal plate indicating the negative side【218328676190713†L34-L43】.

> **Interactive check:** Compare several LEDs from your kit.  Identify the anode and cathode on each one by comparing the leg length and looking for a flat edge or larger internal plate.  Make a note of how manufacturers mark polarity.

### Why you need a resistor

Without a resistor, an LED connected directly to a 5 V source can draw far more current than it can safely handle and the diode can be damaged【747266350938052†L187-L193】.  A resistor placed in series with the LED limits the current and protects both the LED and the microcontroller pin.  Using Ohm’s law (**V = IR**) you can compute the minimum resistor value to stay under the LED’s current rating.

> **Important safety note:** Never connect an LED directly to the 5 V or 3.3 V pins without a resistor.  Doing so can overheat the LED and potentially damage your microcontroller.  Always include a current‑limiting resistor in series to protect the circuit【747266350938052†L187-L193】.

For example, suppose your board provides 5 V, the LED’s forward voltage drop is ~2 V, and you want to limit current to 20 mA (0.02 A).  Then:

- Voltage across the resistor = 5 V – 2 V = 3 V
- Resistance = Voltage ÷ Current = 3 V ÷ 0.02 A ≈ 150 Ω【723163177447044†L126-L147】

Because 150 Ω isn’t a common value, most kits include **220 Ω** or **330 Ω** resistors, which limit current to around 9–13 mA and keep the LED comfortably bright【723163177447044†L145-L150】.  Higher resistor values up to 1 kΩ work too but will make the LED dimmer【601654697679610†L88-L90】.

> **Try this:** Use the formula above to calculate the minimum resistor value if you power the LED from a 3.3 V pin instead of 5 V.  Assume the LED forward drop is 2 V and a safe current is 15 mA.  Write your answer down and compare it to the resistor values in your kit.

> **Answer:** A 3.3 V supply minus a 2 V forward drop leaves 1.3 V across the resistor.  Dividing by 0.015 A yields ~87 Ω.  Standard values between **100 Ω and 180 Ω** work well for 3.3 V systems.  We will revisit 3.3 V logic when we explore the ESP32 later in the course.

## 2 – Building the Circuit

Follow these steps to assemble your first external LED circuit:

1. **Power off the Arduino.** Unplug the USB cable or external supply to prevent accidental shorts【723163177447044†L103-L104】.
2. **Insert the LED.** Place the LED’s shorter leg (cathode) in a hole on your breadboard and connect that row to one of the Arduino’s GND pins with a black wire【723163177447044†L105-L109】.  Place the longer leg (anode) in a different row【723163177447044†L110-L112】.
3. **Add the resistor.** Connect one end of a 220 Ω or 330 Ω resistor to the anode’s row and the other end to a digital pin (e.g. pin 12 or pin 13) using a coloured jumper wire【723163177447044†L110-L114】.  Any digital pin will work; adjust the code accordingly.
4. **Double‑check the connections.** Ensure the resistor and LED are in series and that the cathode is connected to GND.  The circuit should look similar to the schematic below.

![LED circuit schematic](/home/oai/share/day02/led_circuit.png)

> **Hands‑on:** Use a multimeter to measure the voltage across the resistor and the LED once your circuit is powered.  Verify that the measured voltage drop across the resistor multiplied by the current (I = V/R) matches your calculated current.  If you don’t have a multimeter, observe differences in brightness when swapping a 220 Ω resistor for a 1 kΩ resistor.

## 3 – Writing the Blink Code

Now you’ll write a simple Arduino sketch to turn the LED on and off.  Arduino programs consist of two main functions: **setup()** (runs once at startup) and **loop()** (runs repeatedly)【601654697679610†L103-L111】.

```cpp
const int LED_PIN = 13;  // choose any digital pin you connected the resistor to

void setup() {
  pinMode(LED_PIN, OUTPUT);  // configure the pin as an output【601654697679610†L130-L146】
}

void loop() {
  digitalWrite(LED_PIN, HIGH);  // turn the LED on【601654697679610†L150-L152】
  delay(1000);                  // wait one second
  digitalWrite(LED_PIN, LOW);   // turn the LED off【601654697679610†L156-L157】
  delay(1000);                  // wait one second
}
```

Upload this code to your board.  If everything is wired correctly, the LED will blink once per second.  You can change `delay(1000)` to a different value (in milliseconds) to alter the blink rate.

> **Using the built‑in LED:** Most Arduino boards have an on‑board LED connected to digital pin 13.  You can replace `LED_PIN` with the constant `LED_BUILTIN` to blink this built‑in LED and test your program without wiring an external LED【723163177447044†L45-L47】.

> **Challenge:** Modify the code so that the LED blinks in a pattern: two short flashes followed by one long flash.  (Hint: vary the delay times between `HIGH` and `LOW` commands.)

### Using PWM to control brightness
Some digital pins on the Arduino support **pulse‑width modulation** (PWM), which lets you vary the apparent brightness by rapidly switching the LED on and off.  Instead of `digitalWrite()`, use `analogWrite(pin, value)` with a value between 0 (off) and 255 (full brightness).  On the Uno, PWM output is available on **pins 3, 5, 6, 9, 10 and 11**【353571490454733†L117-L119】—look for the **“~”** symbol printed next to the pin number.  If you plan to use `analogWrite()`, make sure your LED and resistor are connected to one of these pins.  Try fading the LED up and down smoothly; this will prepare you for controlling servos and motors in later lessons.

## 4 – Exploring Variations

Experiment with different resistor values and observe how brightness changes.  For example, compare a 220 Ω resistor with a 1 kΩ resistor.  Notice that the LED becomes dimmer as resistance increases【723163177447044†L145-L150】.  Use a multimeter to measure current in each case and verify that Ohm’s law holds.

You can also try changing the color of the LED.  Different colors have different forward voltage drops; red LEDs typically drop ~2 V while blue and white LEDs drop ~3 V or more.  Recalculate the resistor value accordingly.

> **Question:** What happens if you accidentally connect the LED without a resistor?  Why is this dangerous?  Answer in your own words using the concepts learned today.

## 5 – Recommended Resources

- **Video:** *Arduino Project 1: Flash an LED and learn about Ohm’s Law* (Blue Book Channel, 2024).  Watch minutes 0:00–4:00 for a demonstration of connecting an LED with a resistor and blinking it.  Search the video title on YouTube if the link changes.
- **Article:** *LED Polarity and Resistor Basics* (Build‑Electronic‑Circuits, 2024).  Read the section that explains why you need a resistor and how to connect the LED on a breadboard【723163177447044†L103-L114】.
- **Guide:** *Light‑Emitting Diodes (LEDs) – SparkFun* (SparkFun Learn, 2023).  Focus on the “Polarity Matters” section to reinforce how to identify anode and cathode【747266350938052†L169-L172】.

## 6 – Summary & Next Steps

Today you learned how to identify LED polarity, apply Ohm’s law to choose a resistor, build and test an LED circuit on a breadboard, and program the Arduino to blink the LED.  You also explored how resistor values affect brightness and practiced modifying delay values to create patterns.

These foundational concepts—current limiting and safe use of digital pins—will recur throughout the course.  In upcoming lessons on buttons, sensors and the ESP32’s 3.3 V outputs you will apply the same thinking to protect components and design more complex circuits.

In the next lesson you’ll learn how to read digital input using a push‑button and combine it with the LED to create interactive behavior.  Gather a push‑button and another resistor, and get ready to expand your circuit!
