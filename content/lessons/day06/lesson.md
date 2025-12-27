# Day 6 – Light & Flame Sensors

Yesterday you learned how to measure an analog voltage with a potentiometer and use PWM to control an LED.  Today you’ll extend those skills to **sensors** that react to the environment: a **photoresistor** that senses light and a **flame sensor module** that can detect infrared radiation from a candle flame.  These projects introduce new analog and digital sensors and show how to calibrate and tune them.

## Learning objectives

By the end of this lesson you will be able to:

1. Describe how a **photoresistor (LDR)** works and why it needs to be used in a voltage divider ([SparkFun photocell guide](https://learn.sparkfun.com/tutorials/photocell-hookup-guide)).
2. Build a circuit that uses a photoresistor and a fixed resistor to control the brightness of an LED.
3. Calibrate analog sensors using functions like `map()` and `constrain()` ([Arduino map()](https://docs.arduino.cc/language-reference/en/functions/math/map/) and [constrain()](https://docs.arduino.cc/language-reference/en/functions/math/constrain/)).
4. Explain how a **flame sensor module** detects infrared radiation and outputs an analog signal ([DFRobot flame sensor](https://wiki.dfrobot.com/Flame_sensor_SKU__DFR0076)).
5. Wire and program a flame sensor to trigger an alarm when a flame is detected.

## Introduction to light sensors

A **photoresistor** (also called a **light‑dependent resistor** or LDR) is a passive device whose resistance decreases as the light falling on it increases ([SparkFun photocell guide](https://learn.sparkfun.com/tutorials/photocell-hookup-guide)).  Microcontrollers cannot directly measure resistance, so we build a **voltage divider** using the photoresistor and a fixed resistor.  When the photoresistor is connected between **5 V and an analog input** and a **10 kΩ resistor is connected between the same analog pin and ground**, the voltage at the analog pin varies with the light level.  The Arduino can then convert this voltage into a number between 0 and 1023 using `analogRead()` as you learned yesterday ([Arduino analogRead reference](https://docs.arduino.cc/language-reference/en/functions/analog-io/analogRead/)).

LDRs typically have a very wide resistance range—from tens of kilohms in the dark to a few kilohms in bright light ([SparkFun photocell guide](https://learn.sparkfun.com/tutorials/photocell-hookup-guide)).  Because the range of voltages produced by the divider may be smaller than 0–5 V, we often need to **calibrate** or **map** the sensor readings to a usable range for PWM or other outputs.

## Materials

- Arduino Uno or compatible board
- **Photoresistor (LDR)**
- **10 kΩ resistor** (fixed)
- **LED** and **330 Ω resistor**
- **Flame sensor module** (IR flame detection sensor)
- **Buzzer** (optional) or another LED for alarms
- Breadboard and jumper wires

## Part 1 – Building a light‑sensing night‑light

### Step 1 – Wire the photoresistor circuit

1. Insert the **photoresistor** into the breadboard.  Connect **one lead to 5 V** and the **other lead to analog pin A0** on your Arduino.
2. Insert a **10 kΩ resistor** into the breadboard so that one end is connected to **A0** and the other end is connected to **GND**.  This resistor together with the photoresistor forms a voltage divider.
3. Verify the circuit: With bright light on the sensor, the voltage at A0 should be close to 5 V (reading near 1023); in darkness it should drop toward 0 V (reading near 0).  Use `analogRead()` and the Serial Monitor to confirm ([Arduino analogRead reference](https://docs.arduino.cc/language-reference/en/functions/analog-io/analogRead/)).

> **Tip:** If your board runs at 3.3 V or uses a different reference voltage, remember that `analogRead()` still returns values between 0–1023; the voltage per step changes.  You can adjust the calculation by replacing 5.0 with your board’s reference voltage (see Day 5).

### Step 2 – Add an LED indicator

Connect the **LED** and **330 Ω resistor** just like you did yesterday: the **long leg (anode)** of the LED connects to **digital pin 9**, and the **short leg (cathode)** goes through the resistor to **GND**.  Pin 9 supports PWM, which allows us to dim the LED ([Arduino analogWrite reference](https://docs.arduino.cc/language-reference/en/functions/analog-io/analogWrite/)).

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

**How it works:** The `map()` function rescales the 0–1023 lightLevel to the 0–255 PWM range and inverts it so that a low lightLevel (dark) results in a high brightness ([Arduino map()](https://docs.arduino.cc/language-reference/en/functions/math/map/)).  We also use `constrain()` to clip the value between 0 and 255 ([Arduino constrain()](https://docs.arduino.cc/language-reference/en/functions/math/constrain/)).  Adjust the mapping range (e.g. 300–800) if your sensor does not reach the extremes.  When you upload and run the sketch, cover and uncover the sensor to watch the LED dim and brighten.

> **Experiment:** Try reversing the logic to make the LED brighter in bright light.  Modify the `map()` call to `map(lightLevel, 0, 1023, 0, 255)` to get a “brightness indicator” instead of a night‑light.

### Step 4 – Automatic calibration (optional)

If your sensor’s light range is narrow, you can record the **minimum** and **maximum** sensor values and use them to map the sensor output to the full PWM range.  The Arduino **Calibration** example demonstrates tracking minimum and maximum readings and then mapping to a new range ([Arduino Calibration example](https://docs.arduino.cc/built-in-examples/analog/Calibration)).  Implementing this technique is a good exercise in programming and will make your night‑light more responsive.

### Understanding your LDR

To visualise how the photoresistor changes resistance with light, the plot below shows a typical relationship: the resistance decreases as the light intensity increases.  The horizontal axis uses a logarithmic scale (lux) and the vertical axis shows resistance in kilohms.  Your own sensor’s curve may differ, but the trend will be similar ([SparkFun photocell guide](https://learn.sparkfun.com/tutorials/photocell-hookup-guide)).

![LDR resistance vs light intensity](diagram.png)

## Part 2 – Detecting flames

### How the flame sensor works

The **flame sensor module** detects infrared light emitted by hot objects such as candles.  The DFRobot flame sensor responds to light sources in the **760 nm to 1100 nm** range and provides an **analog output** that varies with the detected IR intensity ([DFRobot flame sensor](https://wiki.dfrobot.com/Flame_sensor_SKU__DFR0076)).

Key specifications (for the DFRobot flame sensor) include:

- Operating voltage: **3.3 V to 5 V**.
- Detection angle: **60°**.
- Detection range: **20 cm to 100 cm** (depends on supply voltage).
- Spectral sensitivity: **760 nm to 1100 nm**.
- Response time: **15 µs**.

Source: [DFRobot flame sensor](https://wiki.dfrobot.com/Flame_sensor_SKU__DFR0076).

### Wiring the flame sensor

The module typically has three pins: **VCC**, **GND**, and **AO** (analog output).  Connect them as follows:

1. Connect **VCC** to **5 V** on the Arduino and **GND** to ground.
2. Connect **AO** to **analog pin A1**.  Reading this pin with `analogRead()` will return a value proportional to flame intensity.
3. Optionally connect a **buzzer** (from Day 4) or an LED to another digital pin to serve as an alarm.

### Flame detection sketch

Here is a simple example that reads the analog output, compares it against a threshold, and triggers an alarm when the reading indicates a flame. It also prints the analog value to the Serial Monitor for observation:

```cpp
const int flamePin  = A1;   // analog output
const int alarmPin  = 8;    // buzzer or LED
const int threshold = 400;  // adjust after calibration

void setup() {
  Serial.begin(9600);
  pinMode(alarmPin, OUTPUT);
}

void loop() {
  int analogValue = analogRead(flamePin);   // intensity

  Serial.print("Analog IR value: ");
  Serial.print(analogValue);
  Serial.print("\tFlame detected: ");
  Serial.println(analogValue > threshold ? "YES" : "NO");

  // If your readings decrease when a flame is present, flip the comparison.
  if (analogValue > threshold) {
    digitalWrite(alarmPin, HIGH);  // activate buzzer/LED
  } else {
    digitalWrite(alarmPin, LOW);
  }
  delay(50);
}
```

**Calibrating the threshold:**  Use `analogRead()` to observe the sensor values in bright IR (near a small flame) and in normal room lighting.  Choose a threshold in between.  You can also use `map()` to scale the values if needed ([Arduino map()](https://docs.arduino.cc/language-reference/en/functions/math/map/)).

> **Safety note:** Only test the sensor with **small, controlled flames** (e.g. a single candle).  Keep flammable materials and the Arduino far enough away that nothing can ignite.  Never leave an open flame unattended, and have a **fire extinguisher** or a glass of water nearby.  Avoid using flammable liquids such as rubbing alcohol in these experiments.  If you’re uncomfortable using an open flame, you can test the sensor by pointing it at an IR remote control—pressing any button will emit IR light that the sensor can detect.

### Project extension ideas

1. **Combined night‑light and flame alarm:** Use both the photoresistor and flame sensor.  Dim the LED when it’s dark, but if a flame is detected, flash the LED rapidly or sound the buzzer.
2. **Data logging:** Use the Serial Plotter to visualise light and flame intensity over time.  Experiment with different light sources and distances.  Record the analog values and calibrate thresholds.
3. **Automatic sprinkler (simulation):** Instead of a buzzer, use a servo motor to “activate” a sprinkler (a servo moving a lever) when a flame is detected.
4. **Sensitivity sweep:** Write a sketch that reads the analog output and prints a scaled “intensity” value.  Use the `map()` function to convert analog values into a 0–100 scale for easier comparison ([Arduino map()](https://docs.arduino.cc/language-reference/en/functions/math/map/)).

## Troubleshooting

- **Photoresistor readings don’t change:** Ensure one side of the photoresistor goes to 5 V and the other to the analog pin.  The 10 kΩ resistor must connect between the analog pin and ground.
- **LED always on or off:** Check that the LED anode is connected to the PWM pin and the cathode goes through a resistor to GND.  Verify your `map()` parameters correspond to your sensor’s range.
- **Flame sensor constantly triggers:** Adjust your threshold and account for false positives from incandescent bulbs or sunlight.
- **Analog values near 1023 or 0:** Ensure the sensor is properly powered and that there are no loose connections.  If the sensor saturates, use a different resistor value (e.g. 100 kΩ) in the voltage divider to shift the range.
- **Interference from IR remotes:** IR remote controls emit infrared radiation; pressing remote buttons may cause the flame sensor to trigger.  Use this to your advantage when testing!

## Summary

In this lesson you learned how to interface with two simple sensors: a **photoresistor** for measuring light and a **flame sensor module** for detecting infrared radiation from flames.  By building a voltage divider with the photoresistor and a fixed resistor you converted changing resistance into a measurable voltage.  You mapped that voltage to a PWM brightness level to create a responsive night‑light, and you learned how to calibrate sensors using `map()` and `constrain()`.  You also used the flame sensor’s analog output to detect IR intensity and trigger an alarm.  Using these techniques, you can incorporate analog sensors into your projects, detect environmental conditions, and respond appropriately.  Tomorrow, you will explore more sensors and continue building your toolkit!
