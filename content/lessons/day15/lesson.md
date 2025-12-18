# Day 15 – Temperature & Humidity Sensors (DHT 11 / DHT 22)

## Learning objectives

By the end of today’s session you will be able to:

1. **Explain how the DHT family of sensors measures temperature and humidity.**  You will learn what’s inside these tiny modules and how the built‑in microcontroller converts two analog quantities into a digital data stream.
2. **Compare the DHT11 and DHT22 devices.**  We’ll look at measurement ranges, accuracies, sampling rates and power requirements so you can pick the right part for your project.
3. **Wire a DHT sensor to your Arduino and add the required pull‑up resistor and decoupling capacitor.**  Proper wiring is critical for reliable readings.
4. **Install the Adafruit DHT library and write code to read temperature, humidity and heat index.**  You will practice using `readTemperature()` and `readHumidity()` and learn how to handle the slow sampling rate.
5. **Build a practical project that reacts to environmental conditions.**  You will create a fan or vent controller that opens when humidity or temperature crosses a threshold and closes when the air dries out.

## Introduction

Environmental monitoring is a core part of smart homes, greenhouses and weather stations.  The **DHT11** and **DHT22** sensors are entry‑level devices that combine a **capacitive humidity element** and an **NTC thermistor** in one package.  Inside the plastic housing you’ll find:

* A **humidity sensing element**: two electrodes sandwiching a moisture‑absorbing polymer.  As humidity increases, ions released by the polymer change its capacitance.  The sensor measures this change and converts it into a relative‑humidity reading【860589226677594†L140-L148】.
* A **temperature sensing element**: an **NTC thermistor**, which is a resistor whose value decreases as temperature rises【860589226677594†L152-L161】.
* A small **ASIC** (application‑specific integrated circuit) that digitizes both measurements, applies calibration coefficients and outputs a serial data stream【860589226677594†L165-L170】.

Because the heavy lifting happens on board, the DHT sensors interface via a **single‑wire protocol**.  An Arduino only has to send a start pulse and then read back a 40‑bit message consisting of humidity and temperature data and a checksum【792667468081611†L165-L205】.  The sensor runs from **3–5.5 V** and consumes only a couple of milliamps during measurement【792667468081611†L267-L286】, making it ideal for battery powered projects.

### DHT11 vs DHT22

The two most common members of the family are the **DHT11** and **DHT22 (AM2302)**.  They share the same pinout and protocol but have very different specifications:

| Feature | DHT11 | DHT22 |
|--------|------|------|
| **Temperature range** | 0 – 50 °C | –40 – 80 °C |
| **Temperature accuracy** | ±2 °C | ±0.5 °C |
| **Humidity range** | 20 – 80 % RH | 0 – 100 % RH |
| **Humidity accuracy** | ±5 % RH | ±2 – 5 % RH |
| **Sampling rate** | 1 Hz (new reading every second)【860589226677594†L98-L124】 | 0.5 Hz (one reading every 2 s)【860589226677594†L98-L124】 |
| **Supply voltage** | 3 – 5.5 V | 3 – 5 V |
| **Maximum current** | 2.5 mA during measurement【860589226677594†L112-L116】 | 2.5 mA during measurement【860589226677594†L112-L116】 |

The **DHT22** covers a much wider temperature and humidity range and is more accurate, but it’s physically larger and updates only every two seconds.  The **DHT11** is cheaper, smaller and faster, but its limited range and ±5 % humidity accuracy make it less suitable for precise meteorological work【860589226677594†L98-L124】.

Figure 1 compares key specifications of both sensors.  Note how the DHT22’s larger range and smaller error values translate into taller bars for ranges and shorter bars for accuracies.

![Comparison of DHT11 vs DHT22](dht_comparison.png)

## Materials and tools

For today’s exercises you will need:

- **DHT11 or DHT22 sensor** (either the bare 4‑pin device or a breakout module)
- **Arduino Uno** (or any board compatible with the Adafruit DHT library)
- **10 kΩ pull‑up resistor** (some breakouts include this internally)
- **100 nF ceramic capacitor** for power decoupling
- **Breadboard and jumper wires**
- **Optional:** a **servo motor or DC fan**, **transistor or motor driver**, plus a **7‑segment display or LCD** for the project challenge.

### Understanding the datasheet

The manufacturer’s datasheet contains essential design notes:

* The DHT11’s recommended power supply is **3–5.5 V**, and you should **wait at least one second after power‑up** before sending any commands to allow the sensor to stabilise【792667468081611†L171-L176】.
* Use a **100 nF capacitor** between V<sub>DD</sub> and GND for filtering【792667468081611†L171-L176】 and a **5 kΩ pull‑up resistor** on the data line if your cable is longer than 20 m【792667468081611†L165-L168】.
* The minimum sampling interval is **1 s**; requesting data faster than this can cause self‑heating and unreliable readings【792667468081611†L253-L256】.

