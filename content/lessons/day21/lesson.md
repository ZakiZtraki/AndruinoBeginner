# Day 21 – Capstone Project: Smart Environment Monitor

Welcome to the first capstone project of this 30‑day DIY electronics series!  In this lesson you’ll combine many of the sensors, actuators and techniques you’ve learned to build an **autonomous environment monitor**.  The system will:

- Measure **temperature and humidity** using a DHT22 sensor – more accurate and wide‑ranging than the DHT11 (–40 to 80 °C versus 0 to 50 °C and 0–100 % RH versus 20–80 % RH)【860589226677594†L98-L116】.
- Detect **motion** with a PIR sensor and switch the display into an alert mode when someone approaches; the HC‑SR501 can detect up to ~21 feet and has adjustable sensitivity and delay【221133490407826†L219-L223】【221133490407826†L237-L240】.
- Monitor **water level** (e.g. a sump or plant reservoir) using a resistive water‑level sensor.  The sensor’s analog voltage rises as more of its copper traces are submerged【760746864211831†L128-L153】; powering the sensor from a digital pin minimises corrosion【760746864211831†L187-L199】.
- Sound a **buzzer** or drive a **servo‑actuated vent** when thresholds are crossed.
- **Display** real‑time data on a 16×2 LCD using the LiquidCrystal library.  The LCD’s pinout includes RS, EN and four data lines (D4–D7) with separate backlight power【438396019505213†L143-L184】; wiring it in 4‑bit mode saves Arduino pins【438396019505213†L230-L236】.
- Save user‑set thresholds into **EEPROM**, so your settings persist across power cycles.  AVR microcontrollers have 1 KB of built‑in EEPROM and individual cells are rated for ~100 000 write cycles【264402201497082†L95-L100】【264402201497082†L84-L86】, so you must minimise writes.

By the end of this project you will have integrated multiple inputs and outputs, managed state across reboots, and written modular code that scales.  Let’s get started!

## Prerequisites

Before beginning you should be comfortable with the following:

- Reading digital sensors (PIR motion, buttons, RFID) and analog sensors (photoresistor, potentiometer, water‑level sensor).
- Using PWM to control LEDs, buzzers and motors.
- Interfacing a character LCD and creating custom characters.
- Storing and retrieving data from EEPROM.

If any of these topics feel unfamiliar, revisit the corresponding earlier lessons before proceeding.

## Materials

| Quantity | Component | Notes |
|---|---|---|
|1|Arduino Uno or compatible board|Provides 5 V logic and 6 analog inputs.|
|1|DHT22 temperature/humidity sensor|Measures –40 to 80 °C and 0–100 % RH with ±0.5 °C/±2–5 % RH accuracy【860589226677594†L98-L116】.  If you only have a DHT11, it will work, but with reduced range.|
|1|HC‑SR501 PIR motion sensor|Powered from 5 V; detection range adjustable via onboard potentiometer (≈ 9–21 ft) and delay adjustable from ~1 s to 3 min【221133490407826†L219-L223】【221133490407826†L237-L240】.|
|1|Water‑level sensor module|Three‑pin analog sensor.  Provides rising voltage as water touches more traces【760746864211831†L128-L153】.  Power via a digital pin to reduce corrosion【760746864211831†L187-L199】.|
|1|16×2 LCD (HD44780 compatible)|Requires 5 V; use 10 kΩ potentiometer for contrast and optional 220 Ω resistor for backlight【438396019505213†L143-L184】.  Pin mapping described below.|
|1|Piezo buzzer (active or passive) **or** SG90 micro‑servo|Buzzer for audible alerts; servo to open/close a vent or lid.  The SG90 runs on 5 V and draws 100–250 mA when moving【335603732100712†L246-L249】.|
|1|RGB LED or simple LED|Visual status indicator.|
|1|Button or switch|For entering threshold‑adjustment mode.|
|1|10 kΩ potentiometer|For LCD contrast.|
|3|10 kΩ resistors|Pull‑down resistor for button and voltage divider (if needed).|
|Wires, breadboard, and optional prototyping shield|—|
|Power supply|If using servo, supply 5 V at ≥ 1 A (or use external supply).|

## System Overview

This smart monitor continuously samples the DHT sensor, water‑level sensor and PIR sensor.  It displays the temperature, humidity and water level on the LCD.  If motion is detected or any measurement crosses a threshold, an alert is triggered—either by sounding the buzzer, turning on an RGB LED, or moving the servo.  Thresholds (e.g. maximum humidity, minimum water level) can be adjusted with a button and are saved to EEPROM.

