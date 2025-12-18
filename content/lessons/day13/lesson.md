# Day 13 – DC Motors & L293D Driver

## Learning objectives

By the end of today’s lesson you should be able to:

1. **Explain how a brushed DC motor works** and why its speed is proportional to the applied voltage【242868637693544†L268-L274】.  
2. **Use PWM to control motor speed** and understand why duty cycle affects the average voltage delivered to the motor【242868637693544†L268-L274】.  
3. **Describe the purpose of an H‑bridge** and why you need a motor driver instead of driving a motor directly from an Arduino pin【613704194224275†L86-L97】.  
4. **Wire and program the L293D IC** to control the direction and speed of a small DC motor safely【613704194224275†L178-L200】.  
5. **Build a simple project** that integrates motor control with sensors and inputs from previous lessons.

## Introduction

Today we move from *position‑controlled* servos to **continuously rotating DC motors**. A brushed DC motor has just two wires – apply a voltage and it spins; reverse the polarity and it spins the other way【242868637693544†L150-L160】. The speed of a DC motor is **proportional to the supplied voltage**. If the voltage drops too far, the motor won’t get enough power to turn, but within a certain range (roughly half of its rated voltage) the motor will run at varying speeds【242868637693544†L268-L274】. Rather than varying the supply voltage directly, we’ll use **pulse‑width modulation (PWM)** to simulate different average voltages by turning the power on and off very quickly【242868637693544†L268-L274】.

A spinning motor can also act as a generator. When you disconnect the power, the collapsing magnetic field induces a current in the windings. This **back‑EMF** flows in the opposite direction and can damage other components. The standard remedy is to place a **flyback diode** across the motor’s terminals so that the reverse current has a safe path【242868637693544†L78-L91】. Integrated motor drivers include these diodes so you don’t have to add them separately.

## Why not drive a motor directly from an Arduino?

Small Arduino pins can source or sink around 20 mA of current. Even tiny hobby motors draw more than that when starting and under load; a typical 6 V gearmotor can draw 190 mA under no load and up to 250 mA when stalled【242868637693544†L190-L193】. Connecting a motor directly to a microcontroller risks **overloading and damaging the I/O pin**【613704194224275†L86-L97】. A motor driver like the **L293D** acts as a current amplifier: it takes low‑current control signals from the Arduino and provides the higher current and voltage that the motor needs【613704194224275†L163-L167】.

## The L293D motor driver

The L293D is a dual H‑bridge IC designed for driving two DC motors, relays or one bipolar stepper. It contains **two independent H‑bridge circuits**【613704194224275†L171-L174】, can handle motor supply voltages from **4.5 V to 36 V** and delivers up to **600 mA continuous current** per channel (with peaks up to 1.2 A)【613704194224275†L178-L186】. The chip includes **built‑in flyback diodes** to safely dissipate back‑EMF【613704194224275†L188-L200】 and **thermal shutdown** protection【613704194224275†L202-L208】.

### Pin breakdown and wiring

- **VSS (VCC1)** – supplies logic circuitry; connect to 5 V from your Arduino【613704194224275†L237-L239】.  
- **VS (VCC2)** – supplies the motors; connect to the motor supply voltage (4.5–36 V depending on your motor)【613704194224275†L240-L241】. For simple projects a 5 V rail is sufficient if your motor is rated accordingly.  
- **GND** – four ground pins; connect all to the common ground shared by the Arduino and motor power supply【613704194224275†L243-L255】.  
- **IN1/IN2 / IN3/IN4** – direction control pins; setting one high and the other low makes the motor spin forward or backward【613704194224275†L272-L286】.  
- **ENA/ENB** – enable pins; pulling high enables the corresponding motor and letting you modulate its speed with a PWM signal【613704194224275†L288-L303】.  
- **OUT1–OUT4** – connect to the motor’s two leads. Motor A uses OUT1/OUT2 and Motor B uses OUT3/OUT4【613704194224275†L263-L266】.

