# Day 17 – EEPROM & Persistence

## Learning Objectives

By the end of this lesson you will be able to:

1. Explain what EEPROM memory is and why it is useful for storing data that must persist after power is removed.
2. Identify how many bytes of EEPROM are available on the popular AVR‑based Arduino boards and state the endurance limit of each memory cell.
3. Use the built‑in `EEPROM` library to read and write single byte values, and understand the difference between `write()` and `update()`.
4. Store more complex values (integers, floating point numbers, and structs) with `EEPROM.put()` and retrieve them with `EEPROM.get()`.
5. Design projects that make meaningful use of non‑volatile storage—for example remembering the last LED state, persisting user settings, or counting events across resets—while minimising wear on the memory cells.

## Introduction

In previous lessons you have been working with variables that live in **RAM**.  RAM is volatile, which means all of its contents disappear when the board loses power or is reset.  Sometimes you want your sketch to remember things between runs: the last brightness setting of an LED, the number of times a door has opened, or the calibration factor for a sensor.  That is where **EEPROM** (Electrically Erasable Programmable Read‑Only Memory) comes in.  EEPROM is a small section of non‑volatile memory built into many microcontrollers.  Values stored there remain intact when power is off【264402201497082†L84-L86】.  Because it is electrically erasable you can update its contents from your sketch while the microcontroller is running.

### Capacity by board

Not all Arduinos have the same amount of EEPROM.  Boards based on different AVR chips provide different capacities.  For example, boards using the ATmega328 (such as the Uno, Nano and LilyPad) have **1024 bytes** (1 KB) of EEPROM; ATmega168‑based boards have **512 bytes**; and boards using the ATmega1280 or ATmega2560 (such as the Mega) have **4096 bytes**【264402201497082†L95-L100】.  If you are unsure about your board’s capacity, consult the documentation or the hardware index.

### Endurance

Each EEPROM cell can only be erased and re‑programmed a finite number of times.  Atmel (now Microchip) specify that the AVR’s internal EEPROM can handle about **100 000 read/write cycles per location**【264402201497082†L84-L87】.  Exceeding this limit doesn’t instantly destroy the memory, but after around this many writes the data retention time decreases.  Reads are unlimited【577675601178878†L82-L85】.  Therefore you should avoid writing the same value repeatedly—one of the best ways to do this is to use `EEPROM.update()` instead of `EEPROM.write()`.

### Accessing the library

Before using any EEPROM functions, include the library at the top of your sketch:

```cpp
#include <EEPROM.h>
```

The library contains functions for reading, writing, updating and iterating through EEPROM addresses.  AVR boards do not require any initialisation; the library is ready to use as soon as you include it.

## Materials

| Item | Purpose |
| --- | --- |
| Arduino Uno (or any AVR‑based board) | Provides built‑in EEPROM |
| LED and 220 Ω resistor | Persist the LED’s state across resets |
| Pushbutton and 10 kΩ pull‑down resistor | Trigger changes to the LED state |
| Potentiometer (optional) | Allows storing and recalling an analogue setting |
| Breadboard & jumper wires | Circuit construction |

## Understanding the basic API

### Single‑byte read and write

The EEPROM library works with **addresses** and **bytes**.  An address is an integer index from 0 to `(EEPROM.length() – 1)` and refers to a single byte location.  To **write** a byte you call:

```cpp
EEPROM.write(address, value);
```

where `value` is an integer between 0 and 255.  For example, to save the number 9 in the first location you would call:

```cpp
EEPROM.write(0, 9);
```

To **read** a byte you call `EEPROM.read(address)` and it returns the stored value【264402201497082†L119-L130】.  So to retrieve the value at address 0 you write:

```cpp
int stored = EEPROM.read(0);
```

### Using `update()` to preserve endurance

Because each write consumes one of the limited erase/write cycles, avoid writing the same value repeatedly.  The function:

```cpp
EEPROM.update(address, value);
```

compares the new `value` with what is already stored and only performs the write when they differ.  The Arduino documentation notes that an EEPROM write takes about **3.3 ms** and that `update()` helps avoid unnecessary writes, extending the EEPROM’s life【613704770013087†screenshot】.  Use `update()` instead of `write()` when periodically storing values that might not have changed.

### Storing other data types

`EEPROM.write()` and `EEPROM.update()` only operate on single bytes.  To store multi‑byte types—such as 16‑bit integers, 32‑bit floats or even structures—you can use:

```cpp
EEPROM.put(address, value);
EEPROM.get(address, variable);
```

`put()` writes the binary representation of `value` starting at the specified address and returns the next free address; `get()` reads from the address into `variable`.  The functions internally call `update()` to minimise wear.  When using these functions, ensure there is enough free space after the starting address to hold the entire variable.