## Wiring the sensor

Both the DHT11 and DHT22 have four pins, but the third pin is unused.  Facing the sensor grille, pin 1 is on the left.  Make the following connections:

| DHT pin | Wire colour | Arduino connection | Notes |
|--------|-------------|--------------------|------|
| **Pin 1 (V<sub>CC</sub>)** | Red | 5 V (or 3.3 V) | Use 5 V for better cable distance【860589226677594†L179-L184】 |
| **Pin 2 (Data)** | Yellow/white | Digital pin (e.g. D2) | Add a **10 kΩ pull‑up resistor** between this pin and V<sub>CC</sub>【838620025234598†L178-L195】; modules often include it. |
| **Pin 3 (NC)** | – | Leave unconnected | Not used. |
| **Pin 4 (GND)** | Black | GND | Common ground with the Arduino. |

> **Tip:** When using a 3.3 V supply, keep the sensor within about **1 m** of the microcontroller to avoid voltage drop【860589226677594†L179-L184】.  With a 5 V supply you can run cables up to 20 m【860589226677594†L179-L184】.  Mount the sensor away from heat sources and direct sunlight for accurate readings【792667468081611†L319-L324】.

### Pull‑up resistor and decoupling capacitor

Why do we need a resistor?  The DHT uses an **open‑collector output**.  When idle it floats; a **10 kΩ pull‑up** holds the line high so that the sensor can pull it low when sending data.  Arduino’s internal pull‑ups (20–50 kΩ) are too weak for reliable communication【838620025234598†L189-L193】.  Similarly, the **100 nF capacitor** filters out power glitches; place it close to the sensor.

### Waiting on power‑up

After applying power, the DHT11 needs up to **one second** to stabilise【792667468081611†L171-L176】.  During this time you should not send start signals.  If you initialise the sensor in your `setup()` function and delay at least 1000 ms before the first read, you’ll avoid missed responses.

## Programming the sensor

We’ll use the **Adafruit DHT library**, which handles the single‑wire protocol and provides convenient helper functions.  Install the **DHT sensor library** and the **Adafruit Unified Sensor** library through the Arduino IDE’s Library Manager as described in the Adafruit guide【961581179449476†L167-L175】.

### Example code

Open `File → Examples → DHT sensor library → DHTtester`.  The sketch below is adapted for a DHT11 connected to digital pin 2.  To use a DHT22 instead, change `DHT11` to `DHT22` in the `#define` statement【858754573947726†L188-L195】 and increase the delay in the loop to 2000 ms.

```cpp
// Example testing sketch for DHT11 or DHT22 sensors
#include "DHT.h"

#define DHTPIN 2       // Digital pin connected to the sensor
#define DHTTYPE DHT11  // Change to DHT22 for AM2302

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  Serial.println("DHTxx test!");
  dht.begin();
  delay(1000); // allow sensor to stabilise after power-up【792667468081611†L171-L176】
}

void loop() {
  // Wait between measurements (1 s for DHT11, 2 s for DHT22)
  delay(1000);

  // Reading humidity and temperature takes ~250 ms【858754573947726†L210-L214】
  float humidity = dht.readHumidity();
  float temperatureC = dht.readTemperature();
  float temperatureF = dht.readTemperature(true);

  // Check for failed reads (NaN)
  if (isnan(humidity) || isnan(temperatureC)) {
    Serial.println(F("Failed to read from DHT sensor!"));
    return;
  }

  // Compute heat index using the library’s helper (Fahrenheit input)
  float heatIndexF = dht.computeHeatIndex(temperatureF, humidity);
  float heatIndexC = dht.computeHeatIndex(temperatureC, humidity, false);

  Serial.print(F("Humidity: "));
  Serial.print(humidity);
  Serial.print(F(" %\tTemperature: "));
  Serial.print(temperatureC);
  Serial.print(F(" °C  "));
  Serial.print(temperatureF);
  Serial.print(F(" °F\tHeat index: "));
  Serial.print(heatIndexC);
  Serial.print(F(" °C  "));
  Serial.print(heatIndexF);
  Serial.println(F(" °F"));
}
```

#### Code walkthrough

1. **Include libraries and define constants.**  `DHT.h` provides the protocol implementation.  `DHTPIN` identifies the data pin; `DHTTYPE` selects the sensor model【858754573947726†L188-L195】.
2. **Create a `DHT` object.**  The constructor takes the pin and type【858754573947726†L188-L195】.
3. **Initialise the serial port and sensor.**  Call `dht.begin()` in `setup()` and delay at least 1 s【792667468081611†L171-L176】.
4. **Wait between measurements.**  Use `delay(1000)` for DHT11 or `delay(2000)` for DHT22【858754573947726†L70-L79】.  The sensor will not update faster than its sampling rate.
5. **Read humidity and temperature.**  Use `readHumidity()` and `readTemperature(true)`; the latter returns Fahrenheit if you pass `true`【858754573947726†L213-L230】.
6. **Check for failed reads.**  If the functions return `NaN` (not‑a‑number), print an error and skip to the next loop.
7. **Compute heat index.**  The library has `computeHeatIndex()` to estimate how hot it feels given humidity and temperature.
8. **Print results.**  Format the output with labels and units for readability.

