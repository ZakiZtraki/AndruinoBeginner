# Day 23 – ESP32 GPIO & Sensors

After becoming familiar with the ESP32’s capabilities in Day 22, it’s time to get hands‑on with its **general‑purpose input/output (GPIO) pins**.  In this lesson you’ll learn how to use the ESP32’s digital and analog pins, how to generate Pulse‑Width Modulation (PWM) signals with its LEDC peripheral, and how to adapt your earlier Arduino projects to a 3.3 V environment.  By the end of this lesson you’ll have built a light‑sensitive lamp and a button‑controlled LED using only the ESP32 and a handful of components.

## Learning objectives

By completing this lesson you will be able to:

1. Identify **safe GPIO pins**, **input‑only pins** and **strapping pins** on the ESP32.
2. Use `digitalRead()` and `digitalWrite()` to read buttons and drive LEDs while avoiding pins that can disrupt boot.
3. Read analog voltages with `analogRead()`, understand the 12‑bit (0–4095) resolution and convert readings to volts.
4. Generate PWM signals using the **LEDC library** by selecting a channel, frequency and resolution.
5. Combine analog input and PWM output to build a **light‑sensitive night‑light**.

## Materials

- ESP32 DevKit V1 or NodeMCU‑32S board
- Breadboard and jumper wires
- 330 Ω resistor and LED
- Photoresistor (LDR) and 10 kΩ resistor (voltage divider)
- Push button and 10 kΩ pull‑down resistor
- USB cable and computer with Arduino IDE

## 1. ESP32 GPIO overview

Unlike the Arduino Uno’s numbered digital/analog labels, the ESP32 exposes up to 34 GPIOs that can have multiple functions.  Some pins are reserved for boot configuration (strapping), and others are input‑only ([ESP32 datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf)):

- **Strapping pins to avoid during boot:** 0, 2, 5, 12 and 15.  These pins determine the ESP32’s boot mode; connecting them to external circuits can prevent the board from starting.
- **Input‑only pins:** 34, 35, 36 and 39 can only be used as inputs (e.g. analog sensors); they cannot drive LEDs.

For general digital I/O, choose pins that are **not** strapping pins and **not** input‑only, and follow the mapping shown in your board’s pinout.  Remember that all pins operate at **3.3 V logic**—connecting 5 V signals directly may damage the ESP32 ([ESP32 datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf)).

## 2. Digital input and output

### Wiring a button and LED

Let’s recreate Day 3’s button and LED experiment using safe pins on the ESP32.

1. **LED wiring:** Place an LED on the breadboard.  Connect the **anode** (longer leg) through a **330 Ω** resistor to **GPIO 17**, and the **cathode** (shorter leg) to **GND**.
2. **Button wiring:** Connect one side of the push button to **3.3 V** and the other side to **GPIO 16** (a safe GPIO).  Add a **10 kΩ** resistor from the button‑pin junction to **GND** to create a pull‑down.  When the button is pressed, the pin sees 3.3 V (HIGH); otherwise the resistor pulls it LOW.

### Reading the button and driving the LED

Upload the following sketch.  It toggles the LED each time you press the button:

```cpp
const int ledPin    = 17;
const int buttonPin = 16;
bool ledState = false;
bool lastButtonState = false;

void setup() {
  pinMode(ledPin, OUTPUT);
  pinMode(buttonPin, INPUT); // external pull-down resistor used
}

void loop() {
  bool currentState = digitalRead(buttonPin);
  if (currentState && !lastButtonState) {
    // rising edge detected
    ledState = !ledState;
    digitalWrite(ledPin, ledState);
  }
  lastButtonState = currentState;
  delay(10); // simple debounce
}
```

This code monitors the button for a **rising edge** and toggles the LED state.  The 10 ms delay helps debounce the switch.  Avoid using the strapping pins (0, 2, 5, 12, 15) in your circuits to prevent boot issues ([ESP32 datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf)).

### Using internal pull‑ups

Alternatively, you can wire the button between the pin and **GND**, and enable the internal pull‑up resistor with `pinMode(buttonPin, INPUT_PULLUP)`.  In that case, the input reads **LOW** when pressed and **HIGH** when idle.  This approach saves an external resistor but still requires choosing a safe GPIO.

## 3. Reading analog sensors

