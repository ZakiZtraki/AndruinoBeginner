# Day 8 – PIR Motion Sensor

## Learning objectives

- Understand how Passive Infrared (PIR) sensors work and what they measure.
- Wire and configure an HC‑SR501 PIR sensor with an Arduino Uno.
- Adjust the sensor’s sensitivity and time delay using built‑in potentiometers.
- Write Arduino code to detect motion, trigger an LED or buzzer, and log events.
- Calibrate the sensor’s detection range and delay, and integrate it with previous lessons.

## Introduction: sensing motion

Passive Infrared (PIR) sensors are used in security lights and alarm systems to detect when something moves through their field of view. A popular module for hobbyists is the **HC‑SR501**. It combines a pyroelectric sensor with a Fresnel lens and on‑board electronics. The pyroelectric sensor responds only to **changes in infrared radiation**, not to absolute temperature; this means the module senses a moving warm body but not a stationary heater ([Adafruit PIR guide](https://learn.adafruit.com/pir-passive-infrared-proximity-motion-sensor)). The lens focuses infrared radiation from a wide area onto the sensor. The HC‑SR501 operates from **4.5–20 V** and has a very low **quiescent current (~50 µA)**, making it suitable for low‑power projects ([MakerGuides HC‑SR501 specs](https://www.makerguides.com/hc-sr501-arduino-tutorial/)).

On the module you will find two orange potentiometers. One adjusts **sensitivity** (detection range) and the other sets the **time delay** that the output stays high after motion is detected. The HC‑SR501’s measuring range is roughly **3–7 m**, and the delay time can be set from **about 3 s to 300 s** ([MakerGuides HC‑SR501 specs](https://www.makerguides.com/hc-sr501-arduino-tutorial/)).

There is also a **trigger jumper** with two positions: *single trigger* and *repeat trigger*. In single trigger mode, the output goes high for the preset delay and ignores further motion; in repeat trigger mode, each motion event resets the timer so the output remains high while motion continues ([MakerGuides HC‑SR501 specs](https://www.makerguides.com/hc-sr501-arduino-tutorial/)).

## Materials

- HC‑SR501 PIR motion sensor
- Arduino Uno and USB cable
- Breadboard and jumper wires
- LED + 220 Ω resistor or active buzzer (from Day 4)
- Optional: piezo buzzer or servo for alarm project

## Activity 1 – Wiring the sensor

1. **Disconnect power** from the Arduino for safety.
2. Mount the PIR sensor on the breadboard. Identify the pins: **VCC**, **OUT** and **GND** (some modules use the labels *Vcc*, *Out*, *Gnd*).
3. Connect **VCC** to the Arduino **5 V** pin, **GND** to **ground**, and **OUT** to **digital pin 2**.
4. Connect an LED to **digital pin 13** (use the Arduino’s built‑in LED) or wire an external LED: connect the anode to **digital pin 9**, the cathode through a 220 Ω resistor to **ground** (see Day 2).
5. Optionally connect a buzzer to **digital pin 8** for audible alarms.

Double‑check your wiring. When complete, your circuit should resemble the diagram below. Use a small screwdriver to gently adjust the potentiometers.

## Activity 2 – Basic motion detector

Upload the sketch below. It reads the sensor’s digital output and turns on an LED and buzzer when motion is detected. The `motionState` variable stores whether motion was previously detected to avoid printing duplicate messages.

```cpp
const int pirPin = 2;      // HC‑SR501 OUT pin
const int ledPin = 9;      // LED
const int buzzerPin = 8;   // optional buzzer

bool motionState = false;  // previous state

void setup() {
  pinMode(pirPin, INPUT);     // read sensor
  pinMode(ledPin, OUTPUT);
  pinMode(buzzerPin, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int pirValue = digitalRead(pirPin);  // HIGH when motion detected
  if (pirValue == HIGH && !motionState) {
    motionState = true;
    digitalWrite(ledPin, HIGH);
    tone(buzzerPin, 2000);    // 2 kHz beep
    Serial.println("Motion detected!");
  }
  if (pirValue == LOW && motionState) {
    motionState = false;
    digitalWrite(ledPin, LOW);
    noTone(buzzerPin);
    Serial.println("Motion ended.");
  }
}
```

After uploading, open the Serial Monitor. Wait through the **warm‑up period**. Then wave your hand in front of the lens; the LED should light and the message should print once. When you stop moving, the LED will turn off after the delay you set on the potentiometer. Try adjusting the **delay** pot and observe how long the LED stays on. Notice how the **sensitivity** knob affects how far away your hand can be while still triggering the sensor.

**Common mistakes**

- Skipping the warm‑up: the sensor output may be unstable for the first minute.
- Confusing the two potentiometers: one controls range, the other controls delay. Use a labelled diagram or photograph to identify them, and adjust with a small screwdriver.
- Wiring the **OUT** pin to the wrong Arduino pin; the sensor will appear inactive if it’s not connected to the correct digital input.

## Activity 3 – Calibrate range and delay

Experiment with the two knobs:

- **Sensitivity (range)**: Turn clockwise to increase detection distance (up to roughly 7 m) and counter‑clockwise to reduce the range ([MakerGuides HC‑SR501 specs](https://www.makerguides.com/hc-sr501-arduino-tutorial/)). Use a tape measure to record the maximum distance at which motion triggers the sensor.
- **Delay**: Turn clockwise to increase the time the output remains high (up to ~300 s) and counter‑clockwise to shorten it (down to ~3 s) ([MakerGuides HC‑SR501 specs](https://www.makerguides.com/hc-sr501-arduino-tutorial/)). Time how long the LED stays on after you stop moving.

Explain in your notes how these two adjustments interact. Does increasing the delay affect the sensor’s ability to detect new motion? Do rapid successive motions reset the delay timer when the trigger jumper is set to *repeat* mode? Record your observations.

## Activity 4 – Mode selection and alarms

Move the trigger jumper between *single trigger* and *repeat trigger* and test the behaviour:

- **Single trigger**: When motion is detected, the output goes high and stays high for the preset delay; subsequent motion is ignored until the delay finishes.
- **Repeat trigger**: Every motion event resets the delay timer, so the output remains high while motion continues.

Now build an **intruder alarm**:

1. Add a **pushbutton** with a pull‑down resistor (review Day 3) to act as an arm/disarm switch.
2. Define a boolean variable `armed` that toggles when the button is pressed.
3. When `armed` is `true` and motion is detected, play a loud alarm (e.g. 3 kHz tone) for the duration of the delay.
4. Log “Alarm triggered” events with timestamps to the Serial Monitor.
5. Extend the project by incorporating the **photoresistor** from Day 6. Arm the alarm only when it is dark, or adjust sensitivity based on ambient light.

This project encourages you to integrate sensors and techniques from earlier lessons into a complete system.

## Additional exploration

- **Field of view mapping**: Move your hand around the sensor to map its detection zone. The HC‑SR501 has a roughly **110° detection cone** ([MakerGuides HC‑SR501 specs](https://www.makerguides.com/hc-sr501-arduino-tutorial/)). Note areas where movement is not detected, and consider how the sensor’s Fresnel lens divides the field into segments.
- **Environmental factors**: Place a candle or heater near the sensor and observe whether it triggers. The PIR sensor responds to changes, so constant heat sources should not cause a detection unless their temperature changes suddenly. Avoid aiming the sensor at direct sunlight or through glass.
- **Long‑term logging**: Modify your code to count how many motion events occur in an hour. Store the counts in EEPROM or print them to the Serial Monitor. Graph your results to identify patterns (for example, more motion in the evening). This is a simple introduction to data logging.

## Summary

In this lesson you learned that the HC‑SR501 PIR sensor detects changes in infrared radiation using a pyroelectric element and focusing lens ([Adafruit PIR guide](https://learn.adafruit.com/pir-passive-infrared-proximity-motion-sensor)). The sensor operates from 4.5–20 V with very low quiescent current and provides a digital output you can read with `digitalRead()` ([MakerGuides HC‑SR501 specs](https://www.makerguides.com/hc-sr501-arduino-tutorial/)). By adjusting the sensitivity and delay potentiometers and exploring trigger modes, you tuned the sensor to your environment. Finally, you built a simple alarm system and combined this new sensor with components from previous lessons. Continue experimenting by logging motion patterns or integrating the sensor into larger projects.
