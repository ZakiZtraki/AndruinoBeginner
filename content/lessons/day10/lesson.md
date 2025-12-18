# Day 10 – 7‑Segment Displays

## Learning objectives

* Understand how a 7‑segment display works and differentiate between **common cathode** and **common anode** types.
* Wire a common cathode 7‑segment display to an Arduino using current‑limiting resistors.
* Write Arduino code that maps digits 0–9 to the appropriate segments and displays them sequentially.
* Build a countdown timer and integrate previous sensor data onto the display.
* Learn the concept of multiplexing for multi‑digit displays.

## Introduction: What is a 7‑segment display?

A 7‑segment display consists of seven individual LEDs arranged in the shape of the number “8.” Each LED is labelled **a** through **g**, and an optional eighth LED serves as the decimal point. By turning on different combinations of segments, the display can show the digits 0–9 and a few characters【865751415830727†L166-L176】.

There are two main types of 7‑segment displays:

* **Common cathode (CC)** – all the cathodes of the LED segments are connected together and tied to ground. To illuminate a segment, you drive its anode **HIGH**【865751415830727†L179-L184】. In many displays, pins 3 and 8 are the common cathodes【8206320365204†L150-L154】. The Jameco tutorial notes that setting a segment’s pin HIGH turns it on for a common cathode display【820333238483188†L10-L20】.
* **Common anode (CA)** – all the anodes are connected together and tied to +5 V. To illuminate a segment, you pull its cathode **LOW**【82063320365204†L160-L164】. Common anode displays are popular because many microcontrollers can sink more current than they can source【865751415830727†L190-L203】.

In either case, each LED segment requires a **current‑limiting resistor**. Standard red LEDs have a forward voltage of about **2 V**, and each segment draws around **12–15 mA**, so a **220 Ω resistor** is appropriate on a 5 V system【865751415830727†L245-L258】.

Most beginner kits use common cathode displays, so this lesson focuses on that type.

## Materials

* 1‑digit common cathode 7‑segment LED display
* 7 (or 8) × 220 Ω resistors (one per segment)
* Arduino Uno and USB cable
* Breadboard and jumper wires
* Optional: pushbutton (for countdown reset), ultrasonic sensor from Day 9

## Activity 1 – Identify and test the display

1. **Identify the pins.** A typical common cathode display has 10 pins: two common cathode pins (usually pins 3 and 8) and eight segment pins (a, b, c, d, e, f, g, dp). Consult the manufacturer’s datasheet to match each pin to its segment. Pins 3 and 8 should connect to ground【8206320365204†L150-L154】.
2. **Test each segment.** Temporarily connect each segment pin to +5 V through a 220 Ω resistor while the common pins are connected to GND. When you touch the resistor to a segment pin, its corresponding LED should light. This confirms your pinout.

## Activity 2 – Wiring the display

We’ll connect each segment to an Arduino digital pin through a resistor. The common cathode pins go to ground.

1. Place the display on your breadboard. Connect both common cathode pins (3 and 8) to **GND**.
2. Connect segment pins **a–g** and **dp** to Arduino pins **2–8** and **9** respectively (you can choose any unused pins). Insert a **220 Ω** resistor between each segment pin and the Arduino pin to limit current【865751415830727†L245-L258】.
3. The wiring table might look like this:

| Segment | Display pin | Arduino pin | Resistor |
|--------|-------------|-------------|----------|
| a      | 7           | 2           | 220 Ω     |
| b      | 6           | 3           | 220 Ω     |
| c      | 4           | 4           | 220 Ω     |
| d      | 2           | 5           | 220 Ω     |
| e      | 1           | 6           | 220 Ω     |
| f      | 9           | 7           | 220 Ω     |
| g      | 10          | 8           | 220 Ω     |
| dp     | 5           | 9           | 220 Ω     |

This arrangement uses eight pins for the segments. If you omit the decimal point, you only need seven pins.

## Activity 3 – Code to display digits

To display numbers on the 7‑segment, we create a lookup table (array) that specifies which segments to turn on for each digit. In a common cathode display, a `HIGH` value lights the segment.

