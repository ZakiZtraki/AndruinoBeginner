# Day 14 – Stepper Motors and Precision Motion

## Learning objectives

By completing today’s lesson you will:

1. **Understand how stepper motors work**, including the difference between unipolar and bipolar types and how they move in discrete steps rather than continuous rotation【470139988739117†L104-L127】.  
2. **Identify the 28BYJ‑48 stepper motor** and its key specifications: 5‑wire unipolar configuration, 5 V operating voltage, 32 internal steps and a 64∶1 gearbox resulting in 2048 steps per output revolution【470139988739117†L171-L180】.  
3. **Explain why stepper motors require a driver** and why the L293D is suitable for small steppers that draw up to 600 mA per phase【613704194224275†L178-L186】.  
4. **Wire a stepper motor to an L293D and Arduino**, including identifying coil wires and understanding how to leave the common wire unconnected【169329941709969†L116-L126】.  
5. **Program the motor using the Arduino Stepper library** and experiment with speed, direction and number of steps【169329941709969†L161-L199】.  
6. **Design a simple positioning project**, integrating sensors or user input to move the motor precisely.

## Introduction

Stepper motors occupy the middle ground between servo motors and regular DC motors. Like DC motors, steppers are **brushless** and can spin continuously, but like servos they can also move in **precise increments** for accurate positioning tasks【470139988739117†L89-L127】. They do this by energizing electromagnetic coils in sequence so that the rotor aligns to each new magnetic field. A stepper’s **step angle** is the fixed rotation produced by each coil energization. By counting pulses, you know exactly how far the shaft has rotated.

In contrast to DC motors, which can be driven by simply changing voltage and polarity, steppers require **multiple coils** to be driven in a specific pattern. This means they always need a **motor driver**: you cannot attach them directly to an Arduino I/O pin because each coil can draw hundreds of milliamps【470139988739117†L195-L203】. Drivers like the L293D or ULN2003 contain multiple high‑current transistors and flyback diodes to handle the inductive load and provide the correct sequence.

### Unipolar vs bipolar steppers

A **unipolar** stepper has four coils with a common center tap (five or six wires). Energizing the coil from the center to either end makes current flow in one direction. To reverse the magnetic field you energize the coil on the other side of the center, so you never have to reverse the current through a coil. The 28BYJ‑48 is a unipolar stepper with five wires【470139988739117†L160-L166】. You will not use the red center wire when driving it with an H‑bridge driver; instead you treat it like a bipolar motor by energizing one side of each coil at a time【169329941709969†L99-L112】.

A **bipolar** stepper has two coils without a center tap (four wires). To reverse the magnetic field, the driver must reverse the current through the coil. Bipolar motors generally provide more torque per weight but require an H‑bridge driver for each coil.

### The 28BYJ‑48 stepper motor

The **28BYJ‑48** is a low‑cost unipolar stepper rated at 5 V. Inside the motor there are 32 steps per internal rotation. A **64∶1 gear reduction** slows the output shaft and increases torque, so the shaft must rotate 2048 steps to complete one full revolution【470139988739117†L171-L180】. Because of the gearbox, the motor turns slowly (about 15 RPM) but can move lightweight loads precisely. Each coil draws about **240 mA** and continues to draw current even when holding position【470139988739117†L195-L203】, so a driver is essential.

## Driving a stepper motor with the L293D

We will reuse the **L293D** dual H‑bridge chip from Day 13 to drive our stepper. Each H‑bridge drives one coil, so by using both bridges we can control a unipolar stepper like a bipolar motor. The L293D can handle motor supply voltages of 4.5–36 V and up to 600 mA per channel【613704194224275†L178-L186】, which is suitable for the 28BYJ‑48.

### Identifying coil wires

Before wiring the motor, identify its coils. For the 28BYJ‑48, the wires are colour coded: **A+ (orange)**, **A– (pink)**, **B– (yellow)** and **B+ (blue)**【169329941709969†L99-L126】. The red wire is the common center tap and is not used with an H‑bridge driver. Connect the wires as follows:

| 28BYJ‑48 wire | L293D output pin | Notes |
|---|---|---|
| A+ (orange) | OUT4 | Coil A positive【169329941709969†L99-L126】 |
| A– (pink) | OUT3 | Coil A negative |
| B– (yellow) | OUT2 | Coil B negative |
| B+ (blue) | OUT1 | Coil B positive |
| Red (common) | *Not connected* | Leave floating when using H‑bridge |

Next, connect VCC1 and VCC2 pins of the L293D to 5 V and connect all ground pins to the common ground (Arduino and motor supply)【613704194224275†L237-L255】. Keep ENA and ENB pins tied high (5 V) so the outputs are always enabled【169329941709969†L116-L120】. Connect IN1–IN4 to four Arduino digital pins (e.g. pins 12, 11, 10, 9)【169329941709969†L122-L126】.

### Understanding step sequences

To make the motor move, you energize the coils in a specific sequence. In **full‑step mode**, you energize one coil at a time: A+, B+, A–, B–. In **wave‑drive mode**, you energize two coils simultaneously for more torque. The Arduino **Stepper** library handles these sequences for you, but it helps to understand the basics:

| Step index | IN1 (A+) | IN2 (A–) | IN3 (B–) | IN4 (B+) |
|---|---|---|---|---|
| 1 | HIGH | LOW | LOW | LOW |
| 2 | LOW | LOW | LOW | HIGH |
| 3 | LOW | HIGH | LOW | LOW |
| 4 | LOW | LOW | HIGH | LOW |

