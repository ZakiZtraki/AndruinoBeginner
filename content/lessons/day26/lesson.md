# Day 26 – I²C LCD Displays with the ESP32

Today you’ll learn how to connect a 16×2 character LCD to your ESP32 using the I²C interface.  Character LCDs are great for quickly displaying sensor readings, network status messages, or user prompts without needing a computer or smartphone.  Using an I²C backpack reduces the number of wires needed from six or more down to just four – power, ground, SDA and SCL – leaving plenty of pins free for other sensors.

## Learning objectives

By the end of this lesson you will be able to:

1. Wire a 16×2 I²C LCD module to the ESP32 using the default SDA/SCL pins.
2. Install the LiquidCrystal_I2C library and locate your LCD’s I²C address with a scanner sketch.
3. Write Arduino code to display static and dynamic text, including sensor readings, on the LCD.
4. Troubleshoot common issues such as incorrect addresses or poor contrast and learn best practices for integrating the display into larger projects.

## Understanding I²C LCD modules

A standard 16×2 LCD module requires at least six microcontroller pins when used in parallel mode.  To simplify wiring, many displays come with an I²C backpack (often using the PCF8574 I/O expander), allowing control via the two‑wire I²C bus ([PCF8574 datasheet](https://www.nxp.com/docs/en/data-sheet/PCF8574_PCF8574A.pdf)).  Many backpacks integrate a contrast potentiometer and pull‑up resistors for the SDA and SCL lines, so no external components are needed.  It also provides a jumper to enable or disable the backlight and usually exposes the following pins:

- **VCC** – supply voltage (typically 5 V)
- **GND** – ground
- **SDA** – I²C data line
- **SCL** – I²C clock line

Most I²C LCD modules are designed for 5 V logic, and the I²C lines are open‑drain with pull‑ups to VCC.  If those pull‑ups go to 5 V, the ESP32’s 3.3 V‑only GPIOs can be over‑volted.  To stay safe, power the backpack at 3.3 V (if it supports it), remove the 5 V pull‑ups and add 3.3 V pull‑ups, or use a logic‑level converter ([ESP32 datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf), [PCF8574 datasheet](https://www.nxp.com/docs/en/data-sheet/PCF8574_PCF8574A.pdf)).  The backlight often runs from VCC; the built‑in jumper lets you disable it to save power.

## Wiring the LCD to the ESP32

Use the ESP32’s default I²C pins on GPIO 21 (SDA) and GPIO 22 (SCL).  Connect the LCD module as follows ([Arduino‑ESP32 I²C](https://docs.espressif.com/projects/arduino-esp32/en/latest/api/i2c.html)):

| I²C LCD pin | ESP32 pin | Description |
|------------|----------|------------|
| **GND** | GND | Common ground |
| **VCC** | 3.3 V (preferred) or 5 V | Use 5 V only if your I²C lines are level‑shifted |
| **SDA** | GPIO 21 | I²C data line |
| **SCL** | GPIO 22 | I²C clock line |

After wiring, adjust the contrast potentiometer on the backpack until you see a row of white rectangles; this indicates that the display is powered.  You’ll be able to read characters once you initialise it in code.

## Installing the LiquidCrystal_I2C library

Several libraries support I²C LCDs.  We’ll use **LiquidCrystal_I2C** by Marco Schwartz ([LiquidCrystal_I2C GitHub](https://github.com/marcoschwartz/LiquidCrystal_I2C)).  To install it:

1. In the Arduino IDE, go to **Sketch → Include Library → Manage Libraries…**.
2. In the Library Manager, search for “LiquidCrystal I2C” and install a recent version.
3. Alternatively, download the library from GitHub, rename the folder to `LiquidCrystal_I2C` and place it in your `libraries` directory.

## Finding the LCD’s I²C address

Many LCD backpacks use PCF8574 (address range `0x20`–`0x27`) or PCF8574A (`0x38`–`0x3F`), so `0x27` and `0x3F` are common when address pins are set high.  It’s best to scan the I²C bus to confirm ([PCF8574 datasheet](https://www.nxp.com/docs/en/data-sheet/PCF8574_PCF8574A.pdf)).  Upload this scanner sketch to your ESP32:

```cpp
#include <Wire.h>

void setup() {
  Wire.begin();
  Serial.begin(115200);
  Serial.println("I2C Scanner");
}

void loop() {
  byte error, address;
  Serial.println("Scanning...");
  for (address = 1; address < 127; address++) {
    Wire.beginTransmission(address);
    error = Wire.endTransmission();
    if (error == 0) {
      Serial.print("I2C device found at address 0x");
      if (address < 16) Serial.print("0");
      Serial.println(address, HEX);
    }
  }
  delay(2000);
}
```

Open the Serial Monitor at 115200 baud and note the detected address (e.g., `0x27` or `0x3F`).  Use this value when creating the `LiquidCrystal_I2C` object.

## “Hello, World!” example

The following code initialises the display, turns on the backlight and prints “Hello, World!” on both rows:

```cpp
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

const int lcdColumns = 16;
const int lcdRows    = 2;
// Replace 0x27 with your LCD’s I2C address
LiquidCrystal_I2C lcd(0x27, lcdColumns, lcdRows);

void setup() {
  lcd.init();          // initialise the LCD
  lcd.backlight();     // turn on the backlight
}

void loop() {
  lcd.setCursor(0, 0); // first column, first row
  lcd.print("Hello, World!");
  delay(1000);
  lcd.clear();
  lcd.setCursor(0, 1); // first column, second row
  lcd.print("Hello, ESP32!");
  delay(1000);
  lcd.clear();
}
```

The `LiquidCrystal_I2C` library provides several useful functions:

- `lcd.init()`: initializes the display.
- `lcd.backlight()`: turns on the backlight.
- `lcd.setCursor(column, row)`: positions the cursor (columns and rows start at 0).
- `lcd.print(message)`: writes text at the current cursor position.
- `lcd.clear()`: clears the display.

Source: [LiquidCrystal_I2C GitHub](https://github.com/marcoschwartz/LiquidCrystal_I2C).

## Displaying sensor data

Let’s display temperature and humidity from the DHT22 sensor you used in earlier lessons.  Remember that the ESP32’s ADC2 pins can’t be used when Wi‑Fi is active (so avoid ADC2 pins), and that the DHT sensor needs a 10 kΩ pull‑up resistor on its data line ([ESP‑IDF ADC docs](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/peripherals/adc.html), [Adafruit DHT guide](https://learn.adafruit.com/dht)).

```cpp
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <DHT.h>

const int lcdColumns = 16;
const int lcdRows    = 2;
LiquidCrystal_I2C lcd(0x27, lcdColumns, lcdRows);

#define DHTPIN 23
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  dht.begin();
  lcd.init();
  lcd.backlight();
}

void loop() {
  float temperature = dht.readTemperature();
  float humidity    = dht.readHumidity();
  lcd.setCursor(0, 0);
  lcd.print("Temp: ");
  lcd.print(temperature, 1); // one decimal place
  lcd.print("\xDF" "C");     // degree symbol
  lcd.setCursor(0, 1);
  lcd.print("Hum : ");
  lcd.print(humidity, 1);
  lcd.print("%  ");
  delay(2000);
}
```

The degree symbol (`°`) is represented by `\xDF` in most HD44780 displays.  Use `lcd.print(value, precision)` to set the number of decimal places.  The `delay(2000)` ensures you respect the DHT22’s recommended 2‑second sampling interval ([HD44780 datasheet](https://www.sparkfun.com/datasheets/LCD/HD44780.pdf), [Adafruit DHT guide](https://learn.adafruit.com/dht)).

### Scrolling messages

If you need to display messages longer than 16 characters, you can implement a scrolling function by shifting the display window across a padded string.  Use this technique for menu systems or long sensor names.

## Best practices and troubleshooting

- **Check the I²C address:** If nothing appears on the LCD, run the scanner sketch to confirm the address.  Many modules are `0x27`, but others may be `0x3F`.
- **Adjust contrast:** Turn the potentiometer on the backpack while running a simple sketch.  A blank or faint display usually means the contrast is too low.
- **Use the correct pins:** The ESP32’s default I²C pins are GPIO 21 (SDA) and GPIO 22 (SCL).  You can use `Wire.begin(SDA, SCL)` with other pins if needed, but keep them consistent ([Arduino‑ESP32 I²C](https://docs.espressif.com/projects/arduino-esp32/en/latest/api/i2c.html)).
- **Power considerations:** If your module requires 5 V for the backlight, power it from the VIN pin and ensure the I²C lines are open‑drain.  For 3.3 V displays, you can connect VCC to the ESP32’s 3.3 V rail.
- **Address conflicts:** Avoid connecting multiple I²C devices with the same address.  Some backpacks allow you to change the address by soldering jumpers.

## Going further

- Combine this LCD with your Day 25 MQTT lesson: publish sensor data to a broker and display incoming messages (e.g. weather alerts) on the screen.
- Experiment with different display sizes such as 20×4 or mini OLED displays.  The code is similar, but you’ll need to adjust column and row counts.
- Explore the **LiquidCrystal** library functions `scrollDisplayLeft()` and `scrollDisplayRight()` for simple scrolling effects.
- Design a menu system controlled by buttons or a rotary encoder to navigate through multiple screens.

## Summary

In this lesson you learned how to connect an I²C LCD display to an ESP32 and show both static text and real‑time sensor data.  You installed the LiquidCrystal_I2C library, scanned the bus for your display’s address, and used functions like `lcd.init()`, `lcd.setCursor()` and `lcd.print()` to control the display.  You now have a simple, reliable way to present information without needing a computer or smartphone.  Tomorrow you’ll learn how to have your Arduino and ESP32 boards communicate directly via serial or I²C to build hybrid systems.
