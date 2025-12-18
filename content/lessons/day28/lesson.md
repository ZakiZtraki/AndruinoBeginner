# Day 28 – Hybrid Arduino–ESP32 System Build

## Learning objectives

1. **Integrate an Arduino Uno and an ESP32 into a single system** where each board performs the tasks it does best.
2. **Read multiple sensors on the Arduino** and transmit their data to the ESP32 via UART using a safe voltage‑shifting interface【27998646467289†L174-L176】.
3. **Serve the sensor data on a web page and publish it via MQTT** using the ESP32’s networking capabilities【384423720218434†L252-L266】【61989259962504†L39-L47】.
4. **Control actuators on the Arduino** from the web or MQTT by sending commands from the ESP32 back over the serial link.
5. **Debug and expand the hybrid system**, including adding more sensors and adding persistent settings in EEPROM.

## Introduction

Up to this point you’ve learned how to use the Arduino Uno to handle sensors and actuators (Days 1–21) and how to leverage the ESP32 for Wi‑Fi, web servers, and MQTT (Days 22–25). In this lesson you will combine the two into a cohesive “hybrid” system: the Arduino will read sensors and control 5 V devices, while the ESP32 will display and publish the data and receive control commands from a web page or MQTT broker.

Connecting two different microcontrollers requires careful attention to voltage levels: the Uno uses 5 V logic and the ESP32 is 3.3 V‑only. As explained earlier, you must use a bidirectional level‑shifting circuit. A logic level converter has separate high‑voltage (HV) and low‑voltage (LV) pins; **power the HV side at 5 V and the LV side at 3.3 V**【27998646467289†L174-L176】. You then route the Uno’s TX through a channel to drop it to 3.3 V before it reaches the ESP32, while the ESP32’s TX can be connected directly to the Uno’s RX because 3.3 V is seen as a logic high by the Uno【223525860026786†L170-L176】.

In this project the Arduino continuously reads a DHT22 temperature/humidity sensor【860589226677594†L98-L116】, a resistive water‑level sensor【760746864211831†L124-L154】 and a PIR motion sensor【221133490407826†L219-L223】. It packages these values into a comma‑separated string and sends them to the ESP32 via serial. The ESP32 connects to your Wi‑Fi network, hosts a simple HTTP server and an MQTT client. It parses the incoming serial message, updates the web page and publishes the values to MQTT topics. It also listens for commands via HTTP form submission or MQTT subscription to turn a relay or servo on the Arduino on or off.

## Prerequisites and tools

* Hardware: Arduino Uno, ESP32 development board, logic‑level converter or resistor divider, DHT22 sensor, water level sensor module, PIR sensor, relay module or servo (optional), breadboard, jumper wires.
* Software: Arduino IDE with ESP32 support installed (Day 22), PubSubClient library (Day 25), your Wi‑Fi credentials and MQTT broker address (you can use public test brokers like `broker.hivemq.com`).
* A computer with USB ports to program both boards.

## 1 – Wiring the hybrid system

### 1.1 Sensor connections on the Arduino

1. **DHT22**: Connect its VCC to 5 V, GND to GND, and Data to digital pin 7. Add a 10 kΩ pull‑up resistor between Data and VCC as recommended for reliable reading【860589226677594†L180-L214】.
2. **Water level sensor**: Use the resistive sensor module. Its analog output varies with immersion; connect `AO` to A0 on the Uno. To reduce corrosion, power the sensor via an Arduino digital pin (set it HIGH only when taking a reading)【760746864211831†L186-L199】.
3. **PIR sensor**: Connect VCC to 5 V, GND to GND and `OUT` to digital pin 8. Adjust sensitivity and delay as described previously【221133490407826†L219-L240】.
4. **Optional actuator**: Connect a relay module or a servo to digital pin 9. If using a servo, power it from the 5 V rail and remember that it can draw 100–250 mA when moving【335603732100712†L246-L249】.

### 1.2 Serial link between Uno and ESP32

