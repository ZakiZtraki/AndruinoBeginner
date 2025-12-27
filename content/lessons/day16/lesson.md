# Day 16 – 16×2 Character LCD Display

## Learning objectives

By the end of today’s lesson you will be able to:

1. **Identify the features and pinout of a 16×2 character LCD.** You’ll learn how the HD44780 controller manages two rows of sixteen 5×8‑dot characters and what each of the 16 pins does ([HD44780 datasheet](https://www.sparkfun.com/datasheets/LCD/HD44780.pdf); [16×2 LCD datasheet](https://components101.com/sites/default/files/component_datasheet/16x2%20LCD%20Datasheet.pdf)).
2. **Wire the LCD in 4‑bit mode and adjust the contrast correctly.** We’ll connect only six data and control lines to save Arduino I/O pins and use a 10 kΩ potentiometer to set the contrast ([HD44780 datasheet](https://www.sparkfun.com/datasheets/LCD/HD44780.pdf)).
3. **Use the Arduino LiquidCrystal library to display and format text.** You’ll write code to print messages, move the cursor, clear the screen and scroll text ([LiquidCrystal library](https://docs.arduino.cc/libraries/liquidcrystal/)).
4. **Integrate the LCD with sensors from previous days.** As a mini project you’ll display live temperature and humidity readings from your DHT sensor on the LCD.
5. **Troubleshoot common LCD issues.** We’ll review contrast adjustment, backlight wiring and communication errors.

## Introduction

Character LCDs provide a quick, low‑power way to give your projects a display. The **16×2 LCD (often called LCD1602)** has **two lines of sixteen characters**, each character made up of a **5×8 pixel matrix**. A built‑in **Hitachi HD44780** controller handles the low‑level timing so your Arduino only needs to send ASCII characters and commands over a parallel interface ([HD44780 datasheet](https://www.sparkfun.com/datasheets/LCD/HD44780.pdf); [16×2 LCD datasheet](https://components101.com/sites/default/files/component_datasheet/16x2%20LCD%20Datasheet.pdf)). These displays run on **5 V** and are inexpensive, making them a perfect complement to the sensors and actuators you’ve used so far.

Inside every LCD, polarised glass sandwiches a layer of liquid crystals. When voltage is applied, the crystals twist the polarised light, allowing it to pass through a second polariser. By controlling the electric field on the 5×8 dot matrix for each character position, the HD44780 selectively turns pixels on or off to form letters, numbers and symbols. A backlight LED shines through the crystals to make the characters visible in low light.

## Specification

The standard **1602** module has the following characteristics:

- **Operating voltage:** 5 V (logic supply)
- **Controller:** Hitachi HD44780
- **Resolution:** 2 lines × 16 characters
- **Character dot matrix:** 5×8 pixels
- **Module dimensions:** 80 × 36 × 12 mm (approx.)
- **Viewing area:** 64.5 × 16.4 mm

Source: [16×2 LCD datasheet](https://components101.com/sites/default/files/component_datasheet/16x2%20LCD%20Datasheet.pdf).

Character LCDs also come in 16×1, 16×4 and 20×4 formats. The wiring and code are identical—only the `lcd.begin(columns, rows)` call changes ([HD44780 datasheet](https://www.sparkfun.com/datasheets/LCD/HD44780.pdf)).

## Pinout and functions

A 16×2 LCD has **16 pins** numbered left to right when viewed from the front. The table below summarises their purpose. In **4‑bit mode** we only use pins 4–7 for data and leave pins D0–D3 unconnected ([16×2 LCD datasheet](https://components101.com/sites/default/files/component_datasheet/16x2%20LCD%20Datasheet.pdf); [HD44780 datasheet](https://www.sparkfun.com/datasheets/LCD/HD44780.pdf)).

| Pin | Symbol | Typical connection | Function |
|----|-------|-------------------|---------|
| **1 (VSS)** | GND | Arduino GND | Signal ground |
| **2 (VDD)** | 5 V | Arduino 5 V | Logic power |
| **3 (V0)** | Middle of 10 kΩ potentiometer | Contrast adjust |
| **4 (RS)** | Arduino digital pin | Register Select: 0 for command, 1 for data |
| **5 (R/W)** | GND | Read/Write: ground to set write mode |
| **6 (E)** | Arduino digital pin | Enable: pulse HIGH‑LOW to latch data |
| **7–10 (D0–D3)** | — | Unused in 4‑bit mode |
| **11–14 (D4–D7)** | Arduino digital pins | Data bus (upper nibble) |
| **15 (A)** | 5 V via resistor | Backlight anode |
| **16 (K)** | GND | Backlight cathode |

### Backlight and contrast

Many 16×2 displays include a built‑in resistor for the backlight LED. If yours doesn’t, connect a **220 Ω resistor** between 5 V and pin 15 to limit the current ([16×2 LCD datasheet](https://components101.com/sites/default/files/component_datasheet/16x2%20LCD%20Datasheet.pdf)). To adjust contrast, wire a **10 kΩ potentiometer**: connect one end to 5 V, the other to GND, and the wiper to **pin 3**. Powering the backlight is optional; if you leave pins 15–16 disconnected, you can read the display in good ambient light.

### 4‑bit vs 8‑bit mode

The HD44780 accepts either an 8‑bit data bus (using pins D0–D7) or a 4‑bit bus (using only D4–D7). Using **4‑bit mode** halves the number of Arduino pins required, at the cost of sending two 4‑bit nibbles for each byte ([HD44780 datasheet](https://www.sparkfun.com/datasheets/LCD/HD44780.pdf)). For most projects the speed difference is negligible, so we’ll adopt 4‑bit mode. If you run out of digital pins or want to simplify wiring further, you can add an **I²C backpack** (e.g., PCF8574), which converts the parallel interface to I²C and reduces the connection to just SDA and SCL ([PCF8574 datasheet](https://www.nxp.com/docs/en/data-sheet/PCF8574_PCF8574A.pdf)).

## Wiring instructions

Follow these steps to connect the LCD in 4‑bit mode. The pin numbers correspond to Arduino digital pins of your choice; feel free to adjust them in software.

1. **Prepare power and ground.**  Connect **VSS (pin 1)** and **K (pin 16)** to GND.  Connect **VDD (pin 2)** and **A (pin 15)** to 5 V.  If your LCD lacks a backlight resistor, insert a **220 Ω resistor** between 5 V and pin 15.
2. **Adjust the contrast.**  Hook up a **10 kΩ potentiometer**: one outer terminal to 5 V, the other to GND, and the centre wiper to **V0 (pin 3)**.  When you power up, you should see a row of blank rectangles; tweak the potentiometer until they appear clearly and then disappear when you send text.
3. **Connect the control pins.**  Tie **R/W (pin 5)** to GND to force write mode.  Connect **RS (pin 4)** to a digital pin (we’ll use **12**).  Connect **E (pin 6)** to another digital pin (we’ll use **11**).
4. **Connect the data lines.**  Leave **D0–D3 (pins 7–10)** unconnected.  Connect **D4 (pin 11)**, **D5 (pin 12)**, **D6 (pin 13)** and **D7 (pin 14)** to four consecutive Arduino pins (we’ll use **5–2**).
5. **Share ground and 5 V.**  Make sure the Arduino and LCD share common ground and that your breadboard rails are connected correctly.

Your hardware is now ready. Power the board and adjust the potentiometer until you see a row of blocks on the first line. If nothing appears, recheck your wiring and resistor.

## Writing text with the LiquidCrystal library

The **LiquidCrystal** library comes preinstalled with the Arduino IDE and makes controlling HD44780 displays straightforward ([LiquidCrystal library](https://docs.arduino.cc/libraries/liquidcrystal/)). The basic workflow is:

1. **Include the library and create an LCD object.**  Pass the pins you connected: `LiquidCrystal lcd(rs, en, d4, d5, d6, d7)`.
2. **Initialise the display.**  Call `lcd.begin(columns, rows)` in `setup()` to configure the dimensions.
3. **Clear the screen and print text.**  Use `lcd.clear()`, `lcd.print()`, `lcd.setCursor(col, row)` and other functions to write characters.

Here is a minimal sketch to print “Hello, world!” on the first line and “LCD Tutorial” on the second:

```cpp
// include the library
#include <LiquidCrystal.h>

// Creates an LCD object. Parameters: (rs, en, d4, d5, d6, d7)
LiquidCrystal lcd(12, 11, 5, 4, 3, 2);

void setup() {
  // Set up the LCD's number of columns and rows
  lcd.begin(16, 2);
  lcd.clear();
  // Print two messages
  lcd.print("Hello, world!");
  lcd.setCursor(0, 1);  // move to second line
  lcd.print("LCD Tutorial");
}

void loop() {
  // Nothing to do in loop for this simple demo
}
```

### Explanation

* The **LiquidCrystal** object `lcd` is created with the pin numbers you chose.  If you wire your display differently, change the arguments accordingly.
* `lcd.begin(16, 2)` configures the interface and tells the library that your display has 16 columns and 2 rows.  For a 20×4 display you would call `lcd.begin(20, 4)`.
* `lcd.clear()` clears any residual data and moves the cursor to the upper‑left corner.
* `lcd.print()` writes characters starting at the current cursor position.  You can print strings, numbers or variables.
* `lcd.setCursor(col, row)` moves the cursor.  Columns and rows start at 0, so (0, 1) is the first column of the second line.

Other useful functions include `lcd.home()` to return the cursor to (0, 0) without clearing the display, `lcd.scrollDisplayLeft()` or `lcd.scrollDisplayRight()` to create marquee effects, `lcd.blink()` to show a blinking block cursor, and `lcd.createChar()` to define your own 5×8 pixel characters.

## Project – Environment display

Combine the **DHT sensor** from Day 15 with today’s LCD to build a **portable indoor climate monitor**.  The LCD will show current temperature and humidity and optionally the heat index.

### Additional components

- **DHT11 or DHT22 sensor** (from yesterday)
- **10 kΩ pull‑up resistor** and **100 nF capacitor** for the sensor (see Day 15)
- **Wiring** as described above

### Sketch outline

We’ll build on yesterday’s code.  After reading the sensor, print the values to the LCD instead of (or in addition to) the Serial Monitor.  Remember to update the display at most once per second for DHT11 or once every two seconds for DHT22.

```cpp
#include <LiquidCrystal.h>
#include "DHT.h"

LiquidCrystal lcd(12, 11, 5, 4, 3, 2);
#define DHTPIN 2        // same data pin as before
#define DHTTYPE DHT11   // change to DHT22 if needed
DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  dht.begin();
  lcd.begin(16, 2);
  lcd.print("Env Monitor");
  delay(1500);
}

void loop() {
  delay(DHTTYPE == DHT11 ? 1000 : 2000);
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  if (isnan(h) || isnan(t)) {
    lcd.clear();
    lcd.print("Read error");
    return;
  }
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Temp: ");
  lcd.print(t, 1);
  lcd.print((char)223); // degree symbol
  lcd.print("C");
  lcd.setCursor(0, 1);
  lcd.print("Hum:  ");
  lcd.print(h, 1);
  lcd.print(" %");
}
```

### Extending the project

* **Add a bar graph:** Use `lcd.createChar()` to define a set of 5×8 characters that form a horizontal bar.  You can display humidity as a simple bar graph on the second line.
* **Implement scrolling messages:** If your message is longer than 16 characters, use `lcd.scrollDisplayLeft()` within a loop to create a marquee effect.
* **Create a menu:** Use the push button from Day 3 to cycle through different screens (e.g., temperature/humidity, light level from Day 6, distance from Day 9).
* **Use I²C:** Add an I²C backpack to reduce wiring.  Libraries such as **LiquidCrystal_I2C** let you control the display through just two wires (SDA and SCL).  Set the I²C address (usually `0x27` or `0x3F`) and call `lcd.begin(16, 2)` as usual.

## Troubleshooting

Common issues when using LCDs include:

- **No characters or only blocks:** Check the contrast potentiometer.  If it’s too high or too low, the characters won’t be visible.
- **Garbage characters:** Make sure R/W is tied to GND and that you’re using 4‑bit mode correctly.  A loose data wire can corrupt the nibble.
- **Backlight too bright or dim:** Confirm whether your LCD has a built‑in resistor on pin 15.  Add a **220 Ω resistor** if necessary.
- **No response to code:** Verify your pin assignments in `LiquidCrystal lcd(rs, en, d4, d5, d6, d7)` match your wiring.
- **Flashing or ghosting:** Ensure that 5 V and GND lines are solid and that the Arduino’s ground is connected to the LCD’s ground.

## Summary

Today you learned how to interface a **16×2 character LCD** with your Arduino.  We examined the **pinout**, discovered how the **HD44780** controller simplifies character rendering, and learned to wire the display in **4‑bit mode** with a contrast potentiometer and optional backlight resistor.  Using the **LiquidCrystal** library, you displayed messages, moved the cursor and scrolled text.  The sample project demonstrated how to combine the LCD with your DHT sensor to create a **compact environmental monitor**.  Armed with this knowledge you can add polished user interfaces to your projects—menus, status indicators, and custom graphics—and even explore I²C backpacks to free up I/O pins.
