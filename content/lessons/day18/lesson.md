# Day 18 – Accelerometer and Tilt Sensing

## Learning Objectives

By the end of this lesson you will:

1. Understand how a MEMS accelerometer measures acceleration and how it can be used to detect tilt and movement.
2. Identify the key specifications of the ADXL345 accelerometer—supply voltage, measurement ranges, resolution and interface options.
3. Wire the ADXL345 to your Arduino using the I2C interface and know why level shifting may be required.
4. Read raw acceleration values from the sensor and convert them to g‑forces and tilt angles.
5. Create interactive projects that respond to motion, such as a digital spirit level or tilt‑activated alarm.

## Introduction to accelerometers

An **accelerometer** is a sensor that measures acceleration along one or more axes.  MEMS (micro‑electromechanical systems) accelerometers contain tiny capacitive structures that deflect under acceleration.  In addition to measuring dynamic acceleration (motion, vibration), they can measure **static acceleration** due to gravity, which allows them to infer tilt angle.  Accelerometers are used in smartphones to rotate the screen, in hard drives to detect falls, and in gaming controllers to sense motion.

The **ADXL345** is a popular 3‑axis digital accelerometer.  It offers high resolution and configurable ranges, making it ideal for hobby projects.  According to the SparkFun Hookup Guide, the ADXL345 is “a small, thin, low power, 3‑axis MEMS accelerometer” that provides **high‑resolution (13‑bit) measurements** at up to **±16 g**【775380886381479†L160-L187】.  The module can communicate over either **I²C or SPI** digital interfaces【775380886381479†L160-L183】.

### Key specifications

From the Cirkit Designer documentation, the ADXL345’s important parameters are【478834150142700†L153-L162】:

| Parameter | Value | Notes |
| --- | --- | --- |
| **Supply voltage** | 2.0–3.6 V | The sensor is not 5 V tolerant; use the 3.3 V pin on your Arduino or a logic level converter if your board operates at 5 V【775380886381479†L267-L270】. |
| **Interface** | I²C or SPI | Digital communication only; I²C is simpler for this lesson. |
| **Measurement ranges** | ±2 g, ±4 g, ±8 g, ±16 g | Configurable via registers【478834150142700†L153-L162】.  Default range is ±2 g. |
| **Resolution** | 13 bit, 4 mg/LSB | High resolution enables measurement of small tilt angles【478834150142700†L153-L162】. |
| **Bandwidth / Output data rate** | 0.1 Hz – 3.2 kHz | Adjustable to trade off noise versus responsiveness【478834150142700†L153-L162】. |

In addition to basic acceleration measurement, the ADXL345 includes features like **single‑tap and double‑tap detection, activity/inactivity sensing and free‑fall detection**【775380886381479†L172-L180】.  These advanced functions can trigger interrupts but are beyond the scope of this introductory lesson.

## Materials

| Item | Purpose |
| --- | --- |
| ADXL345 accelerometer module | Measures acceleration along X, Y and Z axes |
| Arduino Uno (or other AVR‑based board) | Host microcontroller |
| Breadboard and jumper wires | Connects the module to the Arduino |
| **Power considerations** | The ADXL345 must be powered at 3.3 V.  If your board only supplies 5 V, use the Arduino’s 3.3 V pin.  Some breakout boards include a regulator and level shifting; check your module’s documentation. |
| Optional 4.7 kΩ pull‑up resistors | Provide stronger pull‑ups on the I²C lines if your breakout board doesn’t include them【775380886381479†L283-L288】. |
| Optional logic level converter | Required when driving the I²C lines from 5 V logic (e.g., an Uno) if your breakout lacks on‑board level shifting【775380886381479†L267-L270】. |

## Wiring the ADXL345 (I²C)

The ADXL345 uses either I²C or SPI.  I²C is easier to wire because it uses only two data lines plus power and ground.  According to Adafruit’s assembly guide, the ADXL345 has an I²C address of **0x53** and requires just four connections【217046862439166†L190-L197】:

1. **GND → GND** – Connect the module’s ground pin to the Arduino ground.
2. **VIN → 3.3 V** – Power the module from the Arduino’s 3.3 V pin (do **not** use 5 V).  Some breakout boards have a regulator and can accept 5 V, but check your board’s markings.
3. **SDA → SDA** – Connect the SDA pin of the accelerometer to the Arduino’s SDA line.  On an Uno this is **analog pin A4**; on a Mega use pin 20 (SDA)【775380886381479†L289-L317】.
4. **SCL → SCL** – Connect the SCL pin of the accelerometer to the Arduino’s SCL line.  On an Uno this is **analog pin A5**; on a Mega use pin 21 (SCL)【775380886381479†L289-L317】.