```cpp
// Arduino pins connected to segments a, b, c, d, e, f, g, dp
int segPins[] = {2, 3, 4, 5, 6, 7, 8, 9};

// Segment configurations for digits 0–9 (a–g, dp)
// 1 = on, 0 = off
byte digitCodes[10][8] = {
  {1,1,1,1,1,1,0,0}, // 0
  {0,1,1,0,0,0,0,0}, // 1
  {1,1,0,1,1,0,1,0}, // 2
  {1,1,1,1,0,0,1,0}, // 3
  {0,1,1,0,0,1,1,0}, // 4
  {1,0,1,1,0,1,1,0}, // 5
  {1,0,1,1,1,1,1,0}, // 6
  {1,1,1,0,0,0,0,0}, // 7
  {1,1,1,1,1,1,1,0}, // 8
  {1,1,1,1,0,1,1,0}  // 9
};

void setup() {
  // Set all segment pins as outputs
  for (int i = 0; i < 8; i++) {
    pinMode(segPins[i], OUTPUT);
  }
}

// Display a single digit on the 7‑segment
void displayDigit(int num) {
  for (int i = 0; i < 8; i++) {
    digitalWrite(segPins[i], digitCodes[num][i]);
  }
}

void loop() {
  // Count 0–9 repeatedly
  for (int n = 0; n < 10; n++) {
    displayDigit(n);
    delay(1000);
  }
}
```

Upload the code. The display should cycle through digits 0–9, changing once per second. If some segments don’t light as expected, double‑check your wiring and resistor placement.

### Challenge: create a countdown timer

Modify the loop to count down from 9 to 0. Add a **pushbutton** from Day 3 to start or reset the countdown. When the button is pressed, reset the counter to 9. Use a `state` variable to track whether the timer is active.

## Activity 4 – Display sensor data

You can combine the ultrasonic sensor from Day 9 with your new display. For example, show the distance measurement’s **units digit** on the 7‑segment (e.g., display the last digit of the distance in centimeters). Simply call `displayDigit((int)distanceCm % 10);` inside the loop of your distance‑measurement code.

For multi‑digit displays, you’ll learn about multiplexing in the next section.

## Activity 5 – Introduction to multiplexing (advanced)

Driving multiple digits individually would consume seven pins per digit. Instead, we can **multiplex** the displays: all segment pins (a–g) are shared, and each digit has its own common cathode or anode pin. We rapidly turn each digit on and off in sequence, updating the segments to show its value. Because the refresh happens faster than human vision, all digits appear lit at once. The Jameco tutorial notes that multiplexing requires only two additional pins per extra digit【820333238483188†L93-L99】 and demonstrates a simple two‑digit circuit.

Here’s a simplified overview:

1. Define arrays `segPins[]` (shared among digits) and `digitPins[]` (one per digit). Each digit pin controls whether that digit’s common cathode is connected to ground.
2. Create a buffer `displayBuf[]` storing the numbers to show on each digit.
3. In `loop()`, call a `refreshDisplay()` function that cycles through each digit:
   * Activate one digit by pulling its cathode low and set the segment pins according to the corresponding number.
   * Wait a few milliseconds, then deactivate the digit and move to the next.
4. Update `displayBuf[]` with new numbers as needed (e.g., from a sensor reading).

We’ll explore full multiplexed displays and dedicated driver ICs (such as the CD4511 or MAX7219) later in the course. For now, it’s enough to understand the concept.

## Summary

In this lesson you learned that a 7‑segment display contains seven LED segments arranged to form numbers, plus an optional decimal point. Displays can be **common cathode**—where the cathodes are tied together and segments are lit by applying a HIGH signal—or **common anode**, where the anodes are tied together and segments are lit by pulling the cathode LOW【8206320365204†L150-L164】【865751415830727†L179-L193】. Each segment requires a current‑limiting resistor; a 220 Ω resistor is suitable for a 5 V system【865751415830727†L245-L258】. You wired a common cathode display to an Arduino, wrote code to display numbers 0–9, and built a countdown timer. You also learned how to show sensor data on the display and were introduced to multiplexing for multi‑digit displays. These skills prepare you to create richer interfaces for your projects and to integrate data from various sensors in the coming lessons.