#### Recommended wiring for a single motor

| L293D pin | Connects to | Purpose |
|---|---|---|
| VSS (pin 16) | 5 V (Arduino) | Power the chip’s logic【613704194224275†L237-L239】 |
| VS (pin 8) | Motor supply (e.g. 5 V) | Power the motor【613704194224275†L240-L241】 |
| GND (pins 4, 5, 12, 13) | Common ground | Shared ground for Arduino and motor supply【613704194224275†L243-L255】 |
| ENA (pin 1) | PWM pin (Arduino 9) | Speed control for Motor A【613704194224275†L288-L303】 |
| IN1 (pin 2) | Digital pin (Arduino 8) | Direction control – sets one side of the H‑bridge【613704194224275†L272-L279】 |
| IN2 (pin 7) | Digital pin (Arduino 7) | Direction control – sets the other side【613704194224275†L272-L279】 |
| OUT1 (pin 3) | Motor wire A | Connect to one motor lead【613704194224275†L263-L266】 |
| OUT2 (pin 6) | Motor wire B | Connect to the other motor lead【613704194224275†L263-L266】 |

**Important:** connect your Arduino ground to the L293D ground *and* the ground of your external motor supply【613704194224275†L323-L326】. Without a common reference the control signals will not be interpreted correctly.

### DC motor control logic

An **H‑bridge** uses four electronic switches arranged in an “H” around the motor. By closing different pairs of switches you can make current flow through the motor forward, backward or not at all【613704194224275†L116-L129】. The L293D provides these switches internally. Here’s how the logic works for motor A:

| IN1 | IN2 | ENA | Motor behaviour【613704194224275†L278-L286】 |
|---|---|---|---|
| 0 | 0 | X | Motor stopped |
| 1 | 0 | 1 | Spins forward |
| 0 | 1 | 1 | Spins backward |
| 1 | 1 | X | Motor stopped |

To vary the speed, send a **PWM signal** to ENA: a higher duty cycle means the motor is enabled for more of each period, so it spins faster. At lower duty cycles the motor may hum and hesitate【613704194224275†L458-L463】. Try not to use duty cycles below ~10 % to avoid stalling.

### Example: variable‑speed cooling fan

In this exercise you’ll build a simple variable‑speed fan using a DC motor. You’ll control speed with a potentiometer and direction with a pushbutton. The circuit also illustrates how to use external power.

#### Materials

- 1× DC motor rated for 5 V (e.g. toy gearmotor).  
- 1× L293D motor driver IC.  
- 1× 10 kΩ potentiometer (for speed control).  
- 1× Momentary pushbutton with pull‑down resistor (for direction).  
- External 5 V power source (e.g. battery pack).  
- Breadboard, jumper wires, Arduino Uno.

#### Wiring steps

1. **Insert the L293D** into the breadboard so that each side of the IC straddles the central gap.
2. **Power the logic**: connect VSS (pin 16) to the Arduino’s 5 V pin and ground (pins 4/5/12/13) to Arduino GND.
3. **Power the motor**: connect VS (pin 8) to your external 5 V supply. Connect the external supply’s ground to the Arduino’s ground and the L293D GND pins【613704194224275†L323-L326】.
4. **Motor connections**: connect your motor leads to OUT1 (pin 3) and OUT2 (pin 6).
5. **Control pins**: connect ENA (pin 1) to Arduino PWM pin 9; IN1 (pin 2) to digital pin 8; IN2 (pin 7) to digital pin 7.
6. **Potentiometer**: connect one outer leg to 5 V, the other outer leg to GND, and the middle leg to analog pin A0.
7. **Button**: connect one side of the button to 5 V; connect the other side to digital pin 3 and via a 10 kΩ resistor to ground (pull‑down). Refer back to Day 3 for pull‑down resistor wiring.

#### Sketch: speed & direction control

