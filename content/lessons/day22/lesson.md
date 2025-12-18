# Day 22 – ESP32 Basics and Wi‑Fi Introduction

The ESP32 is a powerful successor to the ESP8266 and a capable alternative to the Arduino Uno.  With dual 32‑bit LX6 cores running at up to 240 MHz, 520 KB SRAM and 4 MB of flash memory, integrated Wi‑Fi and Bluetooth LE, and a rich set of peripherals【438185369431384†L65-L92】【438185369431384†L103-L116】, it’s ideal for modern IoT projects.  This lesson introduces the ESP32 development board, explains how it differs from the 5 V Arduino boards you’ve used so far, and guides you through your first sketches.

## Learning objectives

By the end of this lesson, you will be able to:

1. Describe the key features of the ESP32 and how it differs from the ATmega328P‑based Arduino Uno.
2. Understand why ESP32 GPIO pins operate at **3.3 V logic** and are **not 5 V tolerant**【974180875509381†L460-L462】, and apply safe wiring practices.
3. Install ESP32 board definitions in the Arduino IDE and upload sketches.
4. Blink the on‑board LED and scan for nearby Wi‑Fi networks.
5. Power the ESP32 correctly and select appropriate peripherals.

## Why move to an ESP32?

Compared to the Arduino Uno, the ESP32 offers significant advantages:

- **Dual‑core processing** at 160/240 MHz with 520 KB SRAM and 4 MB flash【438185369431384†L103-L116】.
- **Integrated Wi‑Fi and Bluetooth (Classic & BLE)** at no extra cost【438185369431384†L65-L83】.
- **Rich peripherals**—I²C, SPI, UART, PWM, touch sensors, ADCs and DACs【438185369431384†L86-L90】.
- **Low cost and low power consumption**; the ESP32 can sleep deeply when idle【438185369431384†L70-L73】.

However, there are also caveats:

- The chip runs at **3.3 V** internally.  Its **I/O pins are not 5 V‑tolerant**【974180875509381†L460-L462】.  You must use **level shifters** or voltage dividers to interface 5 V sensors, or choose 3.3 V‑compatible modules.
- Some examples (e.g. `analogWrite`) aren’t directly implemented in the Arduino core for ESP32 and require alternative APIs【974180875509381†L54-L59】.
- Power consumption can peak around 250 mA during Wi‑Fi transmissions【974180875509381†L464-L467】, so a stable power supply is essential.

## Board overview and powering options

An ESP32 development board (DevKit V1 or NodeMCU‑32S) consists of the ESP‑WROOM‑32 module, voltage regulators, a USB‑to‑serial converter, and breadboard‑friendly pins.  Key points:

- **3.3 V regulator** – provides up to about **600 mA** to the ESP32 and peripherals【974180875509381†L464-L468】.  Many sensors can be powered from the 3.3 V pin, but servos or motors will require external supplies.
- **Power via USB** – the simplest method.  Use a micro USB cable connected to your computer or a 5 V USB wall adapter【625624484853538†L54-L71】.
- **5 V Vin pin** – you can supply 5 V–12 V to the `5V` pin (Vin) and GND; the on‑board regulator will step this down【625624484853538†L74-L83】.  Keep the input below 7 V to minimise heat dissipation.
- **3.3 V input** – if you have a regulated 3.3 V supply, connect it to the `3V3` pin and GND【625624484853538†L103-L119】.  **Do not exceed 3.3 V** or you risk damaging the module【625624484853538†L117-L128】.
- **Only use one power source at a time** to avoid back‑feeding【625624484853538†L131-L136】.

Because the ESP32 operates at 3.3 V logic, avoid connecting 5 V outputs directly to its GPIO pins.  If you need to interface the 5 V sensors from earlier lessons (e.g. the HC‑SR04 ultrasonic sensor), use a simple resistor divider or a dedicated logic‑level shifter.  Many sensors (PIR, DHT22, LCD) work happily at 3.3 V or have breakout boards with built‑in regulators.  Check the datasheets before connecting.

