# Day 7 – Smart Night‑Light with Manual Override

Today concludes your first week by combining everything you’ve learned so far.  You will build a **smart night‑light** that automatically brightens when it’s dark and dims when it’s bright, **but** you’ll also add a **pushbutton** to switch between automatic and manual modes.  This project integrates digital inputs, analog sensors, PWM outputs and simple state logic.

## Learning objectives

By the end of this lesson you will be able to:

1. Build a circuit that combines a **photoresistor**, **LED** and **pushbutton** using pull‑down resistors.
2. Write code that reads multiple inputs, maps analog values to PWM brightness and toggles state based on a button press.
3. Implement a basic **state machine** to switch between automatic and manual modes.
4. Describe the role of a **pull‑down resistor** in ensuring a stable default state for the pushbutton and recognise how the logic changes if you use a pull‑up resistor ([Arduino digital pins guide](https://docs.arduino.cc/learn/microcontrollers/digital-pins)).

## Materials

- Arduino Uno or compatible microcontroller
- **Photoresistor (LDR)**
- **10 kΩ resistor** (for the voltage divider)
- **LED** and **330 Ω resistor**
- **Pushbutton**
- **10 kΩ resistor** (for the pull‑down on the button)
- Breadboard and jumper wires
- (Optional) **Buzzer** for audible feedback

## Part 1 – Wiring the combined circuit

Follow these steps to assemble the circuit.  Build each sub‑circuit separately, then connect them together on your breadboard.

### Step 1 – Photoresistor voltage divider

1. Insert the **photoresistor** into the breadboard.  Connect **one lead to 5 V** and the **other lead to analog pin A0**.  This is the same voltage divider you built yesterday ([SparkFun photocell guide](https://learn.sparkfun.com/tutorials/photocell-hookup-guide)).
2. Connect a **10 kΩ resistor** between **A0** and **GND**.  Together, the photoresistor and this fixed resistor form a voltage divider that converts light intensity into a voltage that the Arduino can measure ([SparkFun photocell guide](https://learn.sparkfun.com/tutorials/photocell-hookup-guide)).

### Step 2 – LED with PWM control

1. Place the **LED** on the breadboard.  Remember that the **long leg (anode)** goes to your PWM pin and the **short leg (cathode)** goes through a resistor to ground.
2. Connect the anode to **digital pin 9** (or any PWM‑capable pin) via a jumper wire ([Arduino analogWrite reference](https://docs.arduino.cc/language-reference/en/functions/analog-io/analogWrite/)).
3. Connect the cathode to one end of a **330 Ω resistor**, and connect the other end of the resistor to **GND**.

### Step 3 – Pushbutton with pull‑down resistor

1. Insert the **pushbutton** into the breadboard so that its two legs straddle the central gap.
2. Connect **one leg** of the button to **GND** through a **10 kΩ resistor**.  This resistor is the **pull‑down** resistor that ensures the button’s default state is **LOW** ([SparkFun pull‑up resistors tutorial](https://learn.sparkfun.com/tutorials/pull-up-resistors)).
3. Connect the **same leg** of the button to **digital pin 2** using a jumper wire.  This pin will read the button state.
4. Connect the **other leg** of the button to **5 V**.  When the button is pressed, this leg is connected to 5 V, causing the pin to read **HIGH**.  When released, the pull‑down resistor pulls the pin to ground so it reads **LOW**.

> **Why a pull‑down?** Without the resistor, a floating input can randomly read HIGH or LOW due to noise.  The pull‑down provides a path to ground when the button is not pressed, defining a clear default state ([Arduino digital pins guide](https://docs.arduino.cc/learn/microcontrollers/digital-pins)).

> **What about INPUT_PULLUP?** You could also use the built‑in `INPUT_PULLUP` mode instead of an external resistor.  In that case you would connect the button between the input pin and ground; the default state is HIGH and pressing the button pulls it LOW ([Arduino pinMode reference](https://docs.arduino.cc/language-reference/en/functions/digital-io/pinMode/)).  Our project uses a pull‑down to practise working with discrete components.

### Step 4 – (Optional) Buzzer for feedback

If you’d like audible feedback when switching modes or when a flame is detected, connect a buzzer as you did in Day 4: attach the positive terminal to **digital pin 8** and the negative terminal to **GND**.  We’ll use a short beep to indicate mode changes.

After wiring, double‑check that there are no loose connections and that the 5 V and GND rails are correctly powered.

## Part 2 – Writing the smart night‑light sketch

In this program you will implement two modes: **automatic** and **manual**.  In automatic mode, the LED brightness responds to the ambient light measured by the photoresistor.  In manual mode, you control the LED brightness using the button: each press toggles the LED between **full brightness** and **off**.

### Step 1 – Plan the state machine

We’ll use a Boolean variable called `automaticMode` to store the current mode.  When `automaticMode` is `true`, the LED follows the light sensor.  When `false`, the LED’s state toggles each time the button is pressed.  We also need to keep track of the **last button state** to detect the moment the button transitions from HIGH to LOW (i.e. when you release it).  This technique is called **state change detection** and ensures that the LED toggles only once per press.

### Step 2 – Write the code

Create a new sketch in the Arduino IDE and enter the following code:

```cpp
const int sensorPin    = A0;  // photoresistor analog input
const int ledPin       = 9;   // PWM LED
const int buttonPin    = 2;   // pushbutton with pull‑down
const int buzzerPin    = 8;   // optional buzzer

bool automaticMode = true;     // start in automatic mode
bool ledState = false;         // remembers LED on/off in manual mode
int lastButtonState = LOW;     // stores previous button state

void setup() {
  Serial.begin(9600);
  pinMode(ledPin, OUTPUT);
  pinMode(buttonPin, INPUT);    // using external pull‑down
  pinMode(buzzerPin, OUTPUT);
}

void loop() {
  // Read current button state
  int buttonState = digitalRead(buttonPin);

  // Detect a change (button press or release)
  if (buttonState != lastButtonState) {
    // Only act on the release (button goes from HIGH to LOW)
    if (buttonState == LOW) {
      if (automaticMode) {
        // Switch from automatic to manual mode
        automaticMode = false;
        tone(buzzerPin, 2000, 100);  // feedback beep
      } else {
        // In manual mode: toggle LED state
        ledState = !ledState;
        tone(buzzerPin, 1000, 50);   // different beep for toggle
      }
    }
    lastButtonState = buttonState;
  }

  if (automaticMode) {
    // Automatic mode: read light level and map to PWM brightness
    int raw = analogRead(sensorPin);      // 0–1023 depending on light
    int brightness = map(raw, 0, 1023, 255, 0);
    brightness = constrain(brightness, 0, 255);
    analogWrite(ledPin, brightness);
    Serial.print("Mode: auto\tLight: ");
    Serial.print(raw);
    Serial.print("\tLED: ");
    Serial.println(brightness);
  } else {
    // Manual mode: write LED state (full on or off)
    analogWrite(ledPin, ledState ? 255 : 0);
    Serial.print("Mode: manual\tLED: ");
    Serial.println(ledState ? "ON" : "OFF");
  }
  delay(20);  // small delay to reduce bounce
}
```

**How it works:**

1. **State change detection:** We compare the current `buttonState` with `lastButtonState`.  When they differ, we know the button has changed state.  We act only on the **release** (HIGH → LOW transition) so that each press triggers one action.
2. **Mode switching and LED toggle:** If we’re in automatic mode when a release occurs, we switch to manual mode.  If we’re already in manual mode, we flip `ledState` to turn the LED fully on or off.  This implements a simple **state machine** that responds differently depending on the current mode.
3. **Automatic mode behaviour:** We read the photoresistor and map the value to a PWM duty cycle (dark → bright) using `map()` and `constrain()` ([Arduino map()](https://docs.arduino.cc/language-reference/en/functions/math/map/) and [constrain()](https://docs.arduino.cc/language-reference/en/functions/math/constrain/)).  We use `constrain()` to keep the value between 0 and 255.
4. **Manual mode behaviour:** We ignore the sensor and set the LED to either full brightness or off based on `ledState`.
5. **Buzzer feedback:** Two different tones provide audible confirmation: a longer beep when switching from automatic to manual and a shorter beep when toggling the LED within manual mode ([Arduino tone reference](https://docs.arduino.cc/language-reference/en/functions/advanced-io/tone/)).  You can customise the frequencies and durations.

> **Calibration tip:** If your photoresistor never reaches the extremes (0 or 1023), adjust the `map()` range, for example `map(raw, 300, 800, 255, 0)`, as you learned in Day 6.  You can print `raw` values to the Serial Monitor to determine appropriate thresholds.

### Step 3 – Test your smart night‑light

1. Upload the sketch and open the Serial Monitor.
2. Place your hand over the photoresistor to simulate darkness; the LED should brighten.  Shine a light on it to dim the LED.
3. Press and release the button.  You should hear a short beep (if a buzzer is connected) and the LED should stop reacting to light.  Press again to return to automatic mode.  Observe the `Mode:` message in the Serial Monitor.
4. Try adjusting the `map()` parameters or adding additional button presses to toggle between more than two brightness levels.

## Part 3 – Extension challenges

1. **Night‑light with alarm:** Integrate the flame sensor from Day 6.  In automatic mode the LED dims and brightens based on light; if the flame sensor detects IR, override everything and flash the LED rapidly or activate the buzzer.  Use an analog threshold (from the Day 6 flame‑sensor calibration) to trigger the alarm.
2. **Variable brightness steps:** Modify manual mode so that each button press cycles through **off → low → medium → high → off**.  Use an array of PWM values (e.g. `{0, 85, 170, 255}`) and increment an index on each button release.
3. **Save preferences:** Use the EEPROM library to store the last used manual brightness level or mode so that your night‑light remembers its state after power cycling.

## Troubleshooting

- **LED doesn’t respond to light changes:** Verify that the photoresistor and 10 kΩ resistor form a proper voltage divider with one side at 5 V, the other at A0 and the resistor to GND.  Check your `map()` parameters.
- **Button always reads HIGH or LOW:** Ensure that one leg of the button is connected to 5 V and the other to the pull‑down resistor and digital pin.  Mistaken wiring or a missing resistor will cause a floating input and unpredictable behaviour.
- **Beep doesn’t sound:** Confirm that the buzzer’s positive terminal goes to pin 8 and the negative to GND.  Remember that `tone()` may interfere with PWM on pins 3 and 11 ([Arduino tone reference](https://docs.arduino.cc/language-reference/en/functions/advanced-io/tone/)).
- **Mode doesn’t switch:** Make sure you are detecting the transition from HIGH to LOW correctly.  A missing `lastButtonState` update will cause repeated toggling or no toggling at all.

## Summary

Congratulations!  You have completed Week 1 of your DIY electronics journey by integrating multiple sensors and inputs into a cohesive project.  In this lesson you used a **pull‑down resistor** to ensure a stable default state for a pushbutton and wrote code that detects **state changes** to switch modes.  You combined analog readings from a photoresistor with PWM output to dim an LED, and you learned to toggle between automatic and manual control.  These techniques lay the groundwork for more complex interactive devices in the coming weeks.  Take a moment to experiment with different brightness levels, thresholds and modes.  Your smart night‑light is a great example of how simple components can create intelligent behaviour!
