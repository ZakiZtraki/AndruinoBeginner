# Day 29 – Reliability & Debugging in Microcontroller Projects

## Learning objectives

1. **Understand common reliability problems** in Arduino and ESP32 projects, including voltage drops, noise, and code lock‑ups.
2. **Apply hardware techniques** such as decoupling capacitors, stable power supplies, and proper wiring to prevent brownouts and erratic behaviour.
3. **Use watchdog timers** and brownout detectors to automatically recover from hangs.
4. **Implement software debugging strategies**, including serial logging, signal smoothing, and error handling.
5. **Build a reliable sensor node** that incorporates these practices and test its robustness.

## Introduction

As your projects grow more complex, you’ll notice that sensors can produce noisy readings, motors cause voltage dips, or your code freezes unexpectedly. Reliable systems require both careful hardware design and robust software. In this lesson you’ll learn how to keep your microcontroller projects running smoothly—whether they are based on the Arduino Uno or the ESP32—by managing power, mitigating noise, recovering from hangs, and systematically debugging problems.

## 1 – Power stability and decoupling

### 1.1 Why power matters

Microcontrollers and sensors need a stable voltage supply. If the supply dips below a threshold, the chip’s built‑in brownout detector resets the board to prevent erratic behaviour. Brownouts often occur when a Wi‑Fi radio or motor suddenly draws extra current. To avoid this:

- **Use a regulated power supply with enough current headroom**, e.g. a stable 5 V supply rated for at least 500 mA, and more if you are driving motors or servos. Avoid powering the ESP32 via its 3.3 V pin; use the 5 V pin so the onboard regulator can provide the necessary current ([ESP32 datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf)).
- **Keep power wires short and thick** to reduce resistance and voltage drop. Breadboard jumpers can introduce resistance; doubling up on wires helps ensure stable supply.

### 1.2 Decoupling capacitors

