# Day 26 – I²C LCD Displays with the ESP32

Today you’ll learn how to connect a 16×2 character LCD to your ESP32 using the I²C interface.  Character LCDs are great for quickly displaying sensor readings, network status messages, or user prompts without needing a computer or smartphone.  Using an I²C backpack reduces the number of wires needed from six or more down to just four – power, ground, SDA and SCL – leaving plenty of pins free for other sensors【913746553944899†L71-L89】.

## Learning objectives

By the end of this lesson you will be able to:

1. Wire a 16×2 I²C LCD module to the ESP32 using the default SDA/SCL pins【913746553944899†L71-L89】.
2. Install the LiquidCrystal_I2C library and locate your LCD’s I²C address with a scanner sketch【913746553944899†L139-L170】.
3. Write Arduino code to display static and dynamic text, including sensor readings, on the LCD【913746553944899†L220-L242】.
4. Troubleshoot common issues such as incorrect addresses or poor contrast and learn best practices for integrating the display into larger projects.

## Understanding I²C LCD modules

A standard 16×2 LCD module requires at least six microcontroller pins when used in parallel mode.  To simplify wiring, many displays come with an I²C backpack (often using the PCF8574 I/O expander), allowing control via the two‑wire I²C bus【184821014497293†L130-L137】.  The backpack integrates a contrast potentiometer and pull‑up resistors for the SDA and SCL lines, so no external components are needed【184821014497293†L141-L145】.  It also provides a jumper to enable or disable the backlight and usually exposes the following pins:

- **VCC** – supply voltage (typically 5 V)
- **GND** – ground
- **SDA** – I²C data line
- **SCL** – I²C clock line【184821014497293†L147-L152】

Most I²C LCD modules work at 5 V and will still communicate safely with the ESP32 because the PCF8574 uses open‑collector outputs.  However, if your module doesn’t include level‑shifting, consider powering it from the 3.3 V rail or using a logic‑level converter to avoid over‑voltage on SDA/SCL.  The backlight often runs from VCC; the built‑in jumper lets you disable it to save power.

## Wiring the LCD to the ESP32

Use the ESP32’s default I²C pins on GPIO 21 (SDA) and GPIO 22 (SCL).  Connect the LCD module as follows (adapted from Random Nerd Tutorials):

| I²C LCD pin | ESP32 pin | Description |
|------------|----------|------------|
| **GND** | GND | Common ground |
| **VCC** | VIN (5 V) | Power the LCD; on some boards you can use 3.3 V |
| **SDA** | GPIO 21 | I²C data line【913746553944899†L82-L88】 |
| **SCL** | GPIO 22 | I²C clock line【913746553944899†L82-L88】 |

After wiring, adjust the contrast potentiometer on the backpack until you see a row of white rectangles; this indicates that the display is powered.  You’ll be able to read characters once you initialise it in code.

## Installing the LiquidCrystal_I2C library

Several libraries support I²C LCDs.  We’ll use **LiquidCrystal_I2C** by Marco Schwartz.  To install it:

1. In the Arduino IDE, go to **Sketch → Include Library → Manage Libraries…**.
2. In the Library Manager, search for “LiquidCrystal I2C” and install the version 1.1.2 or later, as recommended in the ElectronicWings guide【184821014497293†L169-L170】.
3. Alternatively, download the library from GitHub, rename the folder to `LiquidCrystal_I2C` and place it in your `libraries` directory【913746553944899†L123-L135】.

## Finding the LCD’s I²C address

Many LCD backpacks use either address `0x27` or `0x3F`, but it’s best to scan the I²C bus to confirm.  Upload this scanner sketch (from Random Nerd Tutorials) to your ESP32:

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

Open the Serial Monitor at 115200 baud and note the detected address (e.g., `0x27` or `0x3F`)【913746553944899†L139-L170】.  Use this value when creating the `LiquidCrystal_I2C` object.

## “Hello, World!” example

The following code initialises the display, turns on the backlight and prints “Hello, World!” on both rows (as shown in the ElectronicWings example)【184821014497293†L177-L187】:

```cpp
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

const int lcdColumns = 16;
const int lcdRows    = 2;
// Replace 0x27 with your LCD’s I2C address
LiquidCrystal_I2C lcd(0x27, lcdColumns, lcdRows);

void setup() {
  lcd.init();          // initialise the LCD【913746553944899†L271-L277】
  lcd.backlight();     // turn on the backlight【913746553944899†L275-L279】
}

void loop() {
  lcd.setCursor(0, 0); // first column, first row【913746553944899†L230-L235】
  lcd.print("Hello, World!");
  delay(1000);
  lcd.clear();
  lcd.setCursor(0, 1); // first column, second row【913746553944899†L237-L240】
  lcd.print("Hello, ESP32!");
  delay(1000);
  lcd.clear();
}
```

The `LiquidCrystal_I2C` library provides several useful functions:

- `lcd.init()`: initializes the display【913746553944899†L271-L277】.
- `lcd.backlight()`: turns on the backlight【913746553944899†L275-L279】.
- `lcd.setCursor(column, row)`: positions the cursor (columns and rows start at 0)【913746553944899†L280-L287】.
- `lcd.print(message)`: writes text at the current cursor position【913746553944899†L288-L291】.
- `lcd.clear()`: clears the display【913746553944899†L295-L299】.

## Displaying sensor data

Let’s display temperature and humidity from the DHT22 sensor you used in earlier lessons.  Remember that the ESP32’s 12‑bit ADC pins can’t be used when Wi‑Fi is active (so avoid ADC2 pins), and that the DHT sensor needs a 10 kΩ pull‑up resistor on its data line.

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

The degree symbol (`°`) is represented by `\xDF` in most HD44780 displays.  Use `lcd.print(value, precision)` to set the number of decimal places.  The `delay(2000)` ensures you respect the DHT22’s recommended 2‑second sampling interval.

### Scrolling messages

If you need to display messages longer than 16 characters, you can implement a scrolling function.  Random Nerd Tutorials provides a custom `scrollText()` that prepends and appends spaces to your message and then shifts the display window across it【913746553944899†L352-L399】.  The ElectronicWings page shows a similar approach【184821014497293†L234-L246】.  Use this technique for menu systems or long sensor names.

## Best practices and troubleshooting

- **Check the I²C address:** If nothing appears on the LCD, run the scanner sketch to confirm the address.  Many modules are `0x27`, but others may be `0x3F`【913746553944899†L139-L170】.
- **Adjust contrast:** Turn the potentiometer on the backpack while running a simple sketch.  A blank or faint display usually means the contrast is too low.
- **Use the correct pins:** The ESP32’s default I²C pins are GPIO 21 (SDA) and GPIO 22 (SCL)【913746553944899†L82-L88】.  You can use `Wire.begin(SDA, SCL)` with other pins if needed, but keep them consistent.
- **Power considerations:** If your module requires 5 V for the backlight, power it from the VIN pin and ensure the I²C lines are open‑drain.  For 3.3 V displays, you can connect VCC to the ESP32’s 3.3 V rail.
- **Address conflicts:** Avoid connecting multiple I²C devices with the same address.  Some backpacks allow you to change the address by soldering jumpers.

## Going further

- Combine this LCD with your Day 25 MQTT lesson: publish sensor data to a broker and display incoming messages (e.g. weather alerts) on the screen.
- Experiment with different display sizes such as 20×4 or mini OLED displays.  The code is similar, but you’ll need to adjust column and row counts.
- Explore the **LiquidCrystal** library functions `scrollDisplayLeft()` and `scrollDisplayRight()` for simple scrolling effects.
- Design a menu system controlled by buttons or a rotary encoder to navigate through multiple screens.

## Summary

In this lesson you learned how to connect an I²C LCD display to an ESP32 and show both static text and real‑time sensor data.  You installed the LiquidCrystal_I2C library, scanned the bus for your display’s address, and used functions like `lcd.init()`, `lcd.setCursor()` and `lcd.print()` to control the display【913746553944899†L271-L299】.  You now have a simple, reliable way to present information without needing a computer or smartphone.  Tomorrow you’ll learn how to have your Arduino and ESP32 boards communicate directly via serial or I²C to build hybrid systems.