# Day 12 – Servo Motors: Precise Motion Control

## Learning objectives

By the end of this lesson you should be able to:

- Explain how hobby servo motors achieve precise position control using gears, feedback and PWM signals ([SparkFun hobby servo tutorial](https://learn.sparkfun.com/tutorials/hobby-servo-tutorial)).
- Identify the pinout and wiring colour codes of typical micro servos and connect one safely to your Arduino.
- Use the Arduino `Servo` library to sweep a servo through its range and control its angle with a potentiometer or sensor input.
- Understand the pulse widths and periods required to command a servo and know why calibration is sometimes needed.
- Build a small project that moves in response to a sensor, consolidating your skills from previous lessons.

## Materials and tools

| Item | Purpose |
|----|----|
| **SG90 micro servo** (or similar 5 V hobby servo) | Provides precise rotational movement over about 180° ([SG90 datasheet](https://components101.com/sites/default/files/component_datasheet/SG90%20Servo%20Motor%20Datasheet.pdf)).
| **Arduino Uno–style controller** | Supplies the control pulses and, for small servos, can provide power.
| **Breadboard and jumper wires** | For making temporary connections.
| **10 kΩ potentiometer** | Used to provide an analog control input for the servo.
| **External 5 V power supply** (optional) | Needed if your servo draws more than about 250 mA.
| **Laptop with Arduino IDE** | For editing and uploading code.
| **Safety equipment**: fume extractor or open window, safety glasses | While not as critical as soldering, always keep your workspace tidy and free of clutter.

## 1 – How does a servo work?

Hobby servos are compact actuators that combine a DC motor, a gear train, a position sensor and a control circuit into one unit.  The gear train reduces speed and increases torque, while a built‑in potentiometer measures the shaft position.  The control circuit compares the commanded position to the sensed position and drives the motor until the difference is zero.  This closed‑loop feedback system lets you tell a servo where to go and have it hold that position precisely ([SparkFun hobby servo tutorial](https://learn.sparkfun.com/tutorials/hobby-servo-tutorial)).

Because of the feedback mechanism, the range of motion is limited by mechanical stops.  Most hobby servos rotate about **180 degrees** (±90 °) ([SparkFun hobby servo tutorial](https://learn.sparkfun.com/tutorials/hobby-servo-tutorial)).  **Continuous‑rotation servos** are available; these use the same three‑wire interface but interpret the pulse width as a **speed command** rather than a position, so they act more like geared DC motors and cannot hold a specific angle.

### Control signal basics

Servos respond to a series of repeated **high‑voltage pulses**.  The **pulse width** determines the commanded position: around **1.5 ms** typically corresponds to the neutral position, shorter pulses (≈1.0 ms) send the servo toward one end, and longer pulses (≈2.0 ms) send it toward the other.  However, there is no universal standard; the neutral point and full range vary between models.  Hobby servos expect pulses roughly every **20 ms** (50 Hz), but the exact duty cycle doesn’t matter – it’s the length of the high pulse that counts ([Pololu servo control interface](https://www.pololu.com/blog/17/servo-control-interface-in-detail)).  The Arduino `Servo` library takes care of generating these pulses for you ([Arduino Servo library](https://docs.arduino.cc/libraries/servo/)).

## 2 – Servo pinout and wiring

Most hobby servos use a three‑pin connector with a 0.1‑inch pitch.  The order is standard even though colours vary:

| Servo wire | Typical colour | Arduino connection |
|-----------|--------------|------------------|
| **Power** | Red | Connect to **5 V** (4.8–6 V) ([SG90 datasheet](https://components101.com/sites/default/files/component_datasheet/SG90%20Servo%20Motor%20Datasheet.pdf)).  Too little voltage will cause weak movement; too much may damage the servo. |
| **Ground** | Brown or black | Connect to **GND**.  Always connect the servo ground to the Arduino ground ([SparkFun hobby servo tutorial](https://learn.sparkfun.com/tutorials/hobby-servo-tutorial)). |
| **Control** | Orange, yellow or white | Connect to a **PWM‑capable digital pin**, such as pin 9 on the Arduino ([SparkFun hobby servo tutorial](https://learn.sparkfun.com/tutorials/hobby-servo-tutorial)). |

The SG90 micro servo used in this lesson operates from **4.8–6 V** ([SG90 datasheet](https://components101.com/sites/default/files/component_datasheet/SG90%20Servo%20Motor%20Datasheet.pdf)).  Servos can draw significant current when moving or stalled, so if you see brownouts or jitter, use a separate 5 V supply and connect the grounds together ([SparkFun hobby servo tutorial](https://learn.sparkfun.com/tutorials/hobby-servo-tutorial)).

### Wiring the servo

1. Plug the servo’s red wire into the Arduino’s 5 V.  If you are using an external supply, connect it to the servo’s red wire instead.
2. Connect the brown or black wire to the Arduino GND and to the ground of any external supply.
3. Connect the orange or yellow control wire to **digital pin 9** on your Arduino.
4. If you are using an external supply, do **not** forget to tie the grounds together, or the servo will not respond.

> **Power caution:** The servo’s power wire should **never** be connected to a digital I/O pin, the 3.3 V pin, or the VIN pin on the Arduino.  Use only the 5 V pin or an appropriate external 5 V supply.  Digital pins cannot supply the required current and using an incorrect voltage can damage the servo or the board.

## 3 – Sweeping the servo

We will start with a simple example that sweeps the servo back and forth.  The Arduino IDE includes a built‑in example called **Servo → Sweep**.  It uses the `Servo` library to generate the control pulses ([Arduino Sweep example](https://docs.arduino.cc/built-in-examples/servo/Sweep)).

```cpp
#include <Servo.h>

int servoPin = 9;      // control pin
Servo servo;           // create servo object
int angle = 0;         // servo position in degrees

void setup() {
  servo.attach(servoPin);  // attach the servo
}

void loop() {
  // sweep from 0 to 180 degrees
  for (angle = 0; angle < 180; angle++) {
    servo.write(angle);
    delay(15);             // small delay for smooth motion
  }
  // sweep back
  for (angle = 180; angle > 0; angle--) {
    servo.write(angle);
    delay(15);
  }
}
```

Upload this sketch and observe the servo horn sweeping across its range.  The 15‑ms delay gives the servo time to move; you can adjust it to speed up or slow down the sweep.  If the horn doesn’t move the full 180°, your particular servo’s pulse‑width range may be narrower – see the calibration section below.

### Troubleshooting

If the servo jitters or chatters, check the wiring: the ground must be common between Arduino and servo.  If the servo stalls or resets the Arduino when starting, power it from an external supply or add a large decoupling capacitor (e.g. 470 µF) across the servo’s power pins.

## 4 – Controlling a servo with a potentiometer

To make the servo respond to user input, connect a 10 kΩ potentiometer as a voltage divider.  Wire one end of the pot to 5 V, the other to GND, and the middle (wiper) pin to **A0**.  This configuration gives a 0–5 V analog voltage proportional to the knob’s position.  The sketch below reads the analog value, maps it to 0–180° and writes it to the servo:

```cpp
#include <Servo.h>

Servo servo;
const int servoPin = 9;
const int potPin = A0;

void setup() {
  servo.attach(servoPin);
}

void loop() {
  int sensorValue = analogRead(potPin);   // read 0–1023
  int angle = map(sensorValue, 0, 1023, 0, 180);
  servo.write(angle);
  delay(10);
}
```

Turn the potentiometer knob and watch the servo follow.  Because `map()` scales the 10‑bit analog reading to the 0–180 range, this code will work with any servo library range provided your servo can physically rotate that far.

### Extending the idea

You can replace the potentiometer input with any sensor: a light sensor from Day 6 could set the servo angle based on ambient light, or a distance sensor from Day 9 could point the servo at an object.  Combine this with the motion‑detection code from Day 8 to create a simple automatic door opener that swings open when someone approaches.

## 5 – Understanding pulse widths and calibration

The Arduino `Servo` library translates angles to pulse widths for you, but it assumes the servo accepts 1 ms to 2 ms pulses around a neutral 1.5 ms ([Pololu servo control interface](https://www.pololu.com/blog/17/servo-control-interface-in-detail)).  In reality, servos vary: the neutral pulse might not be exactly in the centre of the mechanical range, and the total usable width can differ.  Sending pulses beyond the physical limits can cause the gears to jam or strip.  If your servo cannot reach 0° or 180° with the standard mapping, you can adjust the minimum and maximum pulse widths in your code:

```cpp
servo.attach(servoPin, 500, 2500);  // pulses from 0.5 ms to 2.5 ms
```

This example allows a wider range, but you should calibrate by experimentation.  Always avoid hitting the mechanical stops and never force the servo by hand – rotate the horn gently by hand only when it is unpowered.

## 6 – Mini project: automated pet feeder gate

Combine your servo knowledge with earlier lessons to build a simple automated gate.  Mount a small gate or flap on the servo horn.  Use the photoresistor circuit from Day 6 or the ultrasonic sensor from Day 9 to detect when your pet approaches.  When the sensor triggers, sweep the servo to open the gate for a few seconds, then return it to the closed position.  Add a button to arm/disarm the system using the state‑change detection pattern from Day 7.  This project demonstrates integrating sensors, inputs and outputs into one cohesive system.

### Steps

1. Wire the servo to digital pin 9 and power as described above.
2. Connect the ultrasonic sensor and configure it to detect your pet within a set distance.
3. Write code that reads the sensor; when the distance is below the threshold and the system is armed, call `servo.write(openAngle)`; after a delay, call `servo.write(closedAngle)`.
4. Use a button (pull‑down wiring from Day 3) to toggle the armed state; provide feedback via the buzzer or LED.

This mini project ties together analog input, digital input, timing and actuation in a tangible way.

## 7 – Additional resources

* **Arduino Servo library documentation** – Official reference for `Servo.attach()`, `write()` and `writeMicroseconds()` functions.
* **Last Minute Engineers servo tutorial** – A comprehensive guide on servo internals, pinout and wiring.
* **Pololu servo control interface** – In‑depth explanation of pulse widths, neutral positions, and why 50 Hz pulses are used.
* **DroneBot Workshop video** – A video tutorial that walks through connecting servos and writing code.  Watch from 2:00 to 5:00 minutes to see a live wiring demonstration.

## Summary

Servo motors give you precise control over rotation and are an essential building block for robotics.  Internally they combine a DC motor, gears, a potentiometer and a control circuit, allowing them to hold a commanded position using a closed‑loop feedback system.  They accept high‑level commands in the form of pulse widths; a typical servo expects pulses around **1 ms to 2 ms** every **20 ms**.  The SG90 servo in your kit uses a standard three‑pin connector: red for 5 V, black/brown for ground and orange/yellow for the control signal.  It draws only a few milliamps when idle but up to 250 mA when moving, so larger servos may require an external power supply.  Using the Arduino `Servo` library, you can sweep the servo across its range and map sensor input to an angle.  For servos with non‑standard ranges, adjust the minimum and maximum pulse widths accordingly.  By combining a servo with sensors from previous lessons, you can create responsive, interactive mechanisms such as an automated pet feeder gate.  Practice and calibration will help you master servo control and prepare you for more complex robotics projects.
