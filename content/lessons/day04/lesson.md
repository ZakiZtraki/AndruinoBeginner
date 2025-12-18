# Day 4 – Buzzers & Sound: Active vs Passive, `tone()` & Melodies

## Learning objectives

By the end of today’s lesson you will be able to:

- **Differentiate between active and passive buzzers.** An active buzzer contains an internal oscillator and produces a tone when DC power is applied, whereas a passive buzzer needs a changing (AC) signal to make sound【484041617127296†L184-L199】.
- **Identify the polarity and pinout of a buzzer.** Buzzers are polarized: the positive terminal is marked with a `+` sign and the negative terminal with `–`【484041617127296†L178-L180】.
- **Wire and drive an active buzzer using simple digital output.** Learn how to produce on/off beep patterns by switching the buzzer on and off with `digitalWrite()`【484041617127296†L255-L287】.
- **Wire a passive buzzer and generate different tones using `tone()` and `noTone()`.** Understand the syntax `tone(pin, frequency, duration)`【484041617127296†L331-L337】 and how to stop a tone with `noTone()`.  
- **Appreciate the limitations of `tone()`:** only one tone at a time, interference with PWM on pins 3 and 11, and no frequencies below 31 Hz【528227448425117†L146-L157】.
- **Compose simple melodies using arrays of frequencies and durations.**
- **Review safety and best practices:** use series resistors (≈100 Ω) with passive buzzers to limit current【484041617127296†L192-L199】【484041617127296†L320-L323】 and avoid overdriving your board.

## 1. Introduction

Buzzers are small devices that convert electrical signals into audible sounds. They’re found in alarm clocks, doorbells and many consumer products【484041617127296†L161-L165】. In electronics, a buzzer is a useful way to provide audible feedback for events (e.g., button pressed) or alerts (e.g., timer finished). There are two main types:

- **Active buzzer:** Contains a built‑in oscillator. When you apply a DC voltage (usually between 1.5 V and 24 V) the buzzer generates a tone of around 2 kHz and draws up to 25 mA【484041617127296†L184-L190】.
- **Passive buzzer:** Lacks an internal oscillator. It behaves like a small speaker and will not buzz when driven with a constant DC voltage. It needs a changing signal to vibrate and can produce different pitches depending on the frequency you supply【484041617127296†L192-L199】.

You can tell them apart by appearance: passive buzzers often lack a back cover and have a higher internal resistance; active buzzers are sealed and show a lower resistance when tested with a multimeter【484041617127296†L219-L241】.

## 2. Identifying and testing your buzzer

1. **Check the label:** Look for a `+` sign on one leg and a `–` sign on the other. This tells you the polarity【484041617127296†L178-L180】.  
2. **Visual cues:** Active buzzers usually have a plastic cover on the back. Passive buzzers are often open on the back【484041617127296†L219-L234】.  
3. **Simple test:** Briefly connect your buzzer to a 9 V battery (observe polarity!). An active buzzer will emit a continuous tone; a passive buzzer will just click【484041617127296†L233-L235】.  
4. **Measure resistance:** Use a multimeter in resistance mode. An active buzzer shows a low resistance (~16 Ω), whereas a passive buzzer shows a higher resistance【484041617127296†L233-L241】.

### Common mistakes

- **Reversing the polarity**: Buzzers are polarized; connecting them backwards can prevent sound or damage the device.  
- **Using DC with a passive buzzer:** A passive buzzer requires a changing signal. Connecting it directly to 5 V will only produce a click【484041617127296†L192-L199】.

## 3. Active buzzer circuit (on/off tone)

Active buzzers generate a fixed tone internally. You simply turn the power on or off to control them. Here’s how to wire and program one:

### Materials

- Active buzzer
- Arduino (Uno or compatible)
- Breadboard and jumper wires
- USB cable for programming

### Wiring steps

1. Place the active buzzer on the breadboard.  
2. Connect the **positive** pin of the buzzer (`+`) to **digital pin 4** on the Arduino.  
3. Connect the **negative** pin (`–`) to **GND**.  

When you connect the positive pin directly to 5 V, the buzzer will beep continuously【484041617127296†L255-L263】. To control when it turns on, connect it to a digital output.

### Example: Making a doorbell tone

Upload this sketch:

```cpp
#define BUZZER_PIN 4
void setup() {
  pinMode(BUZZER_PIN, OUTPUT);
}

void loop() {
  digitalWrite(BUZZER_PIN, HIGH);  // turn buzzer on
  delay(500);                      // beep for 0.5 s
  digitalWrite(BUZZER_PIN, LOW);   // turn buzzer off
  delay(500);                      // silence for 0.5 s
}
```

This code turns the buzzer on and off at half‑second intervals. Changing the delays allows you to create your own patterns【484041617127296†L284-L292】.

### Build on previous lessons

Try connecting a **button** from Day 3. When you press the button the buzzer should beep; when you release it it stops. Use `digitalRead()` to read the button and set the buzzer accordingly.

## 4. Passive buzzer and the `tone()` function

A passive buzzer behaves like a tiny speaker. To generate sound you must provide an oscillating signal. Arduino offers `tone()` for this purpose.

### Wiring