Electronic components switch on and off rapidly, causing brief current spikes. A decoupling capacitor placed between VCC and GND provides a local reservoir of charge to satisfy these spikes, reducing voltage ripples. Low‑value ceramic capacitors (0.1 µF) have high resonant frequencies and filter high‑frequency noise. Higher‑value electrolytic capacitors (1 – 100 µF) smooth low‑frequency fluctuations. To be effective, the capacitor must be placed as close as possible to the IC’s power pins ([TI decoupling capacitor guide](https://www.ti.com/lit/an/snla038/snla038.pdf)).

**Practical tips:**

* Place a 0.1 µF ceramic capacitor across VCC and GND on every sensor or IC. For power‑hungry modules like the ESP32, add a bulk electrolytic capacitor (470 µF or more) across the 5 V and GND rails.
* Ensure correct polarity on electrolytics and use short traces or jumper wires.
* Decouple analogue sensors separately from digital logic to prevent cross‑coupling.

### 1.3 Brownout detection and prevention

The ESP32 has a brownout detector that resets the chip if supply voltage falls below its configured threshold (around 2.6–2.7 V on many boards) to prevent malfunction. Brownout resets often appear as the error “Brownout detector was triggered.” Instead of disabling this detector, fix the underlying cause: use a stable 5 V supply, add capacitors, and improve wiring ([ESP32 datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf), [ESP‑IDF brownout docs](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/system/esp_system.html#brownout-detector)).

## 2 – Watchdog timers and auto‑recovery

### 2.1 Arduino Watchdog Timer

The ATmega328P on the Arduino Uno includes a watchdog timer that resets the microcontroller if the software becomes unresponsive. The watchdog uses an internal 128 kHz clock and can be configured for timeouts from 16 ms up to 8 seconds. If the timer counts to its preset value without being reset, the microcontroller reboots ([ATmega328P datasheet](https://ww1.microchip.com/downloads/en/DeviceDoc/ATmega328P-Data-Sheet-DS-DS40002061B.pdf)).

**Key points:**

- Enable the watchdog after a brief delay in `setup()` (e.g. 3 s) so the bootloader has time to upload code.
- Use `wdt_enable(WDTO_4S)` to set a 4‑second timeout and call `wdt_reset()` periodically in your loop. If your code hangs (e.g. in an infinite loop), the watchdog will reset the board.
- Do not disable interrupts for long periods; otherwise the watchdog may not be serviced and will reset the board.

### 2.2 ESP32 watchdogs

The ESP32 includes multiple watchdog timers to monitor tasks and interrupts. If a task runs too long without yielding, or an interrupt blocks other interrupts, the watchdog triggers a reset. The Arduino core enables these watchdogs by default. Avoid disabling them; if your program hits a watchdog reset, check for long blocking loops or slow operations in callbacks ([ESP‑IDF watchdog timers](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/system/wdts.html)).

## 3 – Debugging techniques

### 3.1 Serial logging

The serial monitor is your first line of defence for debugging. Insert `Serial.print()` statements to display sensor readings, state variables, and execution flow. For the ESP32, use `Serial` for the USB port and `Serial1` or `Serial2` for additional UARTs ([Arduino‑ESP32 Serial](https://docs.espressif.com/projects/arduino-esp32/en/latest/api/serial.html)). Remember that printing too frequently may affect timing; use buffers or conditional logging.

### 3.2 Signal smoothing and filtering

Analog sensors can produce noisy readings. Techniques include:

- **Moving average filter:** Average the last N samples to smooth random noise.
- **Exponential smoothing:** Update a filtered value as `filtered = alpha * newSample + (1 – alpha) * filtered`.
- **Hardware RC filter:** Add a resistor and capacitor to form a low‑pass filter on the sensor output. A 10 kΩ resistor and 0.1 µF capacitor form a cutoff frequency of ~160 Hz ([RC low‑pass filter](https://en.wikipedia.org/wiki/Low-pass_filter)).

For digital sensors, ensure you respect their sampling rates (e.g. DHT22 should be read no more than once every 2 seconds) and check error codes ([Adafruit DHT guide](https://learn.adafruit.com/dht)).

### 3.3 Grounding and noise mitigation

Erratic behaviour can result from ground loops or electromagnetic interference (EMI). Always connect all ground pins together to create a common reference. Avoid routing high‑current motor wires near sensitive analog signal wires. If motors cause resets, add flyback diodes and separate their power supply ([SparkFun transistor guide](https://learn.sparkfun.com/tutorials/transistors/all)). Twisted‑pair wiring and shielding can reduce EMI for long sensor cables.

### 3.4 Testing and verification

Build tests that intentionally stress your system. For example, use a variable resistor to simulate changing supply voltage and observe whether the brownout detector activates. Deliberately insert a blocking `while(1)` in the code to verify that the watchdog resets the board. Introduce noise on analogue inputs and verify that your filters produce stable readings. Document your observations in a troubleshooting log.

## 4 – Hands‑on: Building a reliable sensor node

In this activity, you’ll apply the reliability techniques learned above.

### Materials

* ESP32 development board and Arduino Uno
* DHT22 sensor and PIR sensor
* Two 0.1 µF ceramic capacitors and one 470 µF electrolytic capacitor
* Logic‑level converter or resistor divider for serial link
* Jumper wires and breadboard

### Step 1 – Wire the sensors with decoupling

1. Place the DHT22 sensor on the breadboard. Connect VCC to 5 V, GND to GND and Data to pin 7 of the Arduino. Add a 10 kΩ pull‑up resistor between Data and VCC ([Adafruit DHT guide](https://learn.adafruit.com/dht)).
2. Place a **0.1 µF ceramic capacitor** across VCC and GND of the DHT22 to filter high‑frequency noise.
3. Connect the PIR sensor’s VCC to 5 V, GND to GND and OUT to pin 8. Adjust the sensitivity and delay as required.
4. Connect the Arduino’s TX through a level‑shifter to the ESP32’s RX (GPIO 16) and the ESP32’s TX to the Arduino’s RX. Supply 5 V to the HV side and 3.3 V to the LV side of the level shifter. Tie the grounds together.

### Step 2 – Add bulk and decoupling capacitors

* Place a **470 µF electrolytic capacitor** between the 5 V and GND rails on your breadboard to provide a reservoir for sudden current draws.
* Place a **0.1 µF ceramic capacitor** next to the ESP32’s 3.3 V and GND pins.
* Keep power wires short and avoid using long, thin jumpers.

### Step 3 – Implement the watchdog on Arduino

Insert the following lines into your Arduino sketch after `delay(3000);` in `setup()` to configure a 4‑second watchdog timeout:

```cpp
#include <avr/wdt.h>

void setup() {
  // existing setup code
  wdt_disable();
  delay(3000);  // allow time for bootloader
  wdt_enable(WDTO_4S);  // enable 4‑second watchdog
}

void loop() {
  // your sensor reading and serial code
  wdt_reset();  // feed the watchdog regularly
}
```

Source: [ATmega328P datasheet](https://ww1.microchip.com/downloads/en/DeviceDoc/ATmega328P-Data-Sheet-DS-DS40002061B.pdf).

### Step 4 – Deploy and test

1. Upload your Arduino and ESP32 programs. Observe that the sensor readings are stable thanks to the decoupling capacitors.
2. Temporarily remove the electrolytic capacitor and note how Wi‑Fi activity on the ESP32 may cause the sensors to glitch or the board to reset (brownout). Reinstall the capacitor and confirm stability.
3. Introduce a bug in the Arduino loop, such as an infinite `while(1)`. Verify that the watchdog resets the board after 4 seconds.
4. Record any resets in your log and adjust capacitor sizes or code accordingly.

## 5 – Troubleshooting guide

| Symptom | Likely cause | Solution |
| --- | --- | --- |
| **Board resets with “Brownout detector was triggered”** | Insufficient or unstable power supply. Long wires causing voltage drop | Use a regulated 5 V supply with adequate current headroom and add a 470 µF capacitor. Shorten and thicken power wires. |
| **Noisy analog readings** | Lack of decoupling or EMI from motors | Add 0.1 µF capacitors near the sensor. Use a moving average or RC filter and keep sensor wires away from high‑current lines. |
| **Board locks up / stops responding** | Infinite loop or blocking function | Enable the watchdog timer and call `wdt_reset()` regularly. Check for blocking code and refactor into non‑blocking state machines. |
| **ESP32 resets unexpectedly** | Wi‑Fi draw causing supply dips, faulty regulator | Ensure the power supply can deliver at least 500 mA and add bulk capacitance ([ESP32 datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf)). Replace defective regulators if necessary. |
| **Sensor data out of range** | Sensor miswired or not calibrated | Verify wiring and sensor orientation. Calibrate sensors and handle error codes. |

## 6 – Extensions and further reading

* **Interrupt handlers:** Use interrupts to avoid blocking loops and reduce CPU load. Keep ISRs short so as not to trigger the ESP32’s interrupt watchdog.
* **Asynchronous web servers:** Implement the ESP32’s asynchronous web server library (`ESPAsyncWebServer`) or websockets for real‑time updates without refresh.
* **External watchdog modules:** For critical applications, add an external watchdog or power supervisor IC that monitors both voltage and microcontroller activity.
* **Systematic debugging:** Use logic analysers or oscilloscopes to monitor signals. Implement logging to an SD card or cloud service to track long‑term behaviour.

## Summary

Reliability in DIY electronics comes from understanding both hardware and software failure modes. Brownouts happen when power drops below safe levels; fix them with stable supplies, bulk capacitors and short wires. Decoupling capacitors near each IC or sensor suppress voltage spikes and high‑frequency noise. Watchdog timers reset microcontrollers if code hangs. Use serial logging, filtering and proper grounding to debug and mitigate noise. By incorporating these techniques into your designs, you can build robust systems that withstand real‑world conditions and recover gracefully from unexpected events.
