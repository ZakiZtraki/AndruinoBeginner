# Day 30 – Final Capstone: Smart Home Demo System

## Learning objectives

1. **Design and build an integrated smart‑home demonstration system** that measures environmental conditions, detects motion and distance, and controls actuators.
2. **Combine multiple sensors and actuators** you’ve learned about—DHT22, PIR, water level, ultrasonic distance, servo or DC motor—into a cohesive project.
3. **Use networking and cloud communication** to display data and control devices via a web dashboard and MQTT.
4. **Implement robust control logic** with thresholds, hysteresis and user‑set parameters stored in EEPROM.
5. **Evaluate and enhance system reliability**, applying the decoupling, power and watchdog techniques from Day 29.

## Project overview

You will create a Smart Home Demo System that monitors temperature, humidity, water level and proximity; detects motion; and controls a fan (DC motor), a servo‑driven gate and a water pump. The ESP32 hosts a web interface showing live readings and a control panel. It also publishes sensor data to MQTT topics and listens for commands from a remote dashboard or mobile app. The Arduino or ESP32 toggles devices automatically based on sensor thresholds stored in EEPROM (Day 17) and can be configured via the web page.

The system uses many concepts you’ve learned:

* Safe voltage levels and logic level shifting (Days 22–23)【27998646467289†L174-L176】.
* Sensor handling and mapping (Days 6–9, 15–18). For example, the DHT22 measures –40–125 °C and 0–100 % RH【860589226677594†L98-L116】, while the HC‑SR04 ultrasonic sensor measures distances from about 2 cm to 4 m with ±3 mm accuracy【525653356484419†L129-L149】.
* Actuator control via L293D for DC motors (Day 13) and servos (Day 12)【613704194224275†L171-L186】.
* Networking, web servers and MQTT (Days 22–25)【322305423900976†L263-L266】.
* EEPROM persistence (Day 17).
* Reliability techniques from Day 29—including decoupling capacitors, proper power wiring and watchdog timers【755226503047356†L90-L113】【576069459775266†L116-L126】.

## 1 – System architecture

### 1.1 Core components

* **ESP32 network node**: Connects to Wi‑Fi, runs a web server, communicates with the MQTT broker and stores configuration values in EEPROM. Receives sensor data from the Arduino via serial and sends commands.
* **Arduino sensor node** (optional). The Uno reads sensors and actuators using 5 V logic. If you prefer, you can instead wire all sensors directly to the ESP32 (with proper voltage shifting). This lesson assumes a hybrid setup for practice.
* **Sensors**:
  - **DHT22** for temperature and humidity (0–50 °C for DHT11, –40–125 °C for DHT22, ±0.5 °C accuracy and 0–100 % RH range【860589226677594†L98-L116】).
  - **PIR motion sensor**, adjustable sensitivity and delay up to 21 ft and 1 s–3 min【221133490407826†L219-L240】.
  - **Water level sensor** with analog output and optional digital comparator (LM393). Use the analog pin for percentage readings and power it via a digital pin to reduce corrosion【760746864211831†L186-L199】.
  - **Ultrasonic sensor** (HC‑SR04) measuring distance with a 10 µs trigger pulse and echo duration; range 2 cm–4 m and ±3 mm precision【525653356484419†L129-L149】【525653356484419†L161-L163】.
* **Actuators**:
  - **Fan or DC motor** connected through an L293D driver; can draw up to 600 mA per channel and support voltages 4.5–36 V【613704194224275†L171-L186】. Use PWM for speed control【242868637693544†L268-L274】.
  - **Servo motor** for a gate or valve (up to 180° rotation; draws 100–250 mA when moving【335603732100712†L246-L249】).
  - **Water pump or LED indicator** for water level.
* **I²C LCD display** (16×2) or web page for local display【977185078609972†L137-L147】.

### 1.2 Power and decoupling

Use a 5 V 2 A regulated supply for the Arduino and ESP32. Place a 470 µF electrolytic capacitor across the supply rails and a 0.1 µF ceramic capacitor near each sensor and the ESP32 to handle current spikes【755226503047356†L90-L104】【165607811622794†L333-L339】. Keep power wires short and thick【755226503047356†L110-L113】. If motors cause resets, use a separate supply for motors and connect grounds together.

## 2 – Wiring

### 2.1 Arduino sensor node