1. Place the passive buzzer on the breadboard.  
2. Connect its **positive** pin to **digital pin 7** on the Arduino.  
3. Connect the **negative** pin to **GND**.  
4. Insert a **100 Ω resistor** in series with the positive lead to limit current, because passive buzzers have a low internal resistance (~16 Ω)【484041617127296†L192-L199】【484041617127296†L320-L323】.

### Using `tone()` and `noTone()`

`tone(pin, frequency, duration)` generates a square wave of a specified frequency on the given pin. If you omit the `duration` argument the tone will continue until you call `noTone(pin)`【484041617127296†L331-L337】. Important details:

- **Only one tone at a time:** If a tone is playing on one pin, calling `tone()` on another pin has no effect【528227448425117†L151-L153】.
- **Interferes with PWM:** Using `tone()` interferes with `analogWrite()` on pins 3 and 11【528227448425117†L155-L156】. Avoid mixing `tone()` and PWM on these pins.
- **Frequency range:** You can’t generate a frequency below 31 Hz【528227448425117†L157-L158】. Human ears are most sensitive between 2 kHz and 5 kHz【552226950530801†L103-L105】.

### Example: Playing a scale

This sketch plays a simple scale (seven notes) using the `tone()` function:

```cpp
#define BUZZER_PIN 7
// frequencies for a simple scale (middle C through B)
int notes[] = {262, 294, 330, 349, 392, 440, 494};
int durations[] = {500, 500, 500, 500, 500, 500, 500};
int numNotes = sizeof(notes) / sizeof(notes[0]);

void setup() {
  pinMode(BUZZER_PIN, OUTPUT);
}

void loop() {
  for(int i=0; i<numNotes; i++) {
    tone(BUZZER_PIN, notes[i]);     // start the note
    delay(durations[i]);            // hold it for the duration
    noTone(BUZZER_PIN);             // stop the sound
    delay(50);                      // short pause between notes
  }
  delay(1000); // pause before repeating
}
```

The `tone()` function starts a square wave at the given frequency; `noTone()` stops it【528227448425117†L146-L168】. You can customise the `notes` and `durations` arrays to play your own tunes. Try reversing the order or experimenting with different frequencies.

### Experiment: Sweeping pitch

Use a `for` loop to sweep the frequency from 200 Hz to 2000 Hz:

```cpp
for (int f = 200; f <= 2000; f += 10) {
  tone(BUZZER_PIN, f, 30); // 30 ms tone at frequency f
  delay(30);               // wait for the tone to finish
}
```

Listen to how the pitch rises. This illustrates how frequency relates to perceived pitch【552226950530801†L103-L132】.

## 5. Composing simple melodies

To play recognisable tunes you need two arrays: one for note frequencies and one for note durations. Many beginners use a helper file `pitches.h` (as in the SunFounder kit) that defines constants like `NOTE_C4`, `NOTE_E4`, etc. The `tone()` command then uses these constants in a loop【528227448425117†L146-L177】. An example melody might look like:

```cpp
#include "pitches.h"
#define BUZZER_PIN 7
// notes in the melody
int melody[] = {NOTE_C4, NOTE_E4, NOTE_G4, NOTE_C5};
int durations[] = {500, 500, 500, 500};
void setup() {}
void loop() {
  for (int i = 0; i < 4; i++) {
    tone(BUZZER_PIN, melody[i], durations[i]);
    delay(durations[i] * 1.3); // add a small pause between notes
  }
  delay(2000);
}
```

This plays a simple arpeggio. You can look up frequencies for common notes or include the `pitches.h` file available in many tutorials【528227448425117†L146-L178】.

### Challenge: Create an alarm

Create a function that plays a repeating pattern (e.g. high‑low‑high) when a condition is met (like a button press or sensor value). Incorporate what you learned from previous lessons to trigger and stop the alarm.

## 6. Additional resources

- **Video:** *How to Use Buzzers (Active and Passive) with Arduino* on YouTube. Watch from **0:00 – 3:00** for an explanation of the differences between active and passive buzzers and from **5:30 – 7:30** for wiring and code examples.
- **Video:** *Programming Electronics Academy – tone() Function* (YouTube). Watch from **1:30 – 4:00** to see how to use `tone()` and discover its limitations.
- **Reading:** The Circuit Digest article on **Understanding Difference between Active and Passive Buzzer and How to use it with Arduino** provides in‑depth explanations and sample codes【484041617127296†L184-L199】【484041617127296†L295-L323】.

## Summary

- **Active vs passive:** Active buzzers have an internal oscillator and beep when powered; passive buzzers need a square wave and can play multiple notes【484041617127296†L184-L199】.  
- **Pinout and polarity:** Always connect the `+` leg to the Arduino’s output or 5 V and the `–` leg to GND【484041617127296†L178-L180】.  
- **Active buzzer control:** Use `digitalWrite()` to turn an active buzzer on and off【484041617127296†L255-L287】.  
- **Passive buzzer control:** Use `tone(pin, frequency, duration)` to generate a tone; call `noTone()` to stop it【484041617127296†L331-L337】. Only one tone can play at a time and `tone()` interferes with PWM on pins 3 and 11【528227448425117†L146-L157】.  
- **Musical creativity:** By combining arrays of frequencies and durations you can play scales, alarms and songs. Experiment by changing pitches and patterns to explore sound design【552226950530801†L103-L132】.

Congratulations! You now know how to make your projects heard. Tomorrow we’ll explore analog inputs with potentiometers and sensors.
