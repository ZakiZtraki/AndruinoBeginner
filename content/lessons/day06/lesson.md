# Day 6 – Light & Flame Sensors

Yesterday you learned how to measure an analog voltage with a potentiometer and use PWM to control an LED.  Today you’ll extend those skills to **sensors** that react to the environment: a **photoresistor** that senses light and a **flame sensor module** that can detect infrared radiation from a candle flame.  These projects introduce new analog and digital sensors and show how to calibrate and tune them.

## Learning objectives

By the end of this lesson you will be able to:

1. Describe how a **photoresistor (LDR)** works and why it needs to be used in a voltage divider.
2. Build a circuit that uses a photoresistor and a fixed resistor to control the brightness of an LED.
3. Calibrate analog sensors using functions like `map()` and `constrain()`.
4. Explain how a **flame sensor module** detects infrared radiation and provides both analog and digital outputs【697309681949760†L68-L80】.
5. Wire and program a flame sensor to trigger an alarm when a flame is detected【697309681949760†L143-L146】.

## Introduction to light sensors

A **photoresistor** (also called a **light‑dependent resistor** or LDR) is a passive device whose resistance decreases as the light falling on it increases.  Microcontrollers cannot directly measure resistance, so we build a **voltage divider** using the photoresistor and a fixed resistor.  When the photoresistor is connected between **5 V and an analog input** and a **10 kΩ resistor is connected between the same analog pin and ground**, the voltage at the analog pin varies with the light level【773904459634521†L248-L254】.  The Arduino can then convert this voltage into a number between 0 and 1023 using `analogRead()` as you learned yesterday.

LDRs typically have a very wide resistance range—from tens of kilohms in the dark to a few kilohms in bright light.  Because the range of voltages produced by the divider may be smaller than 0–5 V, we often need to **calibrate** or **map** the sensor readings to a usable range for PWM or other outputs.

## Materials

- Arduino Uno or compatible board
- **Photoresistor (LDR)**
- **10 kΩ resistor** (fixed)
- **LED** and **330 Ω resistor**
- **Flame sensor module** (IR flame detection sensor with LM393 comparator)
- **Buzzer** (optional) or another LED for alarms
- Breadboard and jumper wires

## Part 1 – Building a light‑sensing night‑light

### Step 1 – Wire the photoresistor circuit

1. Insert the **photoresistor** into the breadboard.  Connect **one lead to 5 V** and the **other lead to analog pin A0** on your Arduino【773904459634521†L248-L254】.
2. Insert a **10 kΩ resistor** into the breadboard so that one end is connected to **A0** and the other end is connected to **GND**【773904459634521†L248-L254】.  This resistor together with the photoresistor forms a voltage divider.
3. Verify the circuit: With bright light on the sensor, the voltage at A0 should be close to 5 V (reading near 1023); in darkness it should drop toward 0 V (reading near 0).  Use `analogRead()` and the Serial Monitor to confirm.

> **Tip:** If your board runs at 3.3 V or uses a different reference voltage, remember that `analogRead()` still returns values between 0–1023; the voltage per step changes.  You can adjust the calculation by replacing 5.0 with your board’s reference voltage (see Day 5).

### Step 2 – Add an LED indicator

Connect the **LED** and **330 Ω resistor** just like you did yesterday: the **long leg (anode)** of the LED connects to **digital pin 9**, and the **short leg (cathode)** goes through the resistor to **GND**【773904459634521†L256-L267】.  Pin 9 supports PWM, which allows us to dim the LED.

### Step 3 – Write the night‑light sketch

Create a new sketch using the code below.  It reads the photoresistor’s voltage with `analogRead()`, maps it to the PWM range (0–255), and then writes the inverse of that value to the LED so that the LED brightens as it gets darker:

