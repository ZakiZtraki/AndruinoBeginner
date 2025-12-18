# Day 27 – Communication Between Arduino and ESP32

## Learning objectives

By the end of this lesson you will be able to:

1. **Explain the differences between asynchronous UART (serial) and synchronous I²C** communication protocols and when to use each one.
2. **Safely wire a 5 V Arduino Uno and a 3.3 V ESP32 together** using a level‑shifting circuit or voltage divider and understand why it is required.
3. **Send and receive messages over UART** between the two boards, using the appropriate pins and baud rate, and handle two‑way communication.
4. **Understand how to connect the boards via I²C** and appreciate the additional considerations (pull‑up resistors, addressing and voltage conversion) even if a full example is deferred to later.

## Background

The Arduino Uno and ESP32 are complementary microcontrollers. The Uno excels at driving 5 V peripherals and quickly prototyping simple circuits, while the ESP32 brings Wi‑Fi/Bluetooth connectivity and greater processing power. Combining them lets you offload sensor reading or network tasks between boards. To exchange data you need a communication protocol.

Two common options are:

* **UART (Universal Asynchronous Receiver‑Transmitter)** – also called “serial”. It uses a TX (transmit) line, an RX (receive) line and a common ground. Devices agree on a baud rate but don’t share a clock. UART is easy to implement and perfect for streaming ASCII or binary data. When connecting two boards, **the TX of one must go to the RX of the other, and the grounds must be connected**【784312248889863†L363-L368】.
* **I²C (Inter‑Integrated Circuit)** – a synchronous bus that uses open‑drain SDA (data) and SCL (clock) lines pulled up by resistors. Multiple devices share the same two wires; each device has a 7‑bit address and the controller (master) initiates communication. **Mixing 5 V and 3.3 V devices on the same I²C bus requires a bidirectional level converter**, because the SDA and SCL lines are pulled up to a specific voltage and data flows both ways【899373012121875†L134-L146】.

### Voltage considerations

The Uno’s I/O pins operate at 5 V, whereas the ESP32’s pins run at 3.3 V. Driving the ESP32’s pins with 5 V will damage them. A bi‑directional logic‑level converter (for example the SparkFun BSS138‑based board) provides separate high‑voltage (HV) and low‑voltage (LV) supplies. When interfacing a 5 V device to a 3.3 V device you **power the HV side with 5 V and the LV side with 3.3 V**【27998646467289†L174-L176】. The converter has independent channels; a signal applied to the low side is shifted up to the high side and vice versa【27998646467289†L185-L187】. Without a dedicated converter you can also build a one‑directional voltage divider to drop the Arduino’s TX signal – Random Nerd Tutorials uses a 2 kΩ/1 kΩ divider to step 5 V down to 3.3 V【223525860026786†L170-L176】. Going the other direction is usually safe because the Uno recognises 3.3 V as a logic high.

For I²C, the SDA and SCL lines are open‑drain outputs that require pull‑up resistors to the supply voltage. Typical values are **4.7 kΩ – 10 kΩ**【899373012121875†L134-L136】. When mixing 5 V and 3.3 V devices you **must place the level converter between the two sets of pull‑ups**【899373012121875†L134-L145】.

## Materials

* Arduino Uno (5 V microcontroller)
* ESP32 development board
* Bi‑directional logic level converter or a 2 kΩ and 1 kΩ resistor for a simple voltage divider
* Breadboard and jumper wires
* Optional: sensors (e.g., temperature, light) to send from one board to the other

## Part 1 – UART communication

### Wiring the boards

1. **Power and ground**: Connect the Uno’s GND to the ESP32’s GND. Provide 5 V to the HV pin and 3.3 V to the LV pin of the level converter.
2. **Transmit from Uno to ESP32**: On the Uno, choose the pin that will transmit data. If you don’t need the Serial Monitor on the Uno, you can use its hardware `Serial` on pins 0 (RX) and 1 (TX). Otherwise, use the `SoftwareSerial` library on two other pins (e.g., 2 = RX and 3 = TX). Connect the Uno’s TX pin to **HV1** of the level converter, and connect **LV1** to the ESP32’s RX pin (e.g., GPIO16). The converter drops the 5 V TX signal down to 3.3 V.
3. **Transmit from ESP32 to Uno**: Connect the ESP32’s TX pin (e.g., GPIO17) directly to the Uno’s RX pin. The ESP32 outputs 3.3 V which the Uno reads as a logic “1”, so no level shifting is needed in this direction. If you want the Uno to use `SoftwareSerial`, connect GPIO17 to the chosen RX pin (e.g., pin 2).
4. **Verify connections**: Remember to **cross the TX and RX lines**—**TX of one board goes to RX of the other**, and the grounds must be connected【784312248889863†L363-L368】. If you choose other pins on the ESP32, define them when calling `HardwareSerial.begin()`.