Tie **CS** (chip select) to **3.3 V** and **SDO** to **GND** to enable I²C mode【775380886381479†L292-L299】.  If your breakout board has built‑in level shifting, the SDO pin may be labeled “ADDR” or “SDO” and determines the least significant bit of the I²C address (0x53 when low, 0x1D when high).  For simplicity we will leave it low (ground).

If you are using a 5 V Arduino and your breakout does not include level shifting, add a small **logic level converter** or resistor divider between the Arduino’s SDA/SCL lines and the sensor to avoid damaging the 3.3 V device【775380886381479†L267-L270】.  Some breakout boards include built‑in 4.7 kΩ pull‑ups on SDA and SCL; otherwise, connect external 4.7 kΩ resistors from SDA and SCL to 3.3 V【775380886381479†L283-L288】.

### Double‑check your connections

Before powering up, verify that all wires are securely inserted into the breadboard.  Loose wires can cause intermittent readings【775380886381479†L231-L234】.

## Reading acceleration data

### Using the Adafruit ADXL345 library

The easiest way to get started is with a library.  The Cirkit Designer example code demonstrates how to initialise the ADXL345 and read acceleration values using the `Adafruit_ADXL345` (or similar) library【478834150142700†L239-L272】.  First install the library via the Arduino Library Manager (search for “Adafruit ADXL345”).  Then upload this sketch:

```cpp
#include <Wire.h>
#include <Adafruit_ADXL345_U.h>

Adafruit_ADXL345_Unified accel = Adafruit_ADXL345_Unified(12345);

void setup() {
  Serial.begin(9600);
  // Initialise the sensor
  if (!accel.begin()) {
    Serial.println("No ADXL345 detected. Check wiring!");
    while (1);
  }
  // Set range to ±4 g for improved resolution (other options: 2G, 8G, 16G)
  accel.setRange(ADXL345_RANGE_4_G);
  Serial.println("ADXL345 initialised.");
}

void loop() {
  sensors_event_t event;
  accel.getEvent(&event);
  // Values are provided in m/s^2; convert to g by dividing by 9.80665
  float xG = event.acceleration.x / 9.80665;
  float yG = event.acceleration.y / 9.80665;
  float zG = event.acceleration.z / 9.80665;
  Serial.print("X: "); Serial.print(xG, 3);
  Serial.print(" g\tY: "); Serial.print(yG, 3);
  Serial.print(" g\tZ: "); Serial.print(zG, 3);
  Serial.println(" g");
  delay(100);
}
```

This program initialises the sensor, sets the measurement range to ±4 g (a good compromise between resolution and headroom), reads acceleration values at 10 Hz and converts them from metres per second squared to **g**.  The `sensors_event_t` structure is part of the Adafruit Unified Sensor system and simplifies sensor data handling.

### Calculating tilt angles

Static acceleration from gravity can be used to compute tilt.  When the sensor is level, you will read about +1 g on the Z‑axis and 0 g on X and Y.  To calculate the **pitch** and **roll** (rotation around the X‑ and Y‑axes, respectively), you can use trigonometric relationships:

```cpp
// assuming xG, yG, zG are acceleration values in g (see above)
float pitch = atan2(-xG, sqrt(yG * yG + zG * zG)) * 180 / PI;
float roll  = atan2( yG, zG) * 180 / PI;
```

**Pitch** represents the rotation around the Y‑axis (positive when tilting forward) and **roll** represents rotation around the X‑axis (positive when tilting right).  As you tilt the board, observe how the pitch and roll angles change.  Because these calculations assume only static acceleration, they may be inaccurate if the sensor is moving rapidly or subjected to vibration.

### Using the sensor without a library

If you prefer to avoid external libraries, you can communicate with the ADXL345 directly over I²C using the `Wire` library.  You’ll need to write configuration bytes to set the device into **measurement mode** and read six registers to get raw acceleration data.  This approach is more advanced; refer to the datasheet for register addresses and bit descriptions, or use the SparkFun ADXL345 library as a guide【775380886381479†L317-L326】.

## Activity – Build a digital spirit level

In this project you will turn your accelerometer into a **bubble level** that shows how level the board is in two axes.

### Circuit