### Block Diagram

```
                +-------------+
                |   Arduino   |
                +------+------+        +------+
             D2 |PIR OUT   RS|------->| LCD  |
             A0 |Water lvl  E |------->| 16×2 |
             D3 |Buzzer/Servo|        |Display|
             D4 |LCD D4     D4|<-------|
             D5 |LCD D5     D5|<-------|
             D6 |LCD D6     D6|<-------|
             D7 |LCD D7     D7|<-------|
             D8 |Button     K|--->backlight GND
             D9 |Servo PWM  A|--->backlight +5V
             D10|Unused     RW|--->GND
             A1 |DHT data   V0|---potentiometer
             GND|Common GND|---all grounds
             5V |Common 5V |---sensors & LCD
```

## Step 1 – Wire the Sensors and Actuators

1. **Power rails:** Connect the Arduino’s 5 V and GND to your breadboard’s power rails.
2. **LCD:** Place the LCD on the breadboard.  Wire its pins as follows:
   - Pin 1 (GND) → Ground.  Pin 2 (VCC) → 5 V.
   - Pin 3 (V0) → middle of 10 kΩ potentiometer; other ends of the pot go to 5 V and GND【438396019505213†L143-L184】.
   - Pin 4 (RS) → Arduino D12; Pin 6 (E) → D11【438396019505213†L230-L236】.
   - Pins 11–14 (D4–D7) → Arduino D5, D4, D3 and D2 respectively (4‑bit mode)【438396019505213†L230-L236】.
   - Pin 5 (RW) → GND (we always write to the LCD【438396019505213†L166-L172】).
   - Pin 15 (A/backlight +) → 5 V through a 220 Ω resistor (if your LCD lacks a built‑in resistor)【438396019505213†L198-L204】.  Pin 16 (K) → GND.
3. **DHT22:** Connect VCC to 5 V, GND to GND and DATA to A1.  Insert a 10 kΩ resistor between DATA and VCC to act as the pull‑up (some breakout boards include this)【860589226677594†L98-L116】.
4. **PIR sensor:** Connect its VCC to 5 V, GND to GND and OUT to D2.  Adjust its two potentiometers: turn sensitivity to half‑scale (~15 ft range) and set the delay to ~5 s for testing【221133490407826†L219-L223】【221133490407826†L237-L240】.  Wait 30–60 s after power up for the sensor to stabilise【352674793399350†L246-L249】.
5. **Water‑level sensor:** Connect its signal pin to A0, GND to GND, and VCC to D7.  We will control D7 to power the sensor only during readings to reduce corrosion【760746864211831†L187-L199】.
6. **Buzzer or servo:** If using a buzzer, connect one leg to D3 and the other leg to GND; if using a servo, connect the orange/yellow signal wire to D3, the red wire to 5 V and the brown/black wire to GND【335603732100712†L214-L237】.  Use a separate 5 V supply with a common ground if the servo causes resets【335603732100712†L246-L249】.
7. **Button:** Connect one leg to D8 and the other leg to GND.  Connect a 10 kΩ resistor between D8 and 5 V (pull‑up).  When pressed, the pin reads LOW.
8. **Common grounds:** Ensure all sensors and actuators share a common ground with the Arduino.

### Verification Checkpoint

Use a multimeter to verify that:

1. The LCD backlight and contrast pot are wired correctly; you can adjust the contrast to see dark blocks appear before uploading any code.
2. The DHT sensor’s data line is pulled up with a resistor; otherwise the readings will fail.
3. The water‑level sensor is not powered continuously (use a digital pin).
4. The PIR sensor output changes when you wave your hand in front of it after warm‑up.

If any sensor fails to respond, double‑check the wiring and power rails before proceeding.

## Step 2 – Write the Firmware

We’ll structure our sketch using functions to keep things organised.  The main components are:

- **Sensor reading functions** to encapsulate reading and calibration.
- **Display function** to update the LCD.
- **EEPROM functions** to store and retrieve thresholds.
- **Mode handling** to switch between normal operation and threshold‑adjustment mode.

Below is an outline of the code (see provided file for the complete version):