## Installing the Arduino core for ESP32

To program the ESP32 with the familiar Arduino IDE, you must install the ESP32 board definitions and drivers.

1. **Install the USB driver.**  Most ESP32 boards use a CP2102 or CH340 USB‑to‑serial converter.  Download and install the correct driver from Silicon Labs or the board’s manufacturer.  Without it, uploads will fail【974180875509381†L530-L540】.
2. **Add the ESP32 board package.**  In the Arduino IDE, open *File > Preferences* and add the following URL to **Additional Boards Manager URLs**:
   ```
   https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
   ```
3. **Install the board.**  Go to *Tools > Board > Boards Manager*, search for “esp32” and click *Install*.  After installation, select **ESP32 Dev Module** or the specific board name printed on your module from *Tools > Board*【974180875509381†L581-L587】.  (Some guides mention the Adafruit ESP32 Feather as an example, but you should pick the entry that matches your hardware.)

## Blinking the on‑board LED

Most ESP32 boards have a built‑in LED connected to GPIO 2, but some variants use different pins or omit it entirely.  Consult your board’s pinout if the following code doesn’t blink the LED.  Let’s upload a simple blink sketch:

```cpp
// Blink the on-board LED on GPIO 2
void setup() {
  pinMode(2, OUTPUT);
}

void loop() {
  digitalWrite(2, HIGH);
  delay(500);
  digitalWrite(2, LOW);
  delay(500);
}
```

Compile and upload the sketch.  The built‑in LED should blink on and off.  If you get an error about connecting, double‑check your board selection, COM port and driver installation.  The ESP32 automatically handles boot mode during upload; you shouldn’t need to press the `EN` or `BOOT` buttons unless instructed.

### Challenge: connect a 3.3 V sensor

To practise wiring at 3.3 V, connect the photoresistor circuit from Day 6 to the ESP32.  The ESP32’s ADC resolution is 12 bits (0–4095) with a 0–3.3 V reference, so you can convert a raw reading to volts with `reading × 3.3 / 4095`.  Use `analogRead()` on a safe ADC pin (e.g. GPIO 34 or 35) and print both the raw value and the calculated voltage over Serial.  See the ESP32 pin guide for safe GPIOs【101643182054638†L87-L100】.

## Scanning for Wi‑Fi networks

The ESP32’s Wi‑Fi library makes it easy to see which networks are available.  Open the **File > Examples > WiFi > WiFiScan** sketch.  It uses `WiFi.scanNetworks()` to populate a list and prints each SSID and signal strength.  A simplified version is below:

```cpp
#include <WiFi.h>

void setup() {
  Serial.begin(115200);
  delay(100);
  Serial.println("Scanning...");
  int n = WiFi.scanNetworks();
  Serial.println("Scan done");
  if (n == 0) Serial.println("No networks found");
  else {
    Serial.print(n);
    Serial.println(" networks found");
    for (int i = 0; i < n; ++i) {
      Serial.print(i + 1);
      Serial.print(": ");
      Serial.print(WiFi.SSID(i));
      Serial.print(" (RSSI ");
      Serial.print(WiFi.RSSI(i));
      Serial.println(" dBm)");
    }
  }
}

void loop() {}
```

Upload this sketch and open the Serial Monitor.  You should see a list of nearby Wi‑Fi networks and their signal strengths.  RSSI values are expressed in negative dBm; the closer (stronger) a network is, the less negative the value (e.g. –40 dBm is stronger than –80 dBm).  Try placing your hand over the ESP32’s on‑board antenna and see how the signal readings change.

### Connecting to Wi‑Fi

To connect your ESP32 to a network, use `WiFi.begin(ssid, password);` and wait for `WiFi.status()` to return `WL_CONNECTED`【397814851543871†L75-L146】.  The **ESP32 Thing Hookup Guide** includes an example that prints the assigned IP address to Serial【397814851543871†L74-L146】.  Once connected, you can create simple web servers, send HTTP requests or publish MQTT messages (future lessons will cover this).