1. **DHT22:** Connect VCC to 5 V, GND to GND and Data to pin 7. Add a 10 kΩ pull‑up resistor between Data and VCC【860589226677594†L180-L214】.
2. **PIR sensor:** VCC to 5 V, GND to GND, OUT to pin 8. Adjust sensitivity and time delay with onboard potentiometers【221133490407826†L219-L240】.
3. **Water level sensor:** AO to A0, power via digital pin 6 (set HIGH to read, LOW otherwise)【760746864211831†L186-L199】. Optionally connect DO to a digital input for threshold detection via the LM393 comparator【568536163166220†L126-L144】.
4. **Ultrasonic sensor:** Connect VCC to 5 V, GND to GND, TRIG to pin 9, ECHO to pin 10. Use a 10 µs trigger pulse and measure the echo pulse width to calculate distance【525653356484419†L161-L163】.
5. **DC motor & L293D:** Connect motor leads to OUT1/OUT2 on the L293D. Pin 1 (Enable A) and pin 9 (Enable B) should be tied HIGH to activate the driver【613704194224275†L237-L241】. Connect IN1 and IN2 to digital pins 3 and 4; use PWM on IN1 for speed control and set IN2 LOW for forward or HIGH for reverse【613704194224275†L272-L286】.
6. **Servo:** Connect signal to pin 5, VCC to 5 V and GND to GND. Use an external power supply if the servo load is heavy【335603732100712†L246-L249】.
7. **Serial link:** Send data to the ESP32 by connecting Arduino TX through a level shifter to ESP32 RX (GPIO 16) and ESP32 TX to Arduino RX. Power HV/LV sides appropriately【27998646467289†L174-L176】.
8. **Watchdog & decoupling:** Add the watchdog timer as shown in Day 29 to reset the Arduino if it hangs【576069459775266†L116-L126】 and install 0.1 µF capacitors near each sensor.

### 2.2 ESP32 network node

1. Connect to your router with `WiFi.begin(ssid, password)` and wait until `WiFi.status()` returns `WL_CONNECTED`【384423720218434†L252-L266】.
2. Use the PubSubClient library to connect to your MQTT broker. Set the server with `client.setServer(mqtt_server, port)`【322305423900976†L263-L266】 and implement a reconnection loop【322305423900976†L338-L342】.
3. Use `HardwareSerial arduinoSerial(2)` on GPIO 16/17 to communicate with the Arduino sensor node.
4. Optionally, connect an I²C LCD (SDA to GPIO 21, SCL to GPIO 22) to display local readouts【977185078609972†L137-L147】.

## 3 – Software implementation

### 3.1 Arduino sensor node code

The Arduino code reads each sensor, applies threshold logic, and sends a JSON‑like line to the ESP32. It also controls the motor and servo based on commands received over serial.

```cpp
// Pseudocode outline
#include <DHT.h>

const uint8_t DHT_PIN = 7;
const uint8_t WATER_POWER = 6;
const uint8_t WATER_PIN   = A0;
const uint8_t PIR_PIN     = 8;
const uint8_t TRIG_PIN    = 9;
const uint8_t ECHO_PIN    = 10;
const uint8_t MOTOR_EN    = 3;
const uint8_t MOTOR_IN1   = 3; // same as enable for simplicity
const uint8_t MOTOR_IN2   = 4;
const uint8_t SERVO_PIN   = 5;

DHT dht(DHT_PIN, DHT22);
unsigned long lastSend = 0;
float tempThreshold = 28.0;   // loaded from EEPROM
float humThreshold  = 60.0;
int waterThreshold  = 20;
long distanceThreshold = 50; // cm

void setup() {
  Serial.begin(9600);
  dht.begin();
  pinMode(WATER_POWER, OUTPUT);
  pinMode(PIR_PIN, INPUT);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(MOTOR_IN1, OUTPUT);
  pinMode(MOTOR_IN2, OUTPUT);
  // load thresholds from EEPROM (Day 17)
  // watchdog setup omitted for brevity
}

int readWater() {
  digitalWrite(WATER_POWER, HIGH);
  delay(10);
  int raw = analogRead(WATER_PIN);
  digitalWrite(WATER_POWER, LOW);
  int pct = map(constrain(raw, 200, 800), 200, 800, 0, 100);
  return pct;
}

long readDistance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);  // 10 µs trigger【525653356484419†L161-L163】
  digitalWrite(TRIG_PIN, LOW);
  long duration = pulseIn(ECHO_PIN, HIGH, 30000);
  // convert to centimetres (sound speed 343 m/s)
  return duration / 58;  // approximate conversion【525653356484419†L218-L235】
}

void loop() {
  if (Serial.available()) {
    char cmd = Serial.read();
    if (cmd == 'F') {
      // toggle fan
    }
    if (cmd == 'S') {
      // toggle servo
    }
  }
  unsigned long now = millis();
  if (now - lastSend > 2000) {
    lastSend = now;
    float t = dht.readTemperature();
    float h = dht.readHumidity();
    int water = readWater();
    long dist = readDistance();
    bool motion = digitalRead(PIR_PIN);
    // control fan automatically
    if (t > tempThreshold || h > humThreshold) {
      analogWrite(MOTOR_EN, 200); // moderate speed
      digitalWrite(MOTOR_IN2, LOW);
    } else {
      analogWrite(MOTOR_EN, 0);
    }
    // prepare CSV line: t,h,water,dist,motion
    String line = String(t,1) + "," + String(h,1) + "," + String(water) + "," + String(dist) + "," + String(motion);
    Serial.println(line);
  }
}
```