1. Connect the Uno’s **TX** pin (digital 1, or the TX pin of your `SoftwareSerial`) to a **level‑shifter HV → LV channel**. Connect the corresponding LV pin to the ESP32’s RX pin (e.g., GPIO 16). Power the level shifter’s HV pins with 5 V and its LV pins with 3.3 V【27998646467289†L174-L176】.
2. Connect the ESP32’s **TX** pin (GPIO 17) directly to the Uno’s RX pin (digital 0 or your `SoftwareSerial` RX pin). The Uno accepts 3.3 V as HIGH【223525860026786†L170-L176】.
3. Connect the grounds of both boards together.

### 1.3 ESP32 network and MQTT wiring

The ESP32 will use its built‑in Wi‑Fi. If you haven’t already, connect it to your router using `WiFi.begin(ssid, password)` and wait for `WiFi.status()` to be `WL_CONNECTED`【384423720218434†L252-L266】. Install the PubSubClient library as described on Day 25【322305423900976†L154-L170】. Ensure the ESP32’s 3.3 V regulator can deliver enough current (~250 mA during Wi‑Fi transmissions)【974180875509381†L464-L468】; power it via USB or a stable 5 V source.

## 2 – Programming the Arduino (sensor node)

The Arduino reads the sensors and sends a comma‑separated message to the ESP32 every few seconds. It also listens for commands from the ESP32 to control the relay/servo.

```cpp
#include <DHT.h>

// Pin assignments
const uint8_t DHT_PIN = 7;
const uint8_t WATER_POWER_PIN = 6; // power for water sensor
const uint8_t WATER_ANALOG_PIN = A0;
const uint8_t PIR_PIN = 8;
const uint8_t ACTUATOR_PIN = 9;

// Initialise DHT (type DHT22)
DHT dht(DHT_PIN, DHT22);

void setup() {
  Serial.begin(9600);
  pinMode(WATER_POWER_PIN, OUTPUT);
  digitalWrite(WATER_POWER_PIN, LOW);
  pinMode(PIR_PIN, INPUT);
  pinMode(ACTUATOR_PIN, OUTPUT);
  dht.begin();
}

// Helper to read water level as percentage
int readWaterLevel() {
  digitalWrite(WATER_POWER_PIN, HIGH);       // power the sensor
  delay(10);
  int raw = analogRead(WATER_ANALOG_PIN);
  digitalWrite(WATER_POWER_PIN, LOW);        // power off to reduce corrosion【760746864211831†L186-L199】
  // map raw (0–1023) to 0–100%
  return map(constrain(raw, 200, 800), 200, 800, 0, 100);
}

void loop() {
  // Read sensors
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  int waterPct = readWaterLevel();
  int motion = digitalRead(PIR_PIN);

  // Package data: temp,humidity,water,motion
  String payload = String(temperature, 1) + "," + String(humidity, 1) + "," + String(waterPct) + "," + String(motion);
  Serial.println(payload); // send to ESP32

  // Check for commands from ESP32
  if (Serial.available()) {
    char cmd = Serial.read();
    if (cmd == 'R') { // toggle relay/servo
      digitalWrite(ACTUATOR_PIN, !digitalRead(ACTUATOR_PIN));
    }
  }

  delay(2000);
}
```

This sketch powers the water sensor only when reading it【760746864211831†L186-L199】, reads the DHT22 and PIR sensors, and prints values separated by commas. It also listens for a single‑character command (‘R’) to toggle an actuator. You can expand the protocol by sending more complex commands or using delimiters and checksums for reliability.

## 3 – Programming the ESP32 (network node)

The ESP32 code must:

1. Connect to Wi‑Fi and MQTT.
2. Open a serial port on `Serial2` to communicate with the Arduino.
3. Parse incoming data and update global variables.
4. Serve a web page that displays the latest sensor values and a button to toggle the actuator.
5. Publish sensor data to MQTT topics and subscribe to a control topic.

### 3.1 Setup and global variables

