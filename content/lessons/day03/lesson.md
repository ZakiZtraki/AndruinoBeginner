# Day 3 – Buttons, Pull-Up & Pull-Down Resistors, and Debouncing

## Learning objectives

By the end of this lesson you should be able to:

- **Explain why floating inputs are unreliable.** Without a defined voltage, a digital pin can fluctuate randomly between HIGH and LOW due to noise【625912433625749†L153-L169】.  
- **Use pull‑down and pull‑up resistors to define a default state.** A pull‑down ties the input to ground so the default state is LOW, while a pull‑up ties it to VCC so the default state is HIGH【625912433625749†L248-L263】.  
- **Choose appropriate resistor values.** External pull‑ups commonly use 10 kΩ resistors【625912433625749†L248-L263】; pull‑downs often range from 50 Ω to 1 kΩ depending on the logic family【892551830113941†L505-L512】.  
- **Enable Arduino’s internal pull‑up resistor.** Using `INPUT_PULLUP` places a ≈20–50 kΩ resistor between the pin and 5 V【625912433625749†L79-L82】.  
- **Write code to read a push‑button and control an LED.**  
- **Implement simple software debouncing** to avoid false triggers when contacts bounce【263116106733561†L275-L283】.

## 1. Why you need pull‑up or pull‑down resistors

When a digital input pin is not connected to a defined voltage, it is **floating**. A floating pin picks up noise and rapidly changes state between 0 V and 5 V, leading to unreliable readings【625912433625749†L153-L169】.  
In the previous lesson you used an LED with a resistor to set the current; here you will use a resistor to set the **voltage** seen by the input.  

**Floating pin demonstration (optional):**  
1. Wire a push‑button so that one side connects to pin 4 and the other side is unconnected.  
2. Upload this sketch:

```cpp
#define BUTTON_PIN 4
void setup() {
  Serial.begin(9600);
  pinMode(BUTTON_PIN, INPUT); // no pull‑up or pull‑down
}
void loop() {
  Serial.println(digitalRead(BUTTON_PIN));
  delay(10);
}
```

Observe the Serial Plotter; the input will oscillate randomly. This shows why you should not leave inputs floating.

## 2. Pull‑down resistor circuit

A **pull‑down resistor** connects the pin to ground (0 V) so that when the button is not pressed the pin reads LOW. When the button is pressed, the pin sees VCC (5 V) and reads HIGH.  
A typical external pull‑down resistor value is between 50 Ω and 1 kΩ for TTL logic【892551830113941†L505-L512】; for microcontroller inputs a 10 kΩ resistor is common【625912433625749†L248-L263】.

### Materials

- Arduino Uno (or compatible)  
- Breadboard and jumper wires  
- Push‑button  
- 10 kΩ resistor (pull‑down)  
- LED + 220 Ω resistor (review from Day 2)  
- USB cable and computer running Arduino IDE

### Wiring instructions

1. **Place the push‑button** so its legs straddle the central gap on the breadboard.
2. **Connect one leg** of the button to **5 V** on your Arduino.  
3. **Connect the opposite leg** to **digital pin 3** on your Arduino.  
4. **Add the pull‑down resistor:** connect a 10 kΩ resistor from the pin 3 row to **GND**【625912433625749†L248-L263】.  
5. **Add the LED circuit** from Day 2: connect the anode (long leg) of the LED to pin 13 (built‑in LED) or another available pin with a 220 Ω resistor to ground.  
6. Double‑check your wiring. The resistor should always be between the pin and ground; without it, the input would float when the button is not pressed.

### Example code: reading a button with a pull‑down resistor

```cpp
#define BUTTON_PIN 3
#define LED_PIN 13

void setup() {
  pinMode(BUTTON_PIN, INPUT);   // pin is an input (external pull‑down used)
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  int buttonState = digitalRead(BUTTON_PIN);
  if (buttonState == HIGH) {
    digitalWrite(LED_PIN, HIGH); // turn LED on when button is pressed
  } else {
    digitalWrite(LED_PIN, LOW);
  }
}
```

Upload the sketch and test. With the button unpressed the LED remains off; when you press the button the LED lights up.

### What you learned

- A pull‑down resistor forces the input LOW when the button is open【625912433625749†L248-L263】.  
- The resistor’s value controls current draw; 10 kΩ is a good starting point for Arduino inputs【625912433625749†L248-L263】.  
- Pressing the button overrides the resistor and drives the pin HIGH.

## 3. Internal pull‑up resistor (`INPUT_PULLUP`)

Many microcontrollers, including the ATmega328P on Arduino Uno, have internal pull‑up resistors. When you set a pin’s mode to `INPUT_PULLUP`, the microcontroller connects an internal ≈20–50 kΩ resistor between the input pin and VCC【625912433625749†L79-L82】【625912433625749†L231-L234】. This simplifies your circuit because you only need an external connection to ground.

### Wiring for internal pull‑up

1. Disconnect the external pull‑down resistor and move the push‑button so that **one side goes to ground** and the **other goes to digital pin 3**.  
2. You no longer need a resistor on the breadboard – the Arduino will provide one internally.

### Example code using `INPUT_PULLUP`

```cpp
#define BUTTON_PIN 3
#define LED_PIN 13

void setup() {
  pinMode(BUTTON_PIN, INPUT_PULLUP); // enable internal pull‑up
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  int buttonState = digitalRead(BUTTON_PIN);
  if (buttonState == LOW) {
    digitalWrite(LED_PIN, HIGH); // logic is inverted: LOW means pressed
  } else {
    digitalWrite(LED_PIN, LOW);
  }
}
```

With this configuration, the pin normally reads HIGH because of the internal pull‑up; pressing the button connects the pin to ground, so the logic level becomes LOW【625912433625749†L222-L234】. Note that the logic is inverted compared to the pull‑down example.

### When to use internal vs external resistors

- **Internal pull‑up (`INPUT_PULLUP`)** is convenient and saves components. Its resistance (20–50 kΩ) is high, so it draws very little current【625912433625749†L79-L82】. However, the high resistance makes it susceptible to noise; avoid using it in very noisy environments or with long wires.  
- **External pull‑up/down resistors** give you more control over the default state and resistance value. For noisy environments you can choose a lower value (e.g., 1 kΩ) to provide a stronger bias【892551830113941†L505-L512】.

## 4. Debouncing: dealing with button bounce

Mechanical switches do not change state cleanly. When you press or release a button, the contacts bounce and the voltage oscillates rapidly between HIGH and LOW for a short period (average ≈1.5 ms, sometimes up to 157 ms)【263116106733561†L218-L236】. Without debouncing, your code may register multiple button presses for a single press【263116106733561†L190-L200】.

### Software debouncing

A common software technique is to detect a change, wait for the bounce to settle, and then confirm the state【263116106733561†L275-L283】. The debounce delay should be long enough to cover the worst‑case bounce; typical values between 50 ms and 100 ms are used【263116106733561†L290-L302】.

Below is a simple example that toggles an LED on each button press using debouncing:

```cpp
#define BUTTON_PIN 3
#define LED_PIN 13
int lastButtonState = HIGH;    // store previous reading (using pull‑up, so HIGH means not pressed)
unsigned long lastDebounceTime = 0;
const unsigned long debounceDelay = 50;  // adjust between 20–100 ms as needed
bool ledState = false;

void setup() {
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  int reading = digitalRead(BUTTON_PIN);
  // If the switch changed, due to noise or pressing
  if (reading != lastButtonState) {
    lastDebounceTime = millis(); // reset the debouncing timer
  }

  if ((millis() - lastDebounceTime) > debounceDelay) {
    // if the button state has been stable for longer than debounceDelay, treat it as valid
    if (reading != lastButtonState) {
      lastButtonState = reading;
      if (reading == LOW) {
        // toggle the LED state
        ledState = !ledState;
        digitalWrite(LED_PIN, ledState ? HIGH : LOW);
      }
    }
  }

  // save the reading for next time
  lastButtonState = reading;
}
```

### Debounce exercise

1. Upload the code above and observe that the LED toggles reliably each time you press the button, without spurious multiple toggles.  
2. Experiment with different `debounceDelay` values (e.g., 20 ms vs. 100 ms) and note how it affects responsiveness vs. bounce filtering.  
3. Use the Serial Monitor to print the button state and see how the debouncing logic works internally.

## 5. Challenge project: Build a simple counter

Combine the concepts learned so far by building a **counter**: every time you press the button, the Arduino increments a counter and displays the number of presses on the Serial Monitor. Reset the counter by holding the button for more than one second (detect a long press). Hints:

- Use the debouncing technique to detect clean presses.  
- Keep track of the current count in a variable.  
- Use `Serial.println()` to display the count.  
- For the long‑press reset, measure how long the button is held down using `millis()`.

This project consolidates your knowledge of inputs, outputs, and timing.

## 6. Additional resources

- **Video:** *AddOhms – Pull‑Up Resistor Tutorial* (YouTube). This video visually demonstrates why you need pull‑up resistors and shows oscilloscope traces. Watch from **0:00 – 2:30** for an explanation of floating inputs and from **6:00 – 8:00** for resistor value discussion.  
- **Video:** *Arduino – Debounce a Push Button (+ Visual Explanation)*. Watch from **1:00 – 4:00** to see how bounce looks on a plot and learn another debouncing technique.  
- **Reading:** *Understanding the Pull‑up/Pull‑down Resistors With Arduino* by PanosA6 on Instructables explains how floating pins cause flickering LEDs and recommends using a 4.7 kΩ or 10 kΩ pull‑up resistor【519341269813324†L74-L82】【519341269813324†L130-L135】.

## Summary

- Floating pins produce random values and must be tied to a known logic level using pull‑up or pull‑down resistors【625912433625749†L153-L169】.  
- External pull‑downs or pull‑ups typically use resistors in the 1 kΩ–100 kΩ range; 10 kΩ is common【625912433625749†L248-L263】【892551830113941†L505-L512】.  
- Arduino’s `INPUT_PULLUP` mode enables an internal ≈20–50 kΩ pull‑up resistor to bias the pin HIGH【625912433625749†L79-L82】【625912433625749†L231-L234】.  
- Debouncing is essential because mechanical switches bounce; software debouncing delays and checks the state after the bounce period【263116106733561†L275-L283】【263116106733561†L290-L302】.

Congratulations! You now know how to read reliable button presses and can use this knowledge in future projects such as menus, game controllers, or user interfaces.