The ESP32’s Analog‑to‑Digital Converter (ADC) supports **12‑bit resolution (0–4095)**.  With the default 11 dB attenuation, the input range is roughly **0–3.3 V**, so 0 V corresponds to 0 and 3.3 V to 4095 ([ESP32 datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf), [ESP‑IDF ADC docs](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/peripherals/adc.html)).  To read a sensor value:

```cpp
int raw = analogRead(32);               // read from a safe ADC1 pin
float voltage = raw * 3.3 / 4095.0;    // convert to volts
```

**Important:** Some ADC pins belong to ADC2, which cannot be used while Wi‑Fi is active.  Use ADC1 pins (GPIO 32–33 for analog sensors; GPIO 34–39 for input‑only sensors) when your ESP32 is connected to Wi‑Fi ([ESP‑IDF ADC docs](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/peripherals/adc.html)).

### Photoresistor example

Create a voltage divider using your **photoresistor (LDR)**: connect one lead of the LDR to **3.3 V**, the other lead to **GPIO 32**, and a **10 kΩ** resistor from GPIO 32 to **GND**.  The voltage at GPIO 32 varies with light intensity.  Use this sketch to print the raw value and computed voltage:

```cpp
const int ldrPin = 32;

void setup() {
  Serial.begin(115200);
  delay(100);
}

void loop() {
  int reading = analogRead(ldrPin);
  float volts = reading * 3.3 / 4095.0;
  Serial.print("Raw: ");
  Serial.print(reading);
  Serial.print("\tVoltage: ");
  Serial.println(volts, 3);
  delay(200);
}
```

Watch the voltage increase when you shine a flashlight on the sensor and decrease in the dark.  Keep in mind that the ESP32 ADC is not perfectly linear and may saturate near 0 V or 3.3 V ([ESP‑IDF ADC calibration](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/peripherals/adc_calibration.html)).

## 4. Generating PWM signals with the LEDC library