```cpp
#include <WiFi.h>
#include <WebServer.h>
#include <PubSubClient.h>

// Wi‑Fi credentials
const char* ssid = "YOUR_SSID";
const char* password = "YOUR_PASSWORD";

// MQTT broker settings
const char* mqtt_server = "broker.hivemq.com";
const int   mqtt_port   = 1883;
const char* mqtt_pub_topic = "hybrid/sensors";
const char* mqtt_cmd_topic = "hybrid/cmd";

// Serial interface to Arduino
HardwareSerial arduinoSerial(2); // Serial2 on pins 16 (RX) and 17 (TX)

// Sensor values
float temperature = 0;
float humidity    = 0;
int waterLevel    = 0;
bool motion       = false;
bool actuatorState = false;

WiFiClient espClient;
PubSubClient client(espClient);
WebServer server(80);

// Forward declarations
void handleRoot();
void handleToggle();
void reconnectMQTT();
void parseSensorLine(const String& line);
```

### 3.2 Connecting to Wi‑Fi and MQTT

```cpp
void setup() {
  Serial.begin(115200);
  arduinoSerial.begin(9600, SERIAL_8N1, 16, 17);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected to WiFi");

  client.setServer(mqtt_server, mqtt_port);        // set broker address【322305423900976†L263-L266】
  client.setCallback([](char* topic, byte* payload, unsigned int length) {
    // When a message arrives on the cmd topic, parse the first char
    if (String(topic) == mqtt_cmd_topic && length >= 1) {
      if (payload[0] == 'R') {
        // send command to Arduino
        arduinoSerial.write('R');
      }
    }
  });

  // Web handlers
  server.on("/", handleRoot);
  server.on("/toggle", handleToggle);
  server.begin();
}

void loop() {
  // Maintain MQTT connection
  if (!client.connected()) reconnectMQTT();
  client.loop();
  server.handleClient();

  // Read data from Arduino
  if (arduinoSerial.available()) {
    String line = arduinoSerial.readStringUntil('\n');
    parseSensorLine(line);
    // Publish to MQTT【322305423900976†L344-L369】
    String json = String("{\"temp\":") + temperature + ",\"hum\":" + humidity + ",\"water\":" + waterLevel + ",\"motion\":" + (motion ? 1 : 0) + ",\"state\":" + (actuatorState ? 1 : 0) + "}";
    client.publish(mqtt_pub_topic, json.c_str());
  }
}

void reconnectMQTT() {
  // Loop until reconnected【322305423900976†L338-L342】
  while (!client.connected()) {
    String clientId = "ESP32Hybrid-" + String(random(0xffff), HEX);
    if (client.connect(clientId.c_str())) {
      client.subscribe(mqtt_cmd_topic);
    } else {
      delay(2000);
    }
  }
}
```

### 3.3 Parsing sensor data and serving web pages

```cpp
void parseSensorLine(const String& line) {
  // Expecting temp,humidity,water,motion
  int idx1 = line.indexOf(',');
  int idx2 = line.indexOf(',', idx1 + 1);
  int idx3 = line.indexOf(',', idx2 + 1);
  if (idx1 > 0 && idx2 > idx1 && idx3 > idx2) {
    temperature = line.substring(0, idx1).toFloat();
    humidity    = line.substring(idx1 + 1, idx2).toFloat();
    waterLevel  = line.substring(idx2 + 1, idx3).toInt();
    motion      = line.substring(idx3 + 1).toInt() == 1;
  }
}

void handleRoot() {
  String page = "<html><body><h2>Hybrid Sensor Dashboard</h2>";
  page += "<p>Temperature: " + String(temperature, 1) + " °C</p>";
  page += "<p>Humidity: " + String(humidity, 1) + " %</p>";
  page += "<p>Water level: " + String(waterLevel) + " %</p>";
  page += "<p>Motion detected: " + String(motion ? "Yes" : "No") + "</p>";
  page += "<p>Actuator state: " + String(actuatorState ? "ON" : "OFF") + "</p>";
  page += "<a href='/toggle'>Toggle actuator</a>";
  page += "</body></html>";
  server.send(200, "text/html", page);
}

void handleToggle() {
  // Toggle state and notify Arduino
  actuatorState = !actuatorState;
  arduinoSerial.write('R');
  server.sendHeader("Location", "/"); // redirect back to root
  server.send(303);
}
```

