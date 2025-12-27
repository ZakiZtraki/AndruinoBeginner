# Day 24 – ESP32 Web Server Introduction

In the previous lesson you learned how to use the ESP32’s GPIO pins.  Today you’ll leverage its built‑in Wi‑Fi to **host a simple web page**, allowing you to monitor sensors and control outputs from any device on your local network.  We’ll set up the ESP32 as a web server in **station (STA) mode**, connect it to your router, and serve a dynamic page that displays real‑time sensor data and lets you toggle an LED.

## Learning objectives

By the end of this lesson you will be able to:

1. Connect an ESP32 to a Wi‑Fi network using `WiFi.begin()` and wait for a successful connection.
2. Create an HTTP server with the `WebServer` class, define request handlers and start listening on port 80.
3. Serve a basic HTML page and update it with sensor readings and button states.
4. Control an LED via URL commands (e.g., `/led/on` and `/led/off`).
5. Understand the difference between station and access‑point modes.

## Materials

- ESP32 DevKit V1 or NodeMCU‑32S board
- Breadboard, LED and 330 Ω resistor
- DHT22 or photoresistor circuit from previous lessons (optional)
- USB cable and computer with Arduino IDE

## 1. Wi‑Fi operating modes

The ESP32 can operate in three Wi‑Fi modes:

- **Station (STA) mode** – the ESP32 connects to your existing router like a phone or laptop.
- **Access Point (AP) mode** – the ESP32 creates its own Wi‑Fi network and acts as a hotspot.  This is useful when there is no router available.
- **Dual (AP+STA) mode** – the ESP32 can act as an access point while also connecting to another network.

In this lesson we’ll use **station mode**, which allows any device on your local network to access the ESP32’s web page through its IP address.