## Activity 1 – Persisting the last LED state

In this exercise you will build a simple circuit that remembers whether an LED was last **on** or **off**.  If you disconnect and reconnect the Arduino, it will restore the LED to the same state.

### Circuit

1. Place the LED on the breadboard with its anode connected to **digital pin 4** and its cathode through a 220 Ω resistor to ground.
2. Wire a pushbutton so that pressing it connects **digital pin 8** to 5 V.  Add a 10 kΩ resistor from the pin to ground to act as a pull‑down (see Day 3 for more on pull‑downs).  When the button is unpressed, the input reads **LOW**; when pressed, it reads **HIGH**.
3. Make sure the Arduino and all components share a common ground.

### Sketch

```cpp
#include <EEPROM.h>

const int buttonPin = 8;
const int ledPin    = 4;

int ledState;
int lastButtonState = LOW;
unsigned long lastDebounceTime = 0;
const unsigned long debounceDelay = 50; // 50 ms debounce

void setup() {
  pinMode(buttonPin, INPUT);
  pinMode(ledPin, OUTPUT);
  Serial.begin(9600);

  // Read the stored LED state from address 0 (default 0‑255; 0 means off, 1 on).
  ledState = EEPROM.read(0);
  ledState = constrain(ledState, 0, 1); // safety check
  digitalWrite(ledPin, ledState);
  Serial.print("Restored LED state: ");
  Serial.println(ledState);
}

void loop() {
  int reading = digitalRead(buttonPin);
  // detect state change with debounce
  if (reading != lastButtonState) {
    lastDebounceTime = millis();
  }
  if ((millis() - lastDebounceTime) > debounceDelay) {
    if (reading != ledState) {
      ledState = reading;
      digitalWrite(ledPin, ledState);
      // Only write when value changes to save EEPROM life
      EEPROM.update(0, ledState);
      Serial.print("Button pressed, new LED state: ");
      Serial.println(ledState);
    }
  }
  lastButtonState = reading;
}
```

**What is happening?**  On startup the sketch reads the stored value at address 0 and sets `ledState` accordingly.  In the loop it checks the button for state changes using a debounce routine (reusing the technique from Day 3).  When the button toggles the LED, `EEPROM.update()` stores the new value only if it differs from what is currently saved.  Because the EEPROM is non‑volatile, disconnecting power and reconnecting later will restore the LED to its last state.

### Experiment ideas

- Move the LED state to another address (e.g., address 10) and store a different configuration at address 0.  Explore how many addresses you can safely use with your board’s capacity.
- Remove the `constrain()` call and intentionally write values larger than 1.  Notice how retrieving them might lead to unexpected LED behaviour.
- Measure the time difference between `EEPROM.write()` and `EEPROM.update()` by toggling the LED repeatedly and counting how often the serial print occurs.  Which approach triggers fewer writes?

## Activity 2 – Remembering an analogue setting

This exercise builds on Day 5.  You will create a knob‑controlled LED whose brightness persists across resets.

### Circuit

1. Connect a **potentiometer** as a voltage divider: one end to 5 V, the other to **GND**, and the wiper (middle pin) to **analog pin A0**.
2. Connect an LED (with series resistor) to **digital pin 9** (a PWM pin).
3. Use the LED from Activity 1 or a second LED—it’s up to you.

### Sketch

```cpp
#include <EEPROM.h>

const int potPin = A0;
const int ledPin = 9;

int brightness;      // 0–255
int previousValue;

void setup() {
  pinMode(ledPin, OUTPUT);
  // Restore saved brightness from address 1 (store as 0–255)
  brightness = EEPROM.read(1);
  brightness = constrain(brightness, 0, 255);
  analogWrite(ledPin, brightness);
  previousValue = brightness;
  Serial.begin(9600);
  Serial.print("Restored brightness: ");
  Serial.println(brightness);
}

void loop() {
  int potValue = analogRead(potPin);
  brightness = map(potValue, 0, 1023, 0, 255);
  // Only update if value has changed beyond a threshold (to avoid excessive writes)
  if (abs(brightness - previousValue) > 4) {
    analogWrite(ledPin, brightness);
    EEPROM.update(1, brightness);
    previousValue = brightness;
    Serial.print("New brightness stored: ");
    Serial.println(brightness);
  }
  delay(20);
}
```

**Notes:**  This sketch uses `abs()` to avoid writing to EEPROM on every tiny change—only when the brightness changes by at least ±5 does it update the stored value.  The `EEPROM.update()` function saves cycles because it skips writes when the value hasn’t changed.  Try adjusting the threshold (±4) to see how it affects responsiveness versus EEPROM wear.

## Storing multiple‑byte values with `put()` and `get()`