### Try it yourself

Upload the sketch, open the Serial Monitor and breathe gently on the sensor to see the humidity spike.  Note how the readings update slowly—this is normal, as the DHT11 can only provide one new reading per second and the DHT22 every two seconds【860589226677594†L120-L124】.

## Project – Smart Fan/Plant Monitor

Now that you can read environmental data, let’s build a simple **smart ventilation system**.  When humidity rises above a threshold (say **60 %**) or temperature exceeds **28 °C**, a fan or servo‑controlled vent will activate.  When the environment falls below the threshold, it will turn off.

### Circuit additions

* **Fan or vent actuator:** use a small **DC fan** driven through your L293D motor driver (from Day 13) or a **servo motor** (Day 12).  Ensure the fan is powered from a separate 5 V supply and share ground with the Arduino.
* **Transistor or motor driver:** if you use a DC fan, connect its positive lead to the motor driver’s output and the driver’s input pins to two Arduino digital pins.  Remember to include a **flyback diode** if your motor driver lacks one.
* **Threshold adjust potentiometer (optional):** connect a 10 kΩ potentiometer to an analog pin and read its value to set the humidity/temperature threshold on the fly.

### Sketch outline

You can build on the previous example by adding output control:

```cpp
const int fanPin = 9;           // digital pin controlling fan or servo
const float tempThreshold = 28; // °C
const float humThreshold  = 60; // %RH

void loop() {
  delay(1000); // adhere to sampling interval
  float humidity = dht.readHumidity();
  float temperatureC = dht.readTemperature();
  // Check for invalid readings as before...
  bool fanOn = (humidity > humThreshold) || (temperatureC > tempThreshold);
  digitalWrite(fanPin, fanOn ? HIGH : LOW);
  // Print readings and fan state (omitted for brevity)
}
```

Extend this sketch by:
* Driving a **servo** using `Servo.write()` to open/close a vent.
* Displaying readings on the 16×2 LCD from Day 16 (or 7‑segment display from Day 10).
* Logging data to the Serial plotter or an SD card.

### Reflection questions

1. How would you modify the threshold to respond to both very high humidity and very low humidity (for example, turning on a humidifier when air is too dry)?
2. What happens if you try to read the sensor faster than its sampling rate?
3. How could you calibrate the sensor to compensate for its ±5 % RH error?

## Troubleshooting

If you see `Failed to read from DHT sensor!` or `NaN` readings, try these steps:

* **Check wiring.**  Make sure the data pin, power and ground are correct and that the pull‑up resistor is connected properly【838620025234598†L178-L195】.
* **Use an adequate power supply.**  Both sensors draw up to **2.5 mA** while measuring【860589226677594†L112-L116】.  If you power your Arduino from a weak USB port, the sensor may not start.  Try powering the board from a robust 5 V supply【858754573947726†L352-L366】.
* **Wait for the sensor to stabilise.**  Delay at least **one second** after power‑up before the first read【792667468081611†L171-L176】, and respect the one‑second (DHT11) or two‑second (DHT22) sampling period【860589226677594†L98-L124】.
* **Check sensor type definition.**  Make sure you uncomment the correct `#define DHTTYPE` line for your sensor【858754573947726†L255-L264】.
* **Replace the sensor.**  Cheap DHT modules occasionally ship faulty; if all else fails, test with a second sensor【858754573947726†L352-L378】.

## Summary

Today you explored two inexpensive temperature and humidity sensors.  You learned that the **DHT11** is small and cheap but limited to **0–50 °C** and **20–80 % RH** with ±5 % accuracy【860589226677594†L98-L124】, while the **DHT22** operates from **–40 – 80 °C** and **0–100 % RH** with ±0.5 °C and ±2–5 % accuracy and updates every two seconds【860589226677594†L98-L124】.  Both sensors contain a humidity‑sensitive capacitor, an NTC thermistor and a microcontroller that outputs a digital 40‑bit message【860589226677594†L140-L170】.  Proper wiring requires a **10 kΩ pull‑up resistor**, a **100 nF decoupling capacitor**, and at least a **one‑second stabilisation delay**【792667468081611†L171-L176】.  With these precautions and the Adafruit DHT library, you can integrate environmental data into your Arduino projects and build responsive systems like smart vents, plant monitors or weather stations.