Source: [Arduino‑ESP32 WiFi class](https://docs.espressif.com/projects/arduino-esp32/en/latest/api/wifi.html).

## 2. Connecting to Wi‑Fi

First, include the Wi‑Fi and WebServer libraries and define your network credentials:

```cpp
#include <WiFi.h>
#include <WebServer.h>

const char* ssid = "YOUR_SSID";
const char* password = "YOUR_PASSWORD";

WebServer server(80); // HTTP server on port 80

void setup() {
  Serial.begin(115200);
  delay(100);

  Serial.print("Connecting to ");
  Serial.println(ssid);

  // Connect to Wi-Fi network
  WiFi.begin(ssid, password);                   // start connection
  while (WiFi.status() != WL_CONNECTED) {       // wait until connected
    delay(1000);
    Serial.print(".");
  }
  Serial.println();
  Serial.println("WiFi connected..!");
  Serial.print("Got IP: ");
  Serial.println(WiFi.localIP());               // print the assigned IP

  // Define request handlers (we’ll create these functions later)
  server.on("/", handleRoot);
  server.on("/led/on", handleLedOn);
  server.on("/led/off", handleLedOff);
  server.onNotFound(handleNotFound);
  
  server.begin();                               // start the HTTP server
  Serial.println("HTTP server started");
}
```

This code connects the ESP32 to your Wi‑Fi network using `WiFi.begin(ssid, password)` and waits until the status becomes `WL_CONNECTED`.  It then prints the IP address assigned by your router using `WiFi.localIP()` and registers handlers for different URL paths (`/`, `/led/on`, `/led/off`).  The server listens on port 80.

Source: [Arduino‑ESP32 WiFi class](https://docs.espressif.com/projects/arduino-esp32/en/latest/api/wifi.html), [Arduino‑ESP32 WebServer](https://docs.espressif.com/projects/arduino-esp32/en/latest/api/webserver.html).

## 3. Serving a web page

When a client (browser) visits a URL, the web server calls the corresponding handler function.  The root handler returns an HTML page with links to turn the LED on and off.  The LED handlers toggle the LED state and redirect back to the main page.

```cpp
const int ledPin = 16;      // safe GPIO used for LED
bool ledState    = false;

void handleRoot() {
  String html = "<!DOCTYPE html><html><head><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">";
  html += "<title>ESP32 Web Server</title></head><body>";
  html += "<h1>ESP32 Web Server</h1>";
  html += "<p>LED is currently <strong>" + String(ledState ? "ON" : "OFF") + "</strong></p>";
  html += "<p><a href=\"/led/on\"><button>ON</button></a>";
  html += "<a href=\"/led/off\"><button>OFF</button></a></p>";
  html += "</body></html>";
  server.send(200, "text/html", html);
}

void handleLedOn() {
  digitalWrite(ledPin, HIGH);
  ledState = true;
  server.sendHeader("Location", "/");
  server.send(303);
}

void handleLedOff() {
  digitalWrite(ledPin, LOW);
  ledState = false;
  server.sendHeader("Location", "/");
  server.send(303);
}

void handleNotFound() {
  server.send(404, "text/plain", "Not found");
}

void setup() {
  // existing Wi-Fi connection code...
  pinMode(ledPin, OUTPUT);
  // handlers and server begin as shown earlier
}

void loop() {
  server.handleClient();  // process incoming HTTP requests
}
```

When you open the ESP32’s IP address in your browser, it serves a page with the LED’s current state and two buttons.  Clicking the ON or OFF button triggers a **HTTP GET** request to `/led/on` or `/led/off`; the handler functions set the GPIO level and send a 303 redirect back to `/`, keeping the user interface simple.  You can expand this page to include sensor values or other controls.

### Adding sensor data

To display the DHT22’s temperature and humidity from Day 15, read the sensor in `handleRoot()` and insert the values into the HTML string.  Keep in mind that the DHT22 has a **slow sample rate (0.5 Hz)**—readings should be taken no more than once every 2 seconds ([Adafruit DHT guide](https://learn.adafruit.com/dht)).  For faster sensors, like a photoresistor, you can update the values on each page load or use AJAX for dynamic updates.

## 4. Access Point mode (optional)

If your ESP32 needs to serve a page without an existing router (e.g., at a workshop), use **AP mode**.  In this mode, the ESP32 creates its own Wi‑Fi network with a configurable SSID and password.  Devices connect directly to it and access the web page.  Use `WiFi.softAP(ssid_AP, password_AP)` to start an access point and `WiFi.softAPIP()` to get its IP address ([Arduino‑ESP32 WiFi class](https://docs.espressif.com/projects/arduino-esp32/en/latest/api/wifi.html)).

## 5. Security considerations

While this example runs on a local network, it’s important to consider security if you plan to expose the ESP32 to the internet.  Use strong passwords, HTTPS via an external proxy, and sanitise user input.  Avoid leaving the ESP32 in AP mode with default credentials.

## 6. Troubleshooting

| Issue | Possible cause | Fix |
|---|---|---|
| The Serial Monitor shows `WL_CONNECT_FAILED` or never connects | Wrong SSID/password or router out of range | Double‑check your credentials and ensure the ESP32 is within Wi‑Fi coverage. |
| `server.handleClient()` returns nothing | Handlers not registered or server not started | Ensure `server.on()` and `server.begin()` are called in `setup()`. |
| Browser shows “Not found” | You typed an invalid URL | Use the exact paths defined (`/`, `/led/on`, `/led/off`); unknown paths trigger `handleNotFound()`. |
| IP address changes after reboot | DHCP assigned a new address | Assign a static IP using `WiFi.config()` or use mDNS for name resolution. |
| Page loads slowly or freezes sensor readings | Slow sensor sampling or blocking code | Read sensors less often (DHT22 ≤ 0.5 Hz); avoid `delay()` in handlers ([Adafruit DHT guide](https://learn.adafruit.com/dht)). |

## 7. Going further

* Create a **dashboard** that displays values from multiple sensors (temperature, humidity, light, water level) in a table.  Use AJAX to refresh only the sensor data without reloading the entire page.
* Use **mDNS** (`ESPmDNS.h`) to access the server at `http://esp32.local/` instead of typing the IP address.
* Implement **SSL/TLS** via an HTTPS proxy or ESP32’s `WiFiClientSecure` for secure connections.
* Explore the **AsyncWebServer** library for non‑blocking web servers and WebSockets.
* Combine web server and **EEPROM** to allow configuration of thresholds via the browser and store them persistently.

## Key takeaways

* The ESP32 can serve dynamic web pages by operating as a web server in station or access‑point mode.
* Use `WiFi.begin(ssid, password)` and wait for `WL_CONNECTED` to connect to your network.
* Create a `WebServer` object, register URL handlers, and call `server.handleClient()` in the loop.
* Serve HTML strings containing sensor readings and control links, and use URL paths to trigger actions like turning LEDs on or off.
* Observe sensor sample rates (e.g., DHT22’s 0.5 Hz limit) to avoid blocking the server ([Adafruit DHT guide](https://learn.adafruit.com/dht)).

In the next lesson, we will learn how to send sensor data to cloud services using MQTT.