Suppose you want to store a floating‑point calibration factor or a structure of user settings.  The EEPROM library provides `EEPROM.put()` and `EEPROM.get()` to read and write arbitrary data types without manually splitting them into bytes.  These functions also use `update()` internally, so they avoid unnecessary writes.【577675601178878†L147-L154】.

Here’s a simple example that remembers a temperature threshold for a fan controller:

```cpp
#include <EEPROM.h>

struct Settings {
  float tempThreshold;
  unsigned long runtimeHours;
};

Settings current;

void setup() {
  Serial.begin(9600);
  // Load saved settings from address 10
  EEPROM.get(10, current);
  // Validate the loaded data; if uninitialised, set defaults
  if (isnan(current.tempThreshold) || current.tempThreshold < 10 || current.tempThreshold > 35) {
    current.tempThreshold = 28.0;
    current.runtimeHours = 0;
  }
  Serial.print("Threshold: ");
  Serial.println(current.tempThreshold);
}

void loop() {
  // Suppose you have a temperature sensor reading here
  float currentTemp = 27.5;
  if (currentTemp > current.tempThreshold) {
    // Turn on fan
  }
  // Update runtime hours periodically (e.g., every hour)
  static unsigned long lastUpdate = 0;
  if (millis() - lastUpdate > 3600000UL) {
    lastUpdate = millis();
    current.runtimeHours++;
    EEPROM.put(10, current);
    Serial.print("Runtime hours updated: ");
    Serial.println(current.runtimeHours);
  }
}
```

Here we define a `Settings` struct containing a floating‑point temperature threshold and a cumulative runtime counter.  The sketch reads the structure from EEPROM at startup, checks whether the values look sensible, and writes updated runtime hours back once every hour.  Because `EEPROM.put()` automatically calls `update()`, it only changes bytes that need changing.

## Best practices and common pitfalls

| Mistake | Consequence | How to avoid |
| --- | --- | --- |
| Writing in a tight loop or within a sensor sampling loop | You quickly exhaust the 100 k write endurance of a single EEPROM address【264402201497082†L84-L87】 | Write to EEPROM only when the value actually changes (use `update()` and thresholds) or buffer updates to happen at longer intervals |
| Forgetting to include `<EEPROM.h>` | Compilation error because functions aren’t defined | Always include the library before using any EEPROM functions |
| Storing values larger than 255 with `write()`/`update()` | Data is truncated and you lose information | Use `EEPROM.put()`/`get()` for multi‑byte types |
| Overlapping stored data | Later writes corrupt earlier data | Plan your memory map: allocate specific addresses or use sequential addresses returned from `put()` |
| Not validating loaded data | Sketch may behave unpredictably if EEPROM contains random values | Initialise EEPROM or check ranges before using loaded values |
| Assuming EEPROM contents are erased on board reset | Old data persists unexpectedly | Clear or overwrite addresses when needed |

## Challenge projects

- **Persistent servo position:** Combine Day 12 and this lesson by saving the last servo angle to EEPROM.  When the system powers up, read the angle and move the servo to that position.  Use `EEPROM.update()` so the angle is only stored when it changes by more than a degree.

- **Event counter:** Use a button to increment a counter stored in EEPROM.  Display the count on the LCD from Day 16 and increment a number each time the button is pressed.  Reset the counter when a different button is held for several seconds.  Such counters are useful for tracking how many times a door is opened or a machine cycles.

- **Calibration storage:** Write a calibration routine for your photoresistor circuit (Day 6) that stores the measured dark and light values to EEPROM.  On subsequent runs, read the values and scale the sensor readings accordingly.  This avoids having to recalibrate every time you power up.

## Additional resources

- **Arduino EEPROM guide:** The Instructables article provides an accessible introduction to EEPROM and lists the memory sizes for different boards【264402201497082†L95-L100】.
- **Random Nerd Tutorials – Arduino EEPROM explained:** Details how to use `read()`, `write()`, `update()`, and explains the 100 k write/erase limit【577675601178878†L65-L85】.
- **Arduino documentation:** The official EEPROM library page includes examples and notes on using `update()` to avoid unnecessary writes and explains that each write takes about 3.3 ms【613704770013087†screenshot】.

## Summary

EEPROM provides a small but powerful way to store data that persists when the Arduino loses power.  Boards with ATmega328P, such as the Uno, offer 1 KB of storage, while Mega boards provide 4 KB【264402201497082†L95-L100】.  Each memory cell can handle about 100 000 write cycles, so it’s important to minimise unnecessary writes【264402201497082†L84-L86】.  By using `EEPROM.read()`, `EEPROM.update()` and the higher‑level `put()`/`get()` functions, you can remember states, save user settings, or accumulate counters across resets.  Careful planning of the memory map and validating loaded data will help you build reliable, persistent projects.