## Powering external devices safely

Because the ESP32’s 3.3 V regulator can supply up to ~600 mA【974180875509381†L464-L468】, you can power small sensors and low‑current LEDs directly from the `3V3` pin.  However:

* **Do not power motors or servos from the ESP32**; these components can easily draw more than the regulator can supply.  Use a separate 5 V supply and connect grounds.
* **Use level shifters** when connecting 5 V modules (e.g. ultrasonic sensor, RC522 RFID reader) to protect the ESP32’s inputs【974180875509381†L460-L462】.
* When using the VIN pin to supply 5 V–12 V, remember that the on‑board regulator will get hot.  Keep input voltage at 6–7 V if possible【625624484853538†L74-L83】.

### The EN pin

The ESP32 has an **EN** (enable) pin that controls its internal regulator.  Pulling `EN` high (to 3.3 V) keeps the module running, while pulling it low resets and holds the ESP32 in a low‑power state.  Most boards tie `EN` high by default, but if your board doesn’t start or resets unexpectedly, check that `EN` is not being pulled low inadvertently.

## Troubleshooting

| Symptom | Possible cause | Remedy |
|---|---|---|
|Serial upload fails with timeout | Wrong COM port, missing driver or wrong board selected|Install the correct CP2102/CH340 driver【974180875509381†L530-L540】; select the correct board in *Tools* menu and check the port.
|ESP32 resets during Wi‑Fi transmission | Power supply sag; peak current around 250 mA【974180875509381†L464-L467】 | Use a USB port capable of supplying ≥ 500 mA or an external supply; avoid powering servos or large loads from the 3.3 V pin.
|Garbage characters in Serial Monitor | Baud rate mismatch|Set Serial Monitor to the baud rate defined in `Serial.begin()` (e.g. 115200).
|No networks found | Antenna blocked or board defective | Make sure the Wi‑Fi antenna (silver can) is not covered; test with another board or location.
|GPIO pins behave unpredictably | Using strapping pins | Avoid using GPIO0, GPIO2, GPIO5, GPIO12 or GPIO15 for regular I/O【101643182054638†L96-L100】; they affect boot mode.  Use safe GPIOs like 16, 17, 25–27, 32–33【101643182054638†L87-L94】.

## Going Further

Now that you’ve tasted ESP32 programming, you’re ready to explore its advanced features:

* **FreeRTOS tasks** – the ESP32 Arduino core runs on FreeRTOS.  You can create tasks pinned to each core for multitasking.
* **Bluetooth Low Energy** – broadcast sensor data to smartphones without Wi‑Fi.
* **Deep sleep** – dramatically reduce power consumption for battery‑powered projects.
* **Over‑the‑Air (OTA) updates** – remotely update your firmware without reconnecting a USB cable; explore the `ArduinoOTA` library.
* **MQTT and web servers** – build dashboards and remote control interfaces.
* **Hybrid systems** – connect your Arduino Uno via UART or I²C to the ESP32 to offload networking to the ESP32 while using the Uno’s 5 V‑tolerant inputs.

In the upcoming lessons, we’ll use the ESP32’s Wi‑Fi to build a web‑based dashboard and integrate our earlier sensors into IoT projects.

## Key takeaways

* The ESP32 combines Wi‑Fi/Bluetooth connectivity, dual cores and rich peripherals at low cost【438185369431384†L65-L92】.
* It operates at 3.3 V logic; its I/O pins are **not 5 V tolerant**【974180875509381†L460-L462】.
* Use regulated power supplies and avoid powering high‑current devices from the 3.3 V pin【974180875509381†L464-L468】.
* Install the ESP32 Arduino core and drivers via the Boards Manager【974180875509381†L581-L587】.
* Start with simple sketches: blink the built‑in LED and scan Wi‑Fi networks.

In tomorrow’s lesson you’ll expand on this foundation by hosting a web server on the ESP32, enabling remote monitoring of your sensors.