Repeating this sequence causes the motor to rotate. Reversing the order causes reverse rotation. Increasing the pulse frequency increases the speed【169329941709969†L90-L92】.

## Building and testing the circuit

#### Materials

- 1× 28BYJ‑48 stepper motor (or similar 5 V unipolar stepper).  
- 1× L293D motor driver IC.  
- Arduino Uno board and USB cable.  
- Breadboard and jumper wires.  
- Optional: external 5 V power supply for the motor.

#### Wiring steps

1. **Place the L293D** across the central gap of a breadboard.  
2. **Power the logic:** Connect VCC1 (pin 16) to 5 V on the Arduino. Connect all four ground pins (4, 5, 12, 13) to Arduino ground.  
3. **Power the motor:** Connect VCC2 (pin 8) to the 5 V supply. If using an external supply, connect its ground to the Arduino ground as well【613704194224275†L323-L326】.  
4. **Enable the outputs:** Tie ENA (pin 1) and ENB (pin 9) to 5 V so the outputs are enabled【169329941709969†L116-L120】.  
5. **Connect control pins:** Connect IN1–IN4 (pins 2, 7, 10, 15 on the L293D) to Arduino pins 12, 11, 10 and 9 respectively【169329941709969†L122-L126】.  
6. **Connect the motor wires:** Plug the motor wires into OUT1–OUT4 in the order shown in the table above. Leave the red wire unconnected.  
7. **Check connections:** Verify that all grounds are connected and there are no shorts.

#### Sketch: spinning a stepper

We will use the built‑in `Stepper` library to handle the coil sequencing. Set `stepsPerRevolution` to 2048 for the 28BYJ‑48 (32 internal steps × 64 gear ratio)【470139988739117†L171-L180】.

```cpp
// Stepper Motor control using L293D
#include <Stepper.h>

const int stepsPerRevolution = 2048; // 28BYJ‑48 has ~2048 steps per output revolution
// Create a Stepper instance
Stepper myStepper(stepsPerRevolution, 12, 10, 11, 9);

void setup() {
  // Set the motor speed in RPM
  myStepper.setSpeed(15);
  Serial.begin(9600);
}

void loop() {
  // rotate one revolution clockwise
  Serial.println("clockwise");
  myStepper.step(stepsPerRevolution);
  delay(500);

  // rotate one revolution counterclockwise
  Serial.println("counterclockwise");
  myStepper.step(-stepsPerRevolution);
  delay(500);
}
```

**How it works:** The `Stepper` constructor takes the number of steps per revolution and the four control pins (in order). The `setSpeed()` function sets the motor speed in RPM. Calling `step(n)` moves the motor `n` steps; a negative number moves it in the opposite direction【169329941709969†L161-L199】. Experiment with different `setSpeed()` values; if the speed is too high, the motor will miss steps.

### Experiment: precise positioning with a rotary encoder

Integrate the rotary encoder from Day 7 to create a **jog wheel**: turning the knob commands the stepper to step forward or backward a small number of steps, and pressing the encoder’s pushbutton resets the position. Use the encoder’s `CLK` and `DT` signals to detect direction and call `myStepper.step()` accordingly. This mirrors how CNC machines use handwheels for precise control.

### Experiment: ultrasonic distance pointer

Combine today’s motor with the ultrasonic sensor from Day 9 to build a simple distance gauge. Map the distance reading (2 cm–200 cm) to a range of steps (e.g. 0–1024) and call `step()` with the difference between the current and desired position. This will rotate a pointer attached to the stepper shaft to indicate distance on a circular scale.

### Troubleshooting & notes

- **Motor hums but doesn’t move:** The coil sequence may be wired incorrectly. Verify the wire order and check that ENA and ENB are tied high.  
- **Motor vibrates or misses steps:** The speed may be too high. Reduce the RPM value in `setSpeed()`. Stepper motors have a maximum step rate; exceeding it causes missed steps.  
- **Motor gets hot:** Stepper motors draw current continuously, even when holding position【470139988739117†L195-L203】. If the motor gets too warm, reduce the holding current by disconnecting power when the motor is idle or using a driver that supports current limiting.  
- **No movement:** Ensure the red common wire is not connected to anything and that all grounds are common.  
- **Power supply browning out:** A separate 5 V supply may be required for the motor. The L293D can handle up to 600 mA per channel【613704194224275†L178-L186】, but the Arduino’s 5 V regulator may not.

### Extension project

Build a **turntable** or **pan‑tilt mechanism** for a small camera or sensor. The stepper motor can precisely rotate an object by a known number of degrees. Use the Stepper library to move to preset angles (e.g. 0°, 90°, 180°, 270°) and integrate pushbuttons or sensors to trigger movements.

## Summary

Stepper motors provide precise, incremental motion by energizing coils in sequence. The 28BYJ‑48 stepper used here has 32 internal steps and a 64∶1 gear reduction, resulting in 2048 steps per output revolution【470139988739117†L171-L180】. Each step corresponds to a small angular movement and can be controlled accurately using the Arduino Stepper library. Because steppers draw significant current—even when holding position—an external driver is necessary. The L293D H‑bridge IC used in this lesson can safely supply up to 600 mA per channel and includes flyback diodes and thermal protection【613704194224275†L178-L200】. By wiring the coils to the L293D outputs, tying the enable pins high, and sequencing the inputs via Arduino pins, we can move the motor forward or backward and at controlled speeds. Today’s experiments introduced positioning via rotary encoder and sensors, preparing you for more complex motion control projects.
