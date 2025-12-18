# Day 23 – ESP32 GPIO & Sensors

After becoming familiar with the ESP32’s capabilities in Day 22, it’s time to get hands‑on with its **general‑purpose input/output (GPIO) pins**.  In this lesson you’ll learn how to use the ESP32’s digital and analog pins, how to generate Pulse‑Width Modulation (PWM) signals with its LEDC peripheral, and how to adapt your earlier Arduino projects to a 3.3 V environment.  By the end of this lesson you’ll have built a light‑sensitive lamp and a button‑controlled LED using only the ESP32 and a handful of components.

## Learning objectives

By completing this lesson you will be able to:

1. Identify **safe GPIO pins**, **input‑only pins** and **strapping pins** on the ESP32【101643182054638†L87-L100】.
2. Use `digitalRead()` and `digitalWrite()` to read buttons and drive LEDs while avoiding pins that can disrupt boot.
3. Read analog voltages with `analogRead()`, understand the 12‑bit (0–4095) resolution and convert readings to volts【798521705858314†L52-L57】.
4. Generate PWM signals using the **LEDC library** by selecting a channel, frequency and resolution【35371649993462†L270-L297】.
5. Combine analog input and PWM output to build a **light‑sensitive night‑light**.

## Materials

- ESP32 DevKit V1 or NodeMCU‑32S board
- Breadboard and jumper wires
- 330 Ω resistor and LED
- Photoresistor (LDR) and 10 kΩ resistor (voltage divider)
- Push button and 10 kΩ pull‑down resistor
- USB cable and computer with Arduino IDE

## 1. ESP32 GPIO overview

Unlike the Arduino Uno’s numbered digital/analog labels, the ESP32 exposes up to 34 GPIOs that can have multiple functions.  Some pins are safe for general use, others are input‑only or reserved for boot configuration (strapping).  A beginner‑friendly summary from LearnIoT lists:

- **Safe GPIOs:** 16 (RX2), 17 (TX2), 13, 14, 25, 26, 27 for LEDs and motors; 32 and 33 for analog sensors; 21 (SDA) and 22 (SCL) for I²C【101643182054638†L87-L94】.
- **Strapping pins to avoid:** 0, 2, 5, 12 and 15.  These pins determine the ESP32’s boot mode; connecting them to external circuits can prevent the board from starting【101643182054638†L96-L100】.
- **Input‑only pins:** 34, 35, 36 and 39 can only be used as inputs (e.g. analog sensors); they cannot drive LEDs【101643182054638†L99-L100】.

Use safe GPIOs for general digital I/O.  When using a pin for a specific peripheral (I²C, SPI, UART), follow the mapping shown in your board’s pinout.  Remember that all pins operate at **3.3 V logic**—connecting 5 V signals directly may damage the ESP32.

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

This code monitors the button for a **rising edge** and toggles the LED state.  The 10 ms delay helps debounce the switch.  Avoid using the strapping pins (0, 2, 5, 12, 15) in your circuits to prevent boot issues【101643182054638†L96-L100】.

### Using internal pull‑ups

Alternatively, you can wire the button between the pin and **GND**, and enable the internal pull‑up resistor with `pinMode(buttonPin, INPUT_PULLUP)`.  In that case, the input reads **LOW** when pressed and **HIGH** when idle.  This approach saves an external resistor but still requires choosing a safe GPIO.

## 3. Reading analog sensors

The ESP32’s Analog‑to‑Digital Converter (ADC) can measure voltages between **0 V and 3.3 V**.  The measured voltage is mapped to a **12‑bit value (0–4095)**—0 V corresponds to 0 and 3.3 V to 4095【798521705858314†L52-L57】.  To read a sensor value:

```cpp
int raw = analogRead(32);               // read from a safe ADC1 pin
float voltage = raw * 3.3 / 4095.0;    // convert to volts
```

**Important:** Some ADC pins belong to ADC2, which cannot be used while Wi‑Fi is active.  Use ADC1 pins (GPIO 32–33 for analog sensors; GPIO 34–39 for input‑only sensors) when your ESP32 is connected to Wi‑Fi【798521705858314†L96-L101】.

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

Watch the voltage increase when you shine a flashlight on the sensor and decrease in the dark.  Keep in mind that the ESP32 ADC is not perfectly linear and may saturate near 0 V or 3.3 V【798521705858314†L70-L74】.

## 4. Generating PWM signals with the LEDC library

Unlike the Arduino Uno, the ESP32 does not support `analogWrite()`.  Instead, it includes a **LEDC (LED Control) peripheral** with **16 independent channels** capable of generating PWM signals with configurable frequency and resolution【35371649993462†L270-L297】.  To generate PWM with the LEDC library:

1. **Select a channel (0–15) and pin.**
2. **Choose a PWM frequency.**  For LED dimming, 500 Hz is sufficient【35371649993462†L270-L297】.  Servo motors require ~50 Hz, while buzzers or motors may use higher frequencies.
3. **Choose a resolution (1–16 bits).**  An 8‑bit resolution gives 256 discrete duty‑cycle levels (0–255)【35371649993462†L284-L289】.
4. **Attach the pin to the channel** with `ledcAttachChannel(pin, freq, resolution, channel)`【35371649993462†L290-L297】.
5. **Set the duty cycle** using `ledcWrite(channel, dutyCycle)` or `ledcWriteChannel(channel, dutyCycle)`【35371649993462†L296-L297】.

### Fading an LED

Here is a sketch that fades an LED on **GPIO 18** using PWM:

```cpp
const int PWM_CHANNEL    = 0;    // one of 16 channels
const int PWM_FREQ       = 500;  // 500 Hz
const int PWM_RESOLUTION = 8;    // 8‑bit resolution (0–255)
const int LED_PIN        = 18;   // safe GPIO with PWM capability

void setup() {
  // Attach the pin to the channel with selected frequency and resolution
  ledcAttachChannel(LED_PIN, PWM_FREQ, PWM_RESOLUTION, PWM_CHANNEL);
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

This example uses an 8‑bit resolution (like Arduino) and gradually ramps the duty cycle up and down to smoothly change the LED’s brightness.  The `ledcAttachChannel()` call must occur in `setup()` before `ledcWrite()` can be used【35371649993462†L290-L297】.

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
  ledcAttachChannel(ledPin, pwmFreq, pwmResolution, pwmChannel);
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

As the environment gets darker, the LED brightens.  Feel free to adjust the mapping range or invert behaviour.  If you’re running Wi‑Fi concurrently, make sure to use ADC1 pins for the photoresistor【798521705858314†L96-L101】.

## 5. Extensions and challenges

* **Servo control:** For small servos, use the `ESP32Servo` library, which wraps LEDC for 50 Hz signals.  Combine a potentiometer on an ADC1 pin with `ledcWrite` to control servo angle.
* **Digital motion sensor:** Re‑wire the PIR sensor from Day 8 to 3.3 V, connect its digital output to a safe pin (e.g. 27) and use `digitalRead()` to trigger a buzzer via PWM.
* **I²C sensors:** Use GPIO 21 and 22 for I²C devices like the DHT22 or LCD from previous lessons.  These pins are safe for I²C【101643182054638†L87-L94】.

## 6. Troubleshooting

| Symptom | Possible cause | Solution |
|---|---|---|
| ESP32 doesn’t boot | Using a strapping pin (0, 2, 5, 12, 15) for inputs/outputs【101643182054638†L96-L100】 | Move your circuit to a safe GPIO; leave strapping pins unconnected during boot. |
| Analog reading stuck at 0 or 4095 | Using an **ADC2** pin while Wi‑Fi is active【798521705858314†L96-L101】 | Use ADC1 pins (32–39); disable Wi‑Fi or change pin. |
| LEDC PWM doesn’t work | Forgetting to call `ledcAttachChannel()` | Always attach the pin to a channel in `setup()` before calling `ledcWrite`. |
| LED flickers when Wi‑Fi transmits | Insufficient power supply | Use a robust 5 V supply; power large loads separately. |
| Button doesn’t respond | Missing pull‑up/pull‑down resistor | Use an external 10 kΩ resistor or `INPUT_PULLUP`. |
| ADC values non‑linear | ESP32 ADC has non‑linear behaviour near 0 V and 3.3 V【798521705858314†L70-L74】 | Keep signals within mid‑range (0.1–3.2 V) or calibrate using `analogSetAttenuation()`. |

## 7. Going further

* Explore **GPIO interrupts** to detect button presses without polling.
* Learn to change ADC **attenuation** and **width** with `analogSetAttenuation()` and `analogSetWidth()` to customise range and resolution【798521705858314†L108-L120】.
* Use the **LEDC library** to drive multiple LEDs on different channels or play melodies on a buzzer.
* Combine I²C sensors (e.g., BME280) with Wi‑Fi to publish data to a web server (Day 24).
* For accurate analog readings, implement oversampling and median filtering.

## Key takeaways

* Use **safe GPIO pins** (16, 17, 13, 14, 25, 26, 27, 32, 33) and avoid **strapping pins** (0, 2, 5, 12, 15) to prevent boot issues【101643182054638†L87-L100】.
* The ESP32 ADC measures 0–3.3 V with 12‑bit resolution, returning values from **0 to 4095**【798521705858314†L52-L57】.  ADC2 pins are unavailable when Wi‑Fi is used【798521705858314†L96-L101】.
* The LEDC peripheral provides flexible PWM on 16 channels; configure frequency, resolution and channel before writing duty cycles【35371649993462†L270-L297】.
* By combining analog input and PWM output you can build responsive, sensor‑based projects like a light‑sensitive night‑light.

In Day 24, you’ll turn the ESP32 into a web server to display sensor readings and control outputs remotely.