```cpp
#include <DHT.h>
#include <LiquidCrystal.h>
#include <EEPROM.h>

// Pin definitions
const uint8_t DHT_PIN = A1;
const uint8_t PIR_PIN = 2;
const uint8_t WATER_PWR_PIN = 7;
const uint8_t WATER_PIN = A0;
const uint8_t BUTTON_PIN = 8;
const uint8_t ALERT_PIN = 3; // buzzer or servo

DHT dht(DHT_PIN, DHT22);
LiquidCrystal lcd(12, 11, 5, 4, 3, 2);

// Thresholds (will be loaded from EEPROM)
float tempThreshold = 30.0;    // degrees C
float humidityThreshold = 60.0; // percent
int waterThreshold = 300;       // ADC value (0‑1023)

bool adjustMode = false;
uint8_t currentParam = 0; // 0=temp, 1=humidity, 2=water

void setup() {
  Serial.begin(9600);
  pinMode(PIR_PIN, INPUT);
  pinMode(WATER_PWR_PIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(ALERT_PIN, OUTPUT);
  dht.begin();
  lcd.begin(16, 2);
  loadThresholds();
  lcd.print("Smart Monitor");
  delay(2000);
}

void loop() {
  // Check if button pressed to enter/exit adjust mode
  static bool lastButtonState = HIGH;
  bool buttonState = digitalRead(BUTTON_PIN);
  if (lastButtonState == HIGH && buttonState == LOW) {
    adjustMode = !adjustMode;
    if (!adjustMode) {
      saveThresholds();
    }
    delay(50); // debouncing delay
  }
  lastButtonState = buttonState;

  if (adjustMode) {
    adjustParameters();
  } else {
    runMonitor();
  }
}

// Reads sensors and updates LCD, triggers alerts
void runMonitor() {
  float tempC = dht.readTemperature();
  float hum = dht.readHumidity();
  int waterLevel = readWaterLevel();
  bool motion = digitalRead(PIR_PIN);
  lcd.setCursor(0, 0);
  lcd.print("T: "); lcd.print(tempC, 1); lcd.print("C H: "); lcd.print(hum, 0); lcd.print("% ");
  lcd.setCursor(0, 1);
  lcd.print("Water: "); lcd.print(map(waterLevel, 0, 1023, 0, 100)); lcd.print("% ");
  if (motion) lcd.print("M!"); else lcd.print("  ");
  // Check thresholds
  if (tempC > tempThreshold || hum > humidityThreshold || waterLevel < waterThreshold || motion) {
    alert(true);
  } else {
    alert(false);
  }
  delay(2000);
}

// Powers sensor briefly to read analog value
int readWaterLevel() {
  digitalWrite(WATER_PWR_PIN, HIGH);
  delay(10);
  int val = analogRead(WATER_PIN);
  digitalWrite(WATER_PWR_PIN, LOW);
  return val;
}

// Activates buzzer or moves servo
void alert(bool state) {
  if (state) {
    digitalWrite(ALERT_PIN, HIGH);
  } else {
    digitalWrite(ALERT_PIN, LOW);
  }
}

// Adjust thresholds using button and PIR sensor detection
void adjustParameters() {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Adjust mode");
  lcd.setCursor(0, 1);
  switch (currentParam) {
    case 0: lcd.print("Temp: "); lcd.print(tempThreshold); break;
    case 1: lcd.print("Hum:  "); lcd.print(humidityThreshold); break;
    case 2: lcd.print("Water:"); lcd.print(map(waterThreshold, 0, 1023, 0, 100)); lcd.print("%"); break;
  }
  // Use PIR motion to increase threshold and button long hold to next parameter
  if (digitalRead(PIR_PIN)) {
    if (currentParam == 0) tempThreshold += 0.5;
    else if (currentParam == 1) humidityThreshold += 1;
    else if (currentParam == 2) waterThreshold -= 10;
    delay(500);
  }
  // Long hold button to advance parameter
  if (digitalRead(BUTTON_PIN) == LOW && lastButtonState == LOW) {
    delay(500);
    currentParam = (currentParam + 1) % 3;
  }
}

// EEPROM helpers
void loadThresholds() {
  EEPROM.get(0, tempThreshold);
  EEPROM.get(sizeof(float), humidityThreshold);
  EEPROM.get(sizeof(float) * 2, waterThreshold);
  // check for uninitialised values
  if (isnan(tempThreshold) || tempThreshold < -10 || tempThreshold > 50) tempThreshold = 30.0;
  if (isnan(humidityThreshold) || humidityThreshold < 10 || humidityThreshold > 90) humidityThreshold = 60.0;
  if (waterThreshold < 0 || waterThreshold > 1023) waterThreshold = 300;
}

void saveThresholds() {
  EEPROM.put(0, tempThreshold);
  EEPROM.put(sizeof(float), humidityThreshold);
  EEPROM.put(sizeof(float) * 2, waterThreshold);
}
```