### Example 1 – One‑way communication (Uno → ESP32)

Use this sketch on your Arduino Uno to send a counter every second at 9600 baud:

```cpp
// Arduino Uno: send a counter over Serial or SoftwareSerial
#define USE_SOFTWARE_SERIAL true
// If true we use SoftwareSerial on pins 2 (RX) and 3 (TX).
#include <SoftwareSerial.h>

#if USE_SOFTWARE_SERIAL
const uint8_t RX_PIN = 2;
const uint8_t TX_PIN = 3;
SoftwareSerial extSerial(RX_PIN, TX_PIN);
#endif

void setup() {
  Serial.begin(9600);        // still allow Serial Monitor for debugging
  #if USE_SOFTWARE_SERIAL
  extSerial.begin(9600);
  #else
  Serial.println(F("Using hardware serial on pins 0/1"));
  #endif
}

void loop() {
  static int counter = 0;
  String message = String(counter);
  #if USE_SOFTWARE_SERIAL
    extSerial.println(message);
  #else
    Serial.println(message); // will go out on hardware TX pin
  #endif
  Serial.println("Sent: " + message);
  counter++;
  delay(1000);
}
```

Upload the following sketch to the ESP32. It uses UART2 (Serial2) with pins 16 (RX) and 17 (TX) at 9600 baud to read and print incoming data. We specify the pins when we call `Serial2.begin()`:

```cpp
// ESP32: receive data from Arduino Uno and echo back
HardwareSerial extSerial(2); // UART2

void setup() {
  Serial.begin(115200);
  extSerial.begin(9600, SERIAL_8N1, /*RX=*/16, /*TX=*/17);
  Serial.println("ESP32 ready to receive data");
}

void loop() {
  if (extSerial.available()) {
    String message = extSerial.readStringUntil('\n');
    Serial.println("Received from Uno: " + message);
    // Echo back the message with acknowledgement
    extSerial.println("ACK:" + message);
  }
  // read replies (if any) from Uno and show on Serial Monitor
  if (Serial.available()) {
    extSerial.write(Serial.read());
  }
}
```

Upload both sketches and open the Serial Monitors. You should see the Uno sending numbers and the ESP32 echoing them back. This verifies that the wiring and level shifting are correct.

### Example 2 – Two‑way communication with sensor data

Once the basic link works you can send arbitrary data structures. For example, connect a light sensor (photoresistor) to the Uno’s analog pin A0. Use `analogRead(A0)` to obtain a value (0–1023), convert it to volts (`voltage = reading * (5.0/1023.0)`), and send it to the ESP32. On the ESP32 side you can parse the string and adjust LED brightness accordingly. Remember to delay transmissions slightly so the receiver has time to process messages.

## Part 2 – I²C communication (concepts and guidelines)

I²C allows multiple controllers and peripherals on the same two wires. Each peripheral has a unique address and the controller initiates all communication. To interface a 5 V Uno and a 3.3 V ESP32:

1. Use a **bi‑directional level shifter**. Connect the Uno’s SDA (A4) and SCL (A5) to the HV side of two channels, and the ESP32’s SDA (default GPIO 21) and SCL (default GPIO 22) to the LV side. Power the HV side with 5 V and the LV side with 3.3 V【27998646467289†L174-L176】. Connect both boards’ grounds.
2. Ensure there are pull‑up resistors on both sides. Typical values are 4.7 kΩ–10 kΩ【899373012121875†L134-L136】. Many I²C breakout boards include pull‑ups, but when you build your own connections you must add them. Keep the total parallel resistance above about 2.2 kΩ【899373012121875†L134-L136】.
3. Decide which board is the controller. In most cases the Uno will act as the controller and the ESP32 as the peripheral. The controller uses `Wire.begin()` without an address; the peripheral calls `Wire.begin(address)` and registers callbacks with `Wire.onReceive()` and `Wire.onRequest()` to handle incoming data and respond.
4. Assign an unused 7‑bit address (for example `0x42`) to the peripheral. Avoid addresses reserved for common sensors (e.g., 0x3C for OLEDs, 0x68 for IMU, etc.).