This code connects to Wi‑Fi and MQTT, reads lines from the Arduino, and updates variables. It publishes a JSON string containing all sensor readings to the `hybrid/sensors` topic and listens for commands on the `hybrid/cmd` topic【322305423900976†L303-L316】. The web server presents a simple dashboard and a link to toggle the actuator. You can enhance the interface with CSS or JavaScript for auto‑refresh.

## 4 – Testing and verification

1. **Program the Arduino and ESP32** using the sketches above. Ensure the Arduino starts sending data on the serial link.
2. **Open two serial monitors**—one for the Arduino and one for the ESP32. You should see the Arduino printing comma‑separated values and the ESP32 printing parsed data and MQTT connection status.
3. **Access the web dashboard** by navigating to the ESP32’s IP address in your browser. You should see live sensor data updating (refresh the page manually; for automatic refresh you could use meta refresh tags or JavaScript).
4. **Subscribe to MQTT topics** using a tool like MQTT Explorer. You should see JSON messages published to `hybrid/sensors` and you can send a message with payload `R` to `hybrid/cmd` to toggle the actuator.
5. **Verify the actuator** toggles when you click the link on the web page or publish the command over MQTT. The Arduino should respond immediately.

## Troubleshooting

* **No serial communication** – Check that TX/RX lines are crossed and that the level converter is powered properly. Ensure both boards use the same baud rate and that you’re not sending newline characters from one board and expecting them on the other【784312248889863†L363-L368】.
* **Incorrect sensor values** – Confirm wiring and calibrate sensor ranges. DHT22 should return values within –40 to 125 °C and 0 to 100 % RH【860589226677594†L98-L116】. Water sensor readings depend on your calibration; adjust the mapping in the Arduino sketch.
* **ESP32 doesn’t connect to Wi‑Fi** – Verify SSID/password and that your router is within range. The code waits until `WiFi.status()` returns `WL_CONNECTED`【384423720218434†L252-L266】.
* **MQTT problems** – Ensure the broker address is reachable and that the port is open. Use a unique client ID and check the reconnection loop【322305423900976†L338-L342】.
* **Web page not updating** – Remember that this simple server doesn’t auto‑refresh; refresh the page or add JavaScript to poll the server.

## Extensions and ideas

* **Add EEPROM settings**: Store user‑defined thresholds or the actuator state in Arduino EEPROM (Day 17) so the system remembers its last state after power loss.
* **Expand the web interface**: Use HTML forms to set thresholds for temperature, humidity or water level and send them to the Arduino via serial or MQTT. Add CSS for better aesthetics.
* **Use I²C instead of UART**: Build on the I²C example from Day 27 to transfer sensor data and commands. Remember to use a bidirectional level converter and assign unique addresses.
* **Add secure transport**: Use MQTT over TLS and add authentication; use the ESP32’s asynchronous web server library to handle multiple clients.

## Summary

In this hybrid project you built a two‑board system that combines the sensor‑handling strengths of the Arduino with the networking abilities of the ESP32. The Uno reads a DHT22, a water level sensor and a PIR sensor, powers the water sensor only when needed to reduce corrosion【760746864211831†L186-L199】 and packages the results into a serial message. A level‑shifter ensures that the 5 V serial output is safely dropped to 3.3 V before reaching the ESP32【27998646467289†L174-L176】, while the ESP32’s 3.3 V TX line can drive the Uno directly【223525860026786†L170-L176】. The ESP32 connects to Wi‑Fi, runs a web server and an MQTT client, parses incoming data and publishes it as JSON. A simple dashboard displays live values and toggles an actuator. This foundation can be expanded with more sensors, persistent settings and secure communication, demonstrating how two microcontrollers can collaborate to build robust IoT systems.