```cpp
const int sensorPin = A0;
const int ledPin = 9;

void setup() {
  Serial.begin(9600);
  pinMode(ledPin, OUTPUT);
}

void loop() {
  int lightLevel = analogRead(sensorPin);            // 0–1023 depending on light
  // Optional: track low/high to calibrate manually
  // Map the raw range (dark–bright) into 0–255 for PWM
  int brightness = map(lightLevel, 0, 1023, 255, 0); // invert: dark=255, bright=0
  brightness = constrain(brightness, 0, 255);
  analogWrite(ledPin, brightness);

  // Print values for debugging
  Serial.print("lightLevel: ");
  Serial.print(lightLevel);
  Serial.print("\t brightness: ");
  Serial.println(brightness);
  delay(50);
}
```

**How it works:** The `map()` function rescales the 0–1023 lightLevel to the 0–255 PWM range and inverts it so that a low lightLevel (dark) results in a high brightness.  We also use `constrain()` to clip the value between 0 and 255【773904459634521†L310-L324】.  Adjust the mapping range (e.g. 300–800) if your sensor does not reach the extremes【773904459634521†L329-L333】.  When you upload and run the sketch, cover and uncover the sensor to watch the LED dim and brighten.

> **Experiment:** Try reversing the logic to make the LED brighter in bright light.  Modify the `map()` call to `map(lightLevel, 0, 1023, 0, 255)` to get a “brightness indicator” instead of a night‑light.

### Step 4 – Automatic calibration (optional)

If your sensor’s light range is narrow, you can record the **minimum** and **maximum** sensor values and use them to map the sensor output to the full PWM range.  The SparkFun experiment suggests keeping track of `low` and `high` values and then mapping accordingly【773904459634521†L285-L343】.  Implementing this technique is a good exercise in programming and will make your night‑light more responsive.

### Understanding your LDR

To visualise how the photoresistor changes resistance with light, the plot below shows a typical relationship: the resistance decreases as the light intensity increases.  The horizontal axis uses a logarithmic scale (lux) and the vertical axis shows resistance in kilohms.  Your own sensor’s curve may differ, but the trend will be similar.

![LDR resistance vs light intensity](diagram.png)

## Part 2 – Detecting flames

### How the flame sensor works

The **flame sensor module** detects infrared light emitted by hot objects such as candles.  Inside the module, a photodiode senses IR radiation and feeds the signal to an **LM393 comparator**.  The comparator compares the signal with a threshold set by an onboard potentiometer.  When the detected IR radiation exceeds this threshold, the **digital output (DO)** changes state, signalling the presence of a flame【697309681949760†L70-L76】.  The module also provides an **analog output (AO)** proportional to the intensity of the IR light【697309681949760†L78-L80】.  A small **signal LED** on the module lights when IR is detected.【697309681949760†L78-L80】

Key specifications include:

- Operating voltage: **3.3 V to 5 V**【697309681949760†L85-L86】.
- Detection angle: **≈60°**, which limits the sensing area【697309681949760†L87-L88】.
- Detection range: **approximately 1–2 m**【697309681949760†L88-L89】.
- Adjustable sensitivity: Use the onboard potentiometer to fine‑tune the threshold【697309681949760†L90-L90】.

### Wiring the flame sensor

The module typically has four pins: **VCC**, **GND**, **AO** (analog output), and **DO** (digital output)【697309681949760†L115-L125】.  Connect them as follows:

1. Connect **VCC** to **5 V** on the Arduino and **GND** to ground.
2. Connect **AO** to **analog pin A1**.  Reading this pin with `analogRead()` will return a value proportional to flame intensity.
3. Connect **DO** to **digital pin 2** (or any other digital pin).  The digital output changes state when a flame is detected【697309681949760†L70-L76】.  Depending on the module, a LOW signal may indicate detection; test yours to confirm.
4. Optionally connect a **buzzer** (from Day 4) or an LED to another digital pin to serve as an alarm.

### Flame detection sketch

Here is a simple example that reads both the analog and digital outputs.  It uses the digital signal to trigger an alarm and prints the analog value to the Serial Monitor for observation:

```cpp
const int flameAOPin = A1;   // analog output
const int flameDOPin = 2;    // digital output
const int alarmPin   = 8;    // buzzer or LED

void setup() {
  Serial.begin(9600);
  pinMode(flameDOPin, INPUT);
  pinMode(alarmPin, OUTPUT);
}

void loop() {
  int analogValue = analogRead(flameAOPin);   // intensity
  int flameDetected = digitalRead(flameDOPin); // 0 or 1 depending on module

  Serial.print("Analog IR value: ");
  Serial.print(analogValue);
  Serial.print("\tFlame detected: ");
  Serial.println(flameDetected == LOW ? "YES" : "NO");

  if (flameDetected == LOW) {  // some modules output LOW when flame detected
    digitalWrite(alarmPin, HIGH);  // activate buzzer/LED
  } else {
    digitalWrite(alarmPin, LOW);
  }
  delay(50);
}
```

**Calibrating the threshold:**  Use a screwdriver to turn the small potentiometer on the module.  Adjust until the digital output triggers only when a flame is close by.  As you turn the screw, watch the digital output LED on the module to see when it changes state【697309681949760†L70-L76】.  The analog output can also be used to set your own threshold in software.

> **Safety note:** Only test the sensor with **small, controlled flames** (e.g. a single candle).  Keep flammable materials and the Arduino far enough away that nothing can ignite.  Never leave an open flame unattended, and have a **fire extinguisher** or a glass of water nearby.  Avoid using flammable liquids such as rubbing alcohol in these experiments.  If you’re uncomfortable using an open flame, you can test the sensor by pointing it at an IR remote control—pressing any button will emit IR light that the sensor can detect.

### Project extension ideas

1. **Combined night‑light and flame alarm:** Use both the photoresistor and flame sensor.  Dim the LED when it’s dark, but if a flame is detected, flash the LED rapidly or sound the buzzer.
2. **Data logging:** Use the Serial Plotter to visualise light and flame intensity over time.  Experiment with different light sources and distances.  Record the analog values and calibrate thresholds.
3. **Automatic sprinkler (simulation):** Instead of a buzzer, use a servo motor to “activate” a sprinkler (a servo moving a lever) when a flame is detected.
4. **Sensitivity sweep:** Write a sketch that reads the analog output and prints the corresponding distance to the flame.  Use the `map()` function to convert analog values into a crude distance estimate (as shown on the Arduino Project Hub code)【109493639795667†L36-L122】.

## Troubleshooting

- **Photoresistor readings don’t change:** Ensure one side of the photoresistor goes to 5 V and the other to the analog pin.  The 10 kΩ resistor must connect between the analog pin and ground【773904459634521†L248-L254】.
- **LED always on or off:** Check that the LED anode is connected to the PWM pin and the cathode goes through a resistor to GND【773904459634521†L256-L267】.  Verify your `map()` parameters correspond to your sensor’s range【773904459634521†L329-L333】.
- **Flame sensor constantly triggers:** Adjust the sensitivity potentiometer; many sensors output LOW when triggered, so invert the logic accordingly.  Beware of false positives from incandescent bulbs or sunlight.
- **Analog values near 1023 or 0:** Ensure the sensor is properly powered and that there are no loose connections.  If the sensor saturates, use a different resistor value (e.g. 100 kΩ) in the voltage divider to shift the range.
- **Interference from IR remotes:** IR remote controls emit infrared radiation; pressing remote buttons may cause the flame sensor to trigger.  Use this to your advantage when testing!

## Summary

In this lesson you learned how to interface with two simple sensors: a **photoresistor** for measuring light and a **flame sensor module** for detecting infrared radiation from flames.  By building a voltage divider with the photoresistor and a fixed resistor you converted changing resistance into a measurable voltage【773904459634521†L248-L254】.  You mapped that voltage to a PWM brightness level to create a responsive night‑light, and you learned how to calibrate sensors using `map()` and `constrain()`【773904459634521†L329-L333】.  You also explored the flame sensor’s analog and digital outputs and discovered how its LM393 comparator and adjustable threshold work【697309681949760†L70-L80】.  Using these techniques, you can incorporate analog and digital sensors into your projects, detect environmental conditions, and respond appropriately.  Tomorrow, you will explore more sensors and continue building your toolkit!