```cpp
// DC Motor control with potentiometer and button
const int enA = 9;    // PWM pin for motor speed
const int in1 = 8;    // direction pin 1
const int in2 = 7;    // direction pin 2
const int potPin = A0; // potentiometer
const int buttonPin = 3; // direction toggle button

int direction = 0; // 0 = forward, 1 = backward
int lastButtonState = LOW;

void setup() {
  pinMode(enA, OUTPUT);
  pinMode(in1, OUTPUT);
  pinMode(in2, OUTPUT);
  pinMode(buttonPin, INPUT);
  // ensure motor is off at start
  digitalWrite(in1, LOW);
  digitalWrite(in2, LOW);
}

void loop() {
  // read the potentiometer and scale 0–1023 to 0–255
  int potValue = analogRead(potPin);
  int speed = map(potValue, 0, 1023, 0, 255);
  analogWrite(enA, speed);

  // read button and detect rising edge
  int buttonState = digitalRead(buttonPin);
  if (buttonState == HIGH && lastButtonState == LOW) {
    direction = !direction; // toggle direction
  }
  lastButtonState = buttonState;

  // set motor direction
  if (direction == 0) {
    digitalWrite(in1, HIGH);
    digitalWrite(in2, LOW);
  } else {
    digitalWrite(in1, LOW);
    digitalWrite(in2, HIGH);
  }
}
```

**How it works:** The potentiometer’s analog reading is mapped to a PWM value (0–255) and sent to the enable pin to control speed. A button toggles a `direction` variable. When `direction` is `0`, IN1 is high and IN2 low so the motor spins forward; when `direction` is `1` the signals are reversed and the motor spins backward【613704194224275†L272-L286】. Debouncing is not essential here because direction changes are infrequent, but you can reuse the software debouncing technique from Day 3.

### Experiment: ultrasonically controlled motor

Using what you learned on Day 9, try adding the HC‑SR04 ultrasonic sensor to create a “distance‑controlled fan.” Map the distance measurements (2 cm to 100 cm) to the motor’s speed. For example, the closer your hand is to the sensor, the faster the motor spins. Remember to adjust the mapping range so that speeds aren’t too low to start the motor【613704194224275†L458-L463】.

### Troubleshooting and safety

* **Motor doesn’t spin:** check the motor’s rated voltage and ensure VS is supplying enough power. Make sure all grounds are connected.  
* **Motor only moves in one direction:** verify the logic on IN1/IN2 and ensure you toggle them correctly.  
* **Arduino resets or behaves erratically:** you may be drawing too much current. Use a separate power supply for the motor and consider adding a 100 µF electrolytic capacitor across the motor terminals to smooth voltage dips.  
* **Heating IC:** the L293D includes thermal shutdown【613704194224275†L202-L208】. If it overheats, reduce the load or add a heatsink.  
* **Noise or humming:** At very low PWM duty cycles the motor may hum or not start【613704194224275†L458-L463】. Increase the duty cycle or add a ramp to the speed control.

### Extension project

Build a simple **two‑wheel robot chassis** using two DC motors and the L293D. Write code to steer forward, reverse and turn by controlling the two motors independently. Integrate sensors like the ultrasonic sensor for obstacle avoidance or the PIR sensor for motion activation. This project will prepare you for the full robot challenge later in the course.

## Summary

Brushed DC motors provide continuous rotation but require more current than a microcontroller can supply. The speed of a DC motor is proportional to the applied voltage【242868637693544†L268-L274】, and we use PWM to simulate variable voltage levels. Reversing the polarity reverses the motor’s direction【242868637693544†L150-L160】. The L293D motor driver contains two H‑bridges, built‑in flyback diodes and thermal protection【613704194224275†L171-L200】. By wiring the control, enable and power pins correctly and using PWM and logic signals, you can safely drive one or two DC motors with an Arduino. Today’s project used a potentiometer and button to control speed and direction, but the same principles apply to more complex robots and machines.
