# Day 5 – Analog Input & PWM Output

Welcome back!  Yesterday you learned how to make sounds with active and passive buzzers.  Today you’ll explore **analog input** and **pulse‑width modulation (PWM)**.  Using a simple knob (a potentiometer), you’ll read continuously variable voltages with `analogRead()`, scale them to 8‑bit values with `map()`, and then dim or brighten an LED using `analogWrite()`.

## Learning objectives

By the end of this lesson you will be able to:

1. **Explain how the Arduino’s analog‑to‑digital converter (ADC) works** and what 10‑bit resolution means.
2. **Wire a potentiometer as a voltage divider** and connect it safely to an Arduino analog pin.
3. **Read analog values** with `analogRead()` and convert them to actual voltages.
4. **Scale a 10‑bit reading (0–1023) to an 8‑bit PWM value (0–255)** using the `map()` function or simple arithmetic.
5. **Generate PWM output with `analogWrite()`** to control LED brightness and understand the difference between true analog output and PWM.
6. **Build a “brightness knob” project** and extend it with your own creative experiments.

## Background

### How analog input works

Arduino boards like the Uno include a multichannel 10‑bit **analog‑to‑digital converter (ADC)**.  When you call `analogRead(pin)`, the ADC measures the voltage present on that analog pin (relative to the board’s reference voltage) and converts it into an integer between **0 and 1023** ([Arduino analogRead reference](https://docs.arduino.cc/language-reference/en/functions/analog-io/analogRead/)).  On a 5 V Uno, 0 represents 0 V and 1023 represents 5 V, so each step corresponds to **about 4.9 mV**.  Boards with different reference voltages (e.g., 3.3 V or a custom reference set with `analogReference()`) will map the range accordingly ([Arduino analogReference reference](https://docs.arduino.cc/language-reference/en/functions/analog-io/analogReference/)).

### How a potentiometer becomes a voltage divider

A **potentiometer** has three terminals: two outer pins connected to a fixed resistance and a **center “wiper”** that moves along the resistive track.  By connecting the outer pins to **5 V and ground** and the center wiper to an analog input, you create a **voltage divider**.  Turning the shaft changes the ratio of resistance on either side of the wiper and therefore the voltage on the center pin.  If the wiper is fully toward the 5 V end, the voltage at the wiper is close to 5 V and `analogRead()` returns a value near 1023; if it’s fully toward ground, `analogRead()` returns a value near 0 ([SparkFun potentiometer tutorial](https://learn.sparkfun.com/tutorials/potentiometers)).

### Reading analog values

When you read the potentiometer with

```cpp
int sensorValue = analogRead(A0);
```

the variable `sensorValue` will hold a number between 0 and 1023.  To convert this back to a voltage, multiply by the reference voltage and divide by 1023.0 (not 1024 because the maximum index is 1023):

```cpp
float voltage = sensorValue * (5.0 / 1023.0);
```

The Arduino documentation’s **Read Analog Voltage** example demonstrates this conversion and explains that the ADC returns 0 when 0 V is applied and 1023 when 5 V is applied.  The example also highlights that boards using 3.3 V must adjust the numerator accordingly ([Read Analog Voltage example](https://docs.arduino.cc/built-in-examples/basics/ReadAnalogVoltage)).

### Generating analog‑like output with PWM

Microcontrollers cannot output true analog voltages directly on most pins, but they can produce a **pulse‑width modulated (PWM) signal** that approximates an analog level.  When you call `analogWrite(pin, value)`, the pin generates a square wave whose **duty cycle** (percentage of the time it is HIGH) corresponds to the **value** between **0 (always off) and 255 (always on)**.  The Arduino core manages this for you using hardware timers on specific PWM pins (3, 5, 6, 9, 10 and 11 on the Uno).  After you call `analogWrite()`, the PWM signal continues until another call to `analogWrite()` or a call to `digitalRead()`/`digitalWrite()` on the same pin ([Arduino analogWrite reference](https://docs.arduino.cc/language-reference/en/functions/analog-io/analogWrite/)).

## Materials and prerequisites

You will need:

- **Arduino Uno or compatible board** (other AVR‑based boards will work similarly).
- **10 kΩ potentiometer** (linear taper recommended).
- **LED** and **220 Ω resistor** (to limit current).
- **Breadboard** and **jumper wires**.
- **USB cable** for programming.
- Optional: **multimeter** for measuring voltages.

Before proceeding you should be comfortable with breadboard wiring, basic Arduino sketch structure and using digital outputs (from Days 1–3).

## Step 1 – Wire the potentiometer

1. Place the potentiometer on the breadboard so that all three pins sit in separate rows.
2. **Connect one outer pin to 5 V** and the **other outer pin to GND** on the Arduino.
3. Connect the **middle pin (wiper)** to **analog pin A0**.  The Arduino’s **Read Analog Voltage** example notes that connecting the three wires this way allows the ADC to measure a voltage between 0 V and 5 V as you turn the knob.  Turning the potentiometer changes the ratio of resistance on either side of the wiper and therefore the voltage at the center pin ([Read Analog Voltage example](https://docs.arduino.cc/built-in-examples/basics/ReadAnalogVoltage)).

> **Verification:** Upload a simple sketch that calls `Serial.begin(9600);` in `setup()`, reads `analogRead(A0)` in `loop()`, and prints the value to the serial monitor.  Turn the knob and ensure the reported values vary smoothly between ~0 and 1023.

**Common mistake:** If the outer pins are swapped (both connected to ground or both to 5 V), the voltage at the wiper will not change.  Ensure that one end goes to 5 V and the other to GND.

## Step 2 – Wire the LED on a PWM pin

1. Insert the **LED** into the breadboard.  Remember that the **longer leg (anode) is positive** and should be connected toward the Arduino’s output, while the **shorter leg (cathode) goes to ground** (see Day 2 for more details).
2. Connect one end of a **220 Ω resistor** to digital pin 9 (this is one of the Uno’s PWM pins).  **Connect the other end of the resistor to the LED’s anode**, and connect the LED’s cathode to **GND**.  The Arduino example for **Analog In, Out Serial** uses this arrangement and notes that the long leg of the LED connects to the resistor and the shorter leg goes to ground ([Analog In, Out Serial example](https://docs.arduino.cc/built-in-examples/analog/AnalogInOutSerial)).

> **Checkpoint:** With the potentiometer wired from Step 1 and the LED/resistor connected, your circuit should match the diagram in the Arduino example.  Double‑check each connection before powering the board ([Analog In, Out Serial example](https://docs.arduino.cc/built-in-examples/analog/AnalogInOutSerial)).

## Step 3 – Read and convert analog values

Create a new sketch and add the following:

```cpp
const int potPin = A0;  // potentiometer wiper connected to A0
const int ledPin = 9;   // LED connected to PWM pin 9 through a resistor

void setup() {
  Serial.begin(9600);
  pinMode(ledPin, OUTPUT);
}

void loop() {
  int sensorValue = analogRead(potPin);  // read 0–1023
  float voltage = sensorValue * (5.0 / 1023.0);  // convert to volts
  Serial.print("sensorValue: ");
  Serial.print(sensorValue);
  Serial.print("\t voltage: ");
  Serial.println(voltage);
  delay(50);
}
```

Upload this sketch.  As you turn the knob, you should see the raw value and calculated voltage change smoothly.  If you’re using a 3.3 V board, replace `5.0` with `3.3` as the documentation suggests ([Read Analog Voltage example](https://docs.arduino.cc/built-in-examples/basics/ReadAnalogVoltage)).

## Step 4 – Map the value to PWM range

Because `analogWrite()` accepts values between **0 and 255**, you need to scale the 0–1023 range down ([Arduino analogWrite reference](https://docs.arduino.cc/language-reference/en/functions/analog-io/analogWrite/)).  The Arduino’s **Analog In, Out Serial** example shows how to use the `map()` function:

```cpp
outputValue = map(sensorValue, 0, 1023, 0, 255);
analogWrite(ledPin, outputValue);
```

The example explains that the Uno’s `analogRead()` returns 0–1023 while `analogWrite()` expects 0–255, so the value must be converted before dimming the LED.  The `map()` function takes five arguments: the value to remap, the low and high limits of the original range, and the low and high limits of the target range ([Arduino map() reference](https://docs.arduino.cc/language-reference/en/functions/math/map/)).  An alternative is to divide the sensor value by 4 (since 1023 ÷ 4 ≈ 255).

Add these lines to the previous sketch:

```cpp
int outputValue = map(sensorValue, 0, 1023, 0, 255);
analogWrite(ledPin, outputValue);
```

Upload the updated sketch.  Turning the knob should now brighten and dim the LED smoothly.

> **Why 0–255?** The PWM hardware on most AVR‑based Arduinos has an **8‑bit resolution**, giving 256 discrete duty‑cycle levels (0–255).  The `analogWrite()` function produces a square wave whose duty cycle corresponds to this value ([Arduino analogWrite reference](https://docs.arduino.cc/language-reference/en/functions/analog-io/analogWrite/)).

## Step 5 – Visualise the mapping

The graph below illustrates how the 10‑bit ADC values (0–1023) are scaled to the 8‑bit PWM range (0–255).  Notice how dividing by four or using `map()` produces a linear relationship.

![Mapping analogRead to analogWrite](diagram.png)

## Step 6 – Extend the project

Now that you have a working brightness knob, try these variations:

1. **Serial bar graph:** Print a row of asterisks proportional to `sensorValue` on the serial monitor to create a simple bar graph.  This helps visualise the knob position without an LED.
2. **Control sound:** Use your potentiometer value to set the frequency of a passive buzzer with `tone()` from Day 4.  For example, map 0–1023 to a frequency range between 200 Hz and 2000 Hz and listen to the pitch change.
3. **Smooth the input:** Rapidly turning the knob may produce jitter due to noise.  Try averaging several readings or using a simple low‑pass filter.
4. **Create a night‑light:** Combine the potentiometer with the photoresistor from tomorrow’s lesson.  Use the photoresistor to detect ambient light and the potentiometer to set a threshold; when the room gets darker than the threshold, turn on an LED strip.

## Troubleshooting and common mistakes

- **No change in `sensorValue`:** Check that the potentiometer’s outer pins are connected to 5 V and GND, not to the same rail.  Confirm that the wiper is connected to A0.
- **LED is always on or always off:** Ensure that you connected the LED anode to the resistor and the cathode to ground.  Verify the PWM pin number matches your code.
- **Inconsistent readings:** Unplug any unused analog pins or tie them to ground; floating pins can introduce noise.  You can also add a small delay or averaging.
- **3.3 V boards:** Adjust the voltage calculation and mapping ranges to suit the board’s reference voltage ([Arduino analogReference reference](https://docs.arduino.cc/language-reference/en/functions/analog-io/analogReference/)).

## Summary

In this lesson you learned that the **ADC on the Arduino Uno is 10 bits**, mapping analog voltages between 0 V and the reference voltage to integers **0–1023** ([Arduino analogRead reference](https://docs.arduino.cc/language-reference/en/functions/analog-io/analogRead/)).  By wiring a potentiometer as a voltage divider and reading it with `analogRead()`, you can obtain a continuous range of values ([SparkFun potentiometer tutorial](https://learn.sparkfun.com/tutorials/potentiometers)).  To control the brightness of an LED, you convert the 10‑bit reading to an **8‑bit PWM value** (0–255) using the `map()` function and write it to a PWM‑capable pin with `analogWrite()` ([Arduino map() reference](https://docs.arduino.cc/language-reference/en/functions/math/map/) and [Arduino analogWrite reference](https://docs.arduino.cc/language-reference/en/functions/analog-io/analogWrite/)).  PWM produces a square wave whose duty cycle approximates an analog voltage, letting you dim LEDs, control motors or vary sound pitch.  With this foundation, you’re ready to explore other analog sensors and build responsive, analog‑aware projects.