This code demonstrates one way to integrate multiple sensors and actuators.  It reads the water‑level sensor by powering it from a digital pin just long enough to take a reading【760746864211831†L187-L199】, updates the LCD, and triggers the alert output when thresholds or motion exceed set values.  The adjust‑mode uses the PIR sensor as a “plus” button; you could substitute a second button or potentiometer instead.  Notice how we call `EEPROM.put()` only when leaving adjust mode to minimise write cycles【264402201497082†L84-L86】.

### Common Mistakes and How to Avoid Them

| Issue | Cause | Solution |
|---|---|---|
|LCD displays gibberish or nothing|Incorrect pin mapping or contrast misadjusted|Re‑check the wiring; connect RW to GND and adjust the contrast pot until boxes appear; ensure RS, EN and D4–D7 match your code【438396019505213†L143-L184】.|
|DHT sensor returns `nan` values|Data line floating or sampling too fast|Ensure the 10 kΩ pull‑up resistor is installed【860589226677594†L98-L116】; wait at least 2 s between reads for DHT22 (0.5 Hz sampling rate)【860589226677594†L98-L116】.|
|Water sensor corrodes quickly|Constant power applied|Power the sensor via a digital pin and turn it on only during readings【760746864211831†L187-L199】.  Keep only the sensing area submerged【760746864211831†L263-L265】.|
|PIR sensor triggers randomly|No warm‑up time or interference|Wait 30–60 s after power‑up【352674793399350†L246-L249】; adjust sensitivity and delay; avoid pointing at heat sources or direct sunlight.|
|Servo causes Arduino resets|Servo draws too much current|Provide a separate 5 V supply for the servo and join grounds【335603732100712†L246-L249】.  Do not power a servo directly from an Arduino pin.|
|EEPROM wears out|Writing too often|Use `EEPROM.update()` or only write when thresholds change; avoid saving every loop iteration【264402201497082†L84-L86】.|

## Going Further

Here are a few ideas to extend the project:

* **Network your monitor.**  Use an ESP32 or ESP8266 board to send sensor data to a web dashboard.  The DHT sensor readings can be published over MQTT, and thresholds can be adjusted via a smartphone.
* **Add more sensors.**  Integrate the RC522 RFID reader (Day 19) to log who acknowledges an alert, or add the accelerometer (Day 18) to detect vibration.
* **Graph data.**  Store time‑stamped sensor values on an SD card or send them to a computer for plotting.  Use a rolling average to smooth water‑level readings and reduce noise.
* **Automate actions.**  Attach the servo to open a greenhouse vent when temperature exceeds the set point and close it when it drops.  Combine with the rain sensor module: its comparator outputs LOW when the pad gets wet【568536163166220†L140-L144】, so you can override the vent to prevent rain entering.
* **User interface improvements.**  Replace the button/PIR interface with a rotary encoder to adjust thresholds more easily, or add a menu system on the LCD using custom characters.

## Summary

This capstone project integrates multiple sensors and output devices into a cohesive system.  You learned how to:

* Compare the DHT11 and DHT22 sensors and choose the right one for a temperature and humidity monitor【860589226677594†L98-L116】.
* Read a resistive water‑level sensor, power it efficiently and interpret its analog output【760746864211831†L128-L153】【760746864211831†L187-L199】.
* Wire and operate a 16×2 LCD in 4‑bit mode, saving pins and controlling contrast【438396019505213†L143-L184】【438396019505213†L230-L236】.
* Configure a PIR sensor, understanding its range and delay adjustments【221133490407826†L219-L223】【221133490407826†L237-L240】 and respecting its warm‑up period【352674793399350†L246-L249】.
* Store and recall settings in EEPROM while minimising write cycles【264402201497082†L84-L86】.
* Design modular code to read sensors, display data, manage thresholds and control outputs.

Armed with these skills, you are ready to tackle more ambitious IoT projects, combining different components and software techniques to build intelligent systems tailored to your needs.