The ESP32 generates PWM using the **LEDC (LED Control) peripheral**, which provides **16 channels** with configurable frequency and resolution ([Arduino‑ESP32 LEDC docs](https://docs.espressif.com/projects/arduino-esp32/en/latest/api/ledc.html)).  To generate PWM with the LEDC library:

1. **Select a channel (0–15) and pin.**
2. **Choose a PWM frequency.**  For LED dimming, 500 Hz is sufficient.  Servo motors require ~50 Hz, while buzzers or motors may use higher frequencies.
3. **Choose a resolution (1–16 bits).**  An 8‑bit resolution gives 256 discrete duty‑cycle levels (0–255).
4. **Configure the channel** with `ledcSetup(channel, freq, resolution)`.
5. **Attach the pin** using `ledcAttachPin(pin, channel)`, then set the duty cycle using `ledcWrite(channel, dutyCycle)`.

### Fading an LED

Here is a sketch that fades an LED on **GPIO 18** using PWM:

```cpp
const int PWM_CHANNEL    = 0;    // one of 16 channels
const int PWM_FREQ       = 500;  // 500 Hz
const int PWM_RESOLUTION = 8;    // 8‑bit resolution (0–255)
const int LED_PIN        = 18;   // safe GPIO with PWM capability

void setup() {
  // Configure channel and attach the pin
  ledcSetup(PWM_CHANNEL, PWM_FREQ, PWM_RESOLUTION);
  ledcAttachPin(LED_PIN, PWM_CHANNEL);
}

void loop() {
  // fade up
  for (int duty = 0; duty <= 255; duty++) {
    ledcWrite(PWM_CHANNEL, duty);
    delay(5);
  }
  // fade down
  for (int duty = 255; duty >= 0; duty--) {
    ledcWrite(PWM_CHANNEL, duty);
    delay(5);
  }
}
```

This example uses an 8‑bit resolution (like Arduino) and gradually ramps the duty cycle up and down to smoothly change the LED’s brightness.  The `ledcSetup()` and `ledcAttachPin()` calls must occur in `setup()` before `ledcWrite()` can be used.

### Light‑sensitive night‑light

Let’s combine our photoresistor and PWM skills to build a night‑light that automatically adjusts brightness according to ambient light:

```cpp
const int ldrPin        = 32;    // analog input (ADC1)
const int ledPin        = 18;    // PWM output
const int pwmChannel    = 1;     // use a different channel
const int pwmFreq       = 500;   // 500 Hz
const int pwmResolution = 8;     // 8‑bit resolution

void setup() {
  Serial.begin(115200);
  ledcSetup(pwmChannel, pwmFreq, pwmResolution);
  ledcAttachPin(ledPin, pwmChannel);
}

void loop() {
  int sensorValue = analogRead(ldrPin);
  // Map 0–4095 to 0–255 (invert so darker = brighter)
  int brightness = map(sensorValue, 0, 4095, 255, 0);
  ledcWrite(pwmChannel, brightness);
  // optional: print values
  Serial.print("LDR: "); Serial.print(sensorValue);
  Serial.print("\tBrightness: "); Serial.println(brightness);
  delay(50);
}
```

As the environment gets darker, the LED brightens.  Feel free to adjust the mapping range or invert behaviour.  If you’re running Wi‑Fi concurrently, make sure to use ADC1 pins for the photoresistor.

## 5. Extensions and challenges

* **Servo control:** For small servos, use the `ESP32Servo` library, which wraps LEDC for 50 Hz signals.  Combine a potentiometer on an ADC1 pin with `ledcWrite` to control servo angle.
* **Digital motion sensor:** Re‑wire the PIR sensor from Day 8 to 3.3 V, connect its digital output to a safe pin (e.g. 27) and use `digitalRead()` to trigger a buzzer via PWM.
* **I²C sensors:** Use GPIO 21 (SDA) and 22 (SCL) for I²C devices like a BME280 or an LCD with an I²C backpack; these are the default pins in the Arduino‑ESP32 core ([Arduino‑ESP32 Wire](https://docs.espressif.com/projects/arduino-esp32/en/latest/api/i2c.html)).

## 6. Troubleshooting

| Symptom | Possible cause | Solution |
|---|---|---|
| ESP32 doesn’t boot | Using a strapping pin (0, 2, 5, 12, 15) for inputs/outputs | Move your circuit to a safe GPIO; leave strapping pins unconnected during boot. |
| Analog reading stuck at 0 or 4095 | Using an **ADC2** pin while Wi‑Fi is active | Use ADC1 pins (32–39); disable Wi‑Fi or change pin ([ESP‑IDF ADC docs](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/peripherals/adc.html)). |
| LEDC PWM doesn’t work | Forgetting to call `ledcSetup()`/`ledcAttachPin()` | Configure the channel and attach the pin in `setup()` before calling `ledcWrite`. |
| LED flickers when Wi‑Fi transmits | Insufficient power supply | Use a robust 5 V supply; power large loads separately. |
| Button doesn’t respond | Missing pull‑up/pull‑down resistor | Use an external 10 kΩ resistor or `INPUT_PULLUP`. |
| ADC values non‑linear | ESP32 ADC has non‑linear behaviour near 0 V and 3.3 V | Keep signals within mid‑range (0.1–3.2 V) or calibrate using `analogSetAttenuation()` ([ESP‑IDF ADC calibration](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/peripherals/adc_calibration.html), [Arduino‑ESP32 analog](https://docs.espressif.com/projects/arduino-esp32/en/latest/api/adc.html)). |

## 7. Going further

* Explore **GPIO interrupts** to detect button presses without polling.
* Learn to change ADC **attenuation** and **width** with `analogSetAttenuation()` and `analogSetWidth()` to customise range and resolution.
* Use the **LEDC library** to drive multiple LEDs on different channels or play melodies on a buzzer.
* Combine I²C sensors (e.g., BME280) with Wi‑Fi to publish data to a web server (Day 24).
* For accurate analog readings, implement oversampling and median filtering.

## Key takeaways

* Use GPIOs that are **not** strapping pins (0, 2, 5, 12, 15) and remember that GPIO 34–39 are input‑only ([ESP32 datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf)).
* The ESP32 ADC provides 12‑bit readings (0–4095) and ADC2 pins are unavailable while Wi‑Fi is active ([ESP32 datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf), [ESP‑IDF ADC docs](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/peripherals/adc.html)).
* The LEDC peripheral provides flexible PWM on 16 channels; configure frequency, resolution and channel before writing duty cycles ([Arduino‑ESP32 LEDC docs](https://docs.espressif.com/projects/arduino-esp32/en/latest/api/ledc.html)).
* By combining analog input and PWM output you can build responsive, sensor‑based projects like a light‑sensitive night‑light.

In Day 24, you’ll turn the ESP32 into a web server to display sensor readings and control outputs remotely.