### 3.2 ESP32 network node code

The ESP32 code is similar to Day 28 but extended to handle more sensors and actuators, store threshold values, and publish to MQTT.

Key features:

1. **Wi‑Fi and MQTT setup** using `WiFi.begin` and `client.setServer`【384423720218434†L252-L266】【322305423900976†L263-L266】.
2. **EEPROM storage** for threshold values; the user can update thresholds via the web page and they will persist across power cycles.
3. **Web dashboard** displaying sensor values and forms to set thresholds and toggle devices. Use HTTP POST handlers to parse input.
4. **MQTT publish/subscribe**: publish a JSON string with all sensor values and subscribe to topics like `home/commands/fan` to control the fan. Use a reconnection loop to re‑establish connection if dropped【322305423900976†L338-L342】.

The structure is similar to the code from Day 28; you will need to adapt it to handle additional fields and forms. Remember to feed the ESP32’s watchdog by avoiding long blocking operations.

## 4 – Configuration interface and EEPROM persistence

On the web page, provide input fields to adjust temperature, humidity, water‑level and distance thresholds. When the user clicks “Save,” the ESP32 writes these values to EEPROM and sends them to the Arduino via serial. The Arduino updates its local thresholds and stores them in its own EEPROM. This way, the system remembers your settings after power loss. Use `EEPROM.put()` and `EEPROM.get()` as demonstrated in Day 17 (2 KB on Uno【264402201497082†L95-L100】).

## 5 – Testing the smart home

1. **Integrate the hardware** using proper decoupling and power management.
2. **Upload the Arduino and ESP32 sketches.** Use serial monitors to verify that sensor data flows from Arduino to ESP32.
3. **Open the web interface** at the ESP32’s IP address. Adjust thresholds and observe the fan, servo and pump responding.
4. **Subscribe to MQTT topics** with a dashboard app or MQTT Explorer. Confirm that messages appear when sensors change and that you can control devices by publishing to command topics.
5. **Test reliability:** Remove capacitors or intentionally overload the supply to trigger brownouts【755226503047356†L64-L87】. Observe that adding capacitors prevents resets. Comment out `wdt_reset()` to see the watchdog reset the Arduino【576069459775266†L176-L191】.

## 6 – Safety considerations and best practices

* **Electrical safety:** Avoid working with mains voltage. Use low‑voltage motors and pumps designed for hobby use. Disconnect power when rewiring.
* **Corrosion:** Never fully submerge the water sensor; only the bottom should be immersed, and power it only during measurements【760746864211831†L186-L199】.
* **Network security:** Use unique MQTT topics and, for real deployments, secure your broker with authentication and TLS.
* **Expandability:** This system is a starting point. You can add more sensors (CO₂, light, smoke) or integrate with platforms like Home Assistant. Modular code and configuration storage make it easy to extend.

## Summary

Your Smart Home Demo System brings together all the skills you’ve learned over 30 days. It reads multiple sensors—including the DHT22’s wide temperature and humidity range【860589226677594†L98-L116】, water level output and PIR motion detection【760746864211831†L186-L199】【221133490407826†L219-L240】—and controls actuators via an L293D and servos【613704194224275†L171-L186】. It communicates with the ESP32 over a level‑shifter and sends data to the cloud using Wi‑Fi and MQTT【322305423900976†L263-L266】. Thresholds are stored in EEPROM so the system retains its behaviour after a power cycle. Reliability techniques—decoupling capacitors, proper power wiring and watchdog timers—keep the system running smoothly【755226503047356†L90-L113】【576069459775266†L116-L126】. This capstone project demonstrates how sensors, networking and robust design come together to create a functional smart‑home prototype.