Use the I²C wiring from earlier.  Add two LEDs (e.g., green and red) connected to digital pins 5 and 6 through 220 Ω resistors.  These LEDs will indicate tilt direction.

### Sketch

```cpp
#include <Wire.h>
#include <Adafruit_ADXL345_U.h>

Adafruit_ADXL345_Unified accel = Adafruit_ADXL345_Unified(12345);

const int leftLed  = 5;
const int rightLed = 6;

void setup() {
  pinMode(leftLed, OUTPUT);
  pinMode(rightLed, OUTPUT);
  Serial.begin(9600);
  if (!accel.begin()) {
    Serial.println("No accelerometer detected");
    while (1);
  }
  accel.setRange(ADXL345_RANGE_2_G);
}

void loop() {
  sensors_event_t event;
  accel.getEvent(&event);
  float xG = event.acceleration.x / 9.80665;
  // Turn on LEDs based on the sign of x‑axis acceleration
  if (xG > 0.05) { // board tilted to the right
    digitalWrite(rightLed, HIGH);
    digitalWrite(leftLed, LOW);
  } else if (xG < -0.05) { // board tilted to the left
    digitalWrite(leftLed, HIGH);
    digitalWrite(rightLed, LOW);
  } else {
    // approximately level
    digitalWrite(leftLed, LOW);
    digitalWrite(rightLed, LOW);
  }
  delay(50);
}
```

This sketch lights up the right LED when the board tilts to the right (positive X‑axis), the left LED when it tilts left (negative X), and turns both off when the board is level.  Try adjusting the threshold (0.05 g) to make it more or less sensitive.

### Extension ideas

- **Graph the tilt**: Use the Serial Plotter (Tools → Serial Plotter in the Arduino IDE) to display the X‑ and Y‑axis acceleration over time.  Visualising the data helps you understand how motion affects acceleration.
- **Servo control**: Combine Day 12’s servo lesson with the accelerometer by mapping the roll angle to a servo’s position.  Tilting the board moves the servo.
- **Shock detector**: Use the Z‑axis acceleration to detect sudden impacts.  If |Z| exceeds 1.5 g, turn on a buzzer or flash an LED.
- **Step counter**: With more advanced programming, you can detect periodic peaks in acceleration to count steps (a simplified pedometer).  This requires filtering and thresholding the data.

## Troubleshooting

| Symptom | Possible cause | Solution |
| --- | --- | --- |
| All axes read 0 | Sensor not powered or miswired | Verify 3.3 V power, ground, SDA to A4, SCL to A5 and CS tied high【217046862439166†L190-L197】 |
| Values saturated (±16 g constant reading) | Measurement range too low or sensor not configured | Ensure the range is set appropriately (2 g for tilt, higher for strong motion); call `accel.setRange()` after `begin()` |
| Values noisy | Loose wires or breadboard connections【775380886381479†L231-L234】 | Re‑seat jumper wires and consider using twisted leads or shielding |
| No sensor detected | Wrong I²C address or level shifting issue | Confirm SDO/ADDR pin is tied low (address 0x53).  If using 5 V logic, add a level shifter or use the board’s 3.3 V pin【775380886381479†L267-L270】 |

## Additional resources

- **SparkFun ADXL345 Hookup Guide:** Provides a detailed hardware overview, pin descriptions and notes on logic level requirements【775380886381479†L160-L299】.
- **Cirkit Designer component documentation:** Summarises technical specifications (power supply, ranges, resolution, pin functions) and includes example Arduino code【478834150142700†L153-L174】【478834150142700†L239-L272】.
- **Adafruit ADXL345 assembly guide:** Explains the simple four‑wire I²C connection and states that the I²C address is 0x53【217046862439166†L190-L197】.

## Summary

Accelerometers like the ADXL345 open up new possibilities for your Arduino projects by providing insight into motion and orientation.  The ADXL345 offers configurable ranges of ±2 g to ±16 g and high 13‑bit resolution【478834150142700†L153-L162】.  By powering it at 3.3 V and connecting it via I²C (VIN→3.3 V, GND→GND, SDA→A4, SCL→A5)【217046862439166†L190-L197】, you can read acceleration along three axes and derive tilt angles.  Libraries like Adafruit’s ADXL345 simplify configuration and reading, while calculating pitch and roll using trigonometry allows you to build tilt‑sensitive interfaces.  Experiment with the sensor to create digital levels, shock alarms and motion‑controlled servos, and always double‑check your wiring to ensure reliable data.