Below is a minimal I²C “ping” example. It sends a byte from the Uno (controller) to the ESP32 (peripheral), and the ESP32 responds with the value incremented by one.

**Arduino Uno (controller)**

```cpp
#include <Wire.h>

void setup() {
  Serial.begin(9600);
  Wire.begin(); // join I²C bus as controller
}

void loop() {
  byte valueToSend = 42;
  Wire.beginTransmission(0x42); // address of ESP32 peripheral
  Wire.write(valueToSend);
  Wire.endTransmission();
  // request one byte back
  Wire.requestFrom(0x42, (byte)1);
  if (Wire.available()) {
    byte received = Wire.read();
    Serial.print("Received via I2C: ");
    Serial.println(received);
  }
  delay(1000);
}
```

**ESP32 (peripheral)**

```cpp
#include <Wire.h>

volatile byte lastReceived = 0;

void onReceive(int numBytes) {
  // read all available bytes; save the last one
  while (Wire.available()) {
    lastReceived = Wire.read();
  }
}

void onRequest() {
  // send back the value incremented by one
  Wire.write(lastReceived + 1);
}

void setup() {
  Serial.begin(115200);
  Wire.begin(0x42); // join I²C bus as peripheral with address 0x42
  Wire.onReceive(onReceive);
  Wire.onRequest(onRequest);
  Serial.println("ESP32 I2C peripheral ready");
}

void loop() {
  // optional: print the last value every second
  Serial.print("Last received: ");
  Serial.println(lastReceived);
  delay(1000);
}
```

Upload the sketches and monitor the serial output. If wiring and addressing are correct, you should see the Uno sending `42` and the ESP32 responding with `43`. Always test with short cables first and confirm the address with an I²C scanner.

## Troubleshooting and tips

* **Check the wiring** – Most problems are due to mis‑wired TX/RX lines or missing grounds. Double‑check that TX goes to the opposite board’s RX【784312248889863†L363-L368】 and that the level shifter HV and LV pins are powered correctly【27998646467289†L174-L176】.
* **Use the correct baud rate** – Both boards must use the same baud rate in `begin()`. A mismatch results in garbled characters.
* **Don’t exceed the ESP32’s logic levels** – Always use a level shifter or voltage divider on signals coming from the Uno to the ESP32【27998646467289†L174-L176】【223525860026786†L170-L176】.
* **Beware of I²C pull‑ups** – If you mix many breakout boards, the parallel resistance can become too low. Remove unnecessary pull‑ups to keep the effective pull‑up between ~2.2 kΩ and 10 kΩ【899373012121875†L134-L136】.
* **Use unique I²C addresses** – Two devices with the same address on the same bus will conflict. For microcontroller‑to‑microcontroller communication, choose an address > 0x08.
* **Avoid blocking code in callbacks** – In the I²C example, keep the `onRequest()` and `onReceive()` callbacks short. Don’t use `delay()` or heavy computations there.
* **SoftwareSerial limitations** – `SoftwareSerial` can be unreliable at higher baud rates. For robust communication, use hardware serial ports or consider connecting through USB to a computer for debugging.

## Going further

This lesson scratches the surface of board‑to‑board communication. Ideas for extending the project include:

* Sending sensor readings (temperature, humidity) from the Uno to the ESP32 and publishing them to an MQTT topic (Day 25).
* Building a remote display: the ESP32 reads sensor data and sends it to the Uno, which updates a seven‑segment display (Day 10).
* Implementing a simple communication protocol with start/stop bytes and checksums to ensure data integrity.
* Exploring SPI communication between boards using a logic‑level converter – SPI is faster than UART or I²C but requires more wires.

## Summary

In this lesson you learned how to connect an Arduino Uno and an ESP32 for **serial (UART) and I²C communication**. Because the Uno operates at 5 V while the ESP32 operates at 3.3 V, you must **shift the voltage levels** when signals travel from the Uno to the ESP32. A logic‑level converter board simplifies this task: supply its HV pins with 5 V and its LV pins with 3.3 V【27998646467289†L174-L176】. For UART, cross the TX and RX lines and share ground【784312248889863†L363-L368】. For I²C, use pull‑up resistors and a bidirectional converter because the SDA and SCL lines are open‑drain and operate at the bus voltage【899373012121875†L134-L145】. You built a simple serial echo example and a minimal I²C ping example to verify your setup. With these skills you can now integrate the Uno’s rich peripheral ecosystem with the ESP32’s networking capabilities.