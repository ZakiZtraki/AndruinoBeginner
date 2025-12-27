# Day 25 – MQTT Messaging with ESP32

Welcome to Day 25 of your 30‑day electronics journey.  Building on the network skills you gained in the last two lessons, you’ll learn how to exchange data between your ESP32 and other devices using the **MQTT** protocol.  MQTT (Message Queuing Telemetry Transport) is a lightweight publish/subscribe messaging protocol designed for constrained devices and low‑bandwidth networks.  It excels at sending sensor data or commands between multiple IoT nodes and is widely adopted in smart homes, industrial automation and cloud services.

## Learning objectives

By the end of this lesson you will be able to:

1. Explain how MQTT’s **publish/subscribe** model works and why it’s suitable for IoT devices.
2. Install and use the **PubSubClient** library to connect an ESP32 to an MQTT broker.
3. Write Arduino code that publishes sensor readings and subscribes to control topics using the ESP32’s Wi‑Fi connection.
4. Build a simple IoT project that sends temperature and humidity readings and reacts to remote commands.

## What is MQTT?

MQTT stands for **Message Queuing Telemetry Transport**.  It is a lightweight messaging protocol designed for constrained devices and low‑bandwidth networks.  Communication follows a **publish/subscribe** pattern: devices publish messages to a **topic**, and any devices that are subscribed to that topic will receive those messages.  A central **broker** receives all messages, filters them and distributes them to subscribers.  Topics are case‑sensitive strings separated by slashes (for example, `home/office/lamp`), and you can build hierarchies by adding levels ([MQTT specification](https://mqtt.org/mqtt-specification/)).  MQTT is efficient because messages are small and clients only receive the topics they are interested in.

### Advantages of MQTT on the ESP32

The ESP32 is a dual‑core microcontroller with Wi‑Fi and Bluetooth built‑in, making it ideal for wireless IoT applications.  MQTT is lightweight and optimised for low‑power devices, so it pairs well with the ESP32.  Unlike HTTP, MQTT maintains an open connection to the broker and pushes messages asynchronously, enabling real‑time updates without polling ([MQTT specification](https://mqtt.org/mqtt-specification/)).

## Prerequisites and tools

* **Hardware:** your ESP32 board, a DHT11/DHT22 sensor (from Day 15), a 220 Ω resistor and LED (for feedback), and a few jumper wires.
* **Software:** Arduino IDE with ESP32 board support (installed in Day 22), the **PubSubClient** library ([PubSubClient GitHub](https://github.com/knolleary/pubsubclient)) and the **DHT sensor** library.  You’ll also need access to an MQTT broker.  For local testing you can use [Mosquitto](https://mosquitto.org) on a Raspberry Pi or your computer, or you can use a free cloud broker like *broker.emqx.io* ([EMQX public broker](https://www.emqx.com/en/mqtt/public-mqtt5-broker)), which listens on port 1883 for unencrypted connections ([MQTT specification](https://mqtt.org/mqtt-specification/)).

:::tip
If you haven’t installed the PubSubClient library yet, download the `.zip` file from its GitHub page ([PubSubClient GitHub](https://github.com/knolleary/pubsubclient)), rename the folder to **pubsubclient** and place it in your Arduino IDE libraries folder.  The library provides a client for publish/subscribe messaging and allows your ESP32 to talk with an MQTT broker.
:::

## Installing the PubSubClient library

1. Download the library from its GitHub repository (PubSubClient).  You should get a `.zip` folder.
2. Unzip the folder and rename it to **pubsubclient**.
3. Move the folder to the Arduino `libraries` directory and restart the Arduino IDE.  You can also install it via the **Library Manager**.

After installation, the library examples will be available under **File → Examples → PubSubClient**.  We will build on one of these examples in this lesson.

Source: [PubSubClient GitHub](https://github.com/knolleary/pubsubclient).

## Setting up Wi‑Fi and the MQTT client

To connect your ESP32 to a broker you first need to connect it to Wi‑Fi.  Reuse the Wi‑Fi setup function from Day 22:

```cpp
#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>

const char* ssid = "YOUR_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* mqtt_server = "YOUR_MQTT_BROKER_IP";    // e.g. 192.168.1.100 or broker.emqx.io

WiFiClient espClient;
PubSubClient client(espClient);

void setupWifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

void setup() {
  Serial.begin(115200);
  setupWifi();
  // Configure the MQTT server and register a callback
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback); // defined later
}
```

* `client.setServer(broker, port)` tells the client which broker and port (1883 is the default) to connect to ([MQTT specification](https://mqtt.org/mqtt-specification/)).
* `client.setCallback(callback)` registers a function that will run every time a subscribed message arrives.

Source: [PubSubClient API](https://pubsubclient.knolleary.net/api).

### Handling MQTT reconnection

MQTT clients should attempt to reconnect if the connection is lost.  The `reconnect()` function in the example loops until the client connects and then subscribes to the desired topics:

```cpp
void reconnect() {
  // Loop until we’re reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Create a unique client ID using the MAC address
    String clientId = "esp32-client-";
    clientId += String(WiFi.macAddress());
    // Attempt to connect (optionally pass username and password)
    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
      // Subscribe to the control topic after connecting
      client.subscribe("home/office/command");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" – trying again in 5 seconds");
      delay(5000);
    }
  }
}

void loop() {
  // Ensure we stay connected
  if (!client.connected()) {
    reconnect();
  }
  client.loop(); // processes incoming messages and maintains the connection
  // ... publish sensor data at intervals (see below)
}
```

Here we generate a unique client ID using the ESP32’s MAC address so that multiple devices can connect to the same broker without collision.  The `client.loop()` call must run frequently to keep the connection alive and to trigger the callback function when a new message arrives ([PubSubClient API](https://pubsubclient.knolleary.net/api)).

## Publishing sensor readings

Let’s publish temperature and humidity from a DHT22 sensor every 5 seconds.  Readings are floats, so they need to be converted to strings before publishing.  We also toggle the LED on to indicate a message was sent.

```cpp
#define DHTPIN 23       // use a safe GPIO for the data pin (e.g. GPIO23)
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);
unsigned long lastPublish = 0;

void setup() {
  // previous setup code
  dht.begin();
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  if (!client.connected()) reconnect();
  client.loop();
  unsigned long now = millis();
  if (now - lastPublish > 5000) {
    lastPublish = now;
    // Read temperature and humidity
    float temperature = dht.readTemperature();
    float humidity    = dht.readHumidity();
    // Convert to strings (dtostrf converts float to char array)
    char tempStr[8];
    dtostrf(temperature, 1, 2, tempStr);
    char humStr[8];
    dtostrf(humidity, 1, 2, humStr);
    // Publish to topics
    client.publish("home/office/temperature", tempStr);
    client.publish("home/office/humidity", humStr);
    digitalWrite(LED_BUILTIN, !digitalRead(LED_BUILTIN));
  }
}
```

The same method applies for the DHT sensor: read the values, convert them with `dtostrf()`, and publish to your chosen topics using `client.publish()` ([PubSubClient API](https://pubsubclient.knolleary.net/api)).

## Subscribing to control commands

When a message arrives on a subscribed topic, the callback function runs.  In this example we listen for messages on `home/office/command` and turn the LED on or off depending on the message content:

```cpp
void callback(char* topic, byte* message, unsigned int length) {
  Serial.print("Message arrived on topic: ");
  Serial.println(topic);
  String msg;
  for (unsigned int i = 0; i < length; i++) {
    msg += (char)message[i];
  }
  if (String(topic) == "home/office/command") {
    if (msg == "on") {
      digitalWrite(LED_BUILTIN, HIGH);
    } else if (msg == "off") {
      digitalWrite(LED_BUILTIN, LOW);
    }
  }
}
```

Use the same pattern for your own topics and messages.  Topics are case‑sensitive and must match exactly ([MQTT specification](https://mqtt.org/mqtt-specification/)).

## Putting it all together – Smart Climate Monitor

Combine the publish and subscribe functions to create a **Smart Climate Monitor**:

1. **Publish**: Send temperature and humidity readings every 5 seconds on topics like `home/office/temperature` and `home/office/humidity`.  Update the LED each time you publish to indicate activity.
2. **Subscribe**: Listen for control commands on `home/office/command`.  When a message of “on” or “off” arrives, turn a fan (or an LED) on or off accordingly.
3. **Broker & client**: Set up a free broker (e.g. `broker.emqx.io` on port 1883) or run Mosquitto on your local network.  Use an MQTT dashboard app or Node‑RED to monitor readings and send commands.
4. **Deployment**: Once your ESP32 is publishing and subscribing reliably, power it from a stable source and position the DHT sensor where you want to monitor conditions.

### Challenge – remote servo control

As an extension, publish the current servo position (from Day 12) on a topic such as `home/office/servoPos` and subscribe to `home/office/servoTarget`.  When a new target angle arrives, move the servo to that angle.  Remember to power your servo from 5 V and avoid drawing servo current from the ESP32’s 3.3 V rail ([Hobby servo guide](https://learn.sparkfun.com/tutorials/hobby-servo-tutorial/all)).  The MQTT loop should still call `client.loop()` frequently to maintain connectivity.

## Troubleshooting and best practices

- **Unique client ID**: Use a unique ID for each device.  The example concatenates the MAC address to avoid collisions.
- **Call `client.loop()` frequently**: The `loop()` function processes incoming messages and keeps the connection alive.  Avoid long blocking delays that prevent it from running ([PubSubClient API](https://pubsubclient.knolleary.net/api)).
- **Broker credentials**: Many public brokers allow anonymous connections; some require a username/password.  Pass these to `client.connect(clientId, user, password)` ([PubSubClient API](https://pubsubclient.knolleary.net/api)).
- **Port selection**: Port 1883 is standard for unencrypted MQTT, while 8883 is used for TLS/SSL connections ([MQTT specification](https://mqtt.org/mqtt-specification/)).
- **Sensors and Wi‑Fi**: On ESP32, avoid using ADC2 pins when Wi‑Fi is active, because Wi‑Fi uses the same hardware (see Day 23 for details).
- **QoS and retained messages**: PubSubClient supports QoS 0 and 1.  For simple telemetry, QoS 0 is fine; for commands you may want QoS 1.  Retained messages make the broker store the last message on a topic so new subscribers receive it immediately ([PubSubClient API](https://pubsubclient.knolleary.net/api), [MQTT specification](https://mqtt.org/mqtt-specification/)).

## Going further

- **Secure connections**: Use `WiFiClientSecure` and connect to the broker on port 8883 with TLS certificates.  This encrypts traffic between your ESP32 and the broker.
- **Node‑RED dashboard**: Create a user interface with charts and switches to display sensor data and control your device.  Node‑RED can subscribe and publish to the same topics.
- **Async MQTT**: The PubSubClient library is simple but blocks the loop during connection attempts.  Libraries like **AsyncMQTT** avoid blocking and integrate with the ESP32’s event loop; you can explore them after mastering the basics.

## Summary

In this lesson you learned that MQTT is a lightweight publish/subscribe protocol perfect for exchanging data between IoT devices.  You installed the PubSubClient library, connected your ESP32 to a Wi‑Fi network and an MQTT broker, published sensor readings and reacted to remote commands.  By combining these features you created a smart climate monitor that can be controlled remotely.  With MQTT, your projects can scale to multiple devices and integrate with dashboards, databases and cloud services.  In the next lesson we’ll explore asynchronous servers and more advanced networking features to further expand your IoT toolbox.
