# Day 9 – Ultrasonic Distance Measurement

## Learning objectives

- Explain how the HC‑SR04 ultrasonic sensor measures distance using sound waves.
- Wire the HC‑SR04 to an Arduino and take distance readings.
- Calculate distance from echo pulse duration and display it on the Serial Monitor.
- Create a simple parking‑assistant alarm using a variable‑rate beeper.
- Experiment with calibration, range and angle of detection.

## Introduction: How ultrasonic distance sensors work

Ultrasonic sensors emit high‑frequency sound waves and measure how long it takes for the echo to return after bouncing off an object. The **HC‑SR04** is one of the most common modules for Arduino projects. It contains two ultrasonic transducers: one transmitter sends a burst of **40 kHz** sound waves, and the other listens for the echo【525653356484419†L161-L169】. The time between sending the pulse and receiving the echo corresponds to how far away the object is【525653356484419†L169-L172】.

According to the datasheet, the HC‑SR04 operates at **5 V**, draws about **15 mA**, and uses a **10 µs TTL pulse** to trigger a measurement【525653356484419†L141-L149】. It can detect objects from **2 cm to 4 m** (about 13 ft) away with an accuracy of **±3 mm**【525653356484419†L129-L131】【525653356484419†L141-L147】, and its beam spreads roughly **15°**【525653356484419†L147-L149】. During a measurement the **Echo** pin remains high for a period ranging from **150 µs to 25 ms**, depending on the distance【525653356484419†L190-L196】. If no object is detected within ~13 ft, the sensor times out after **38 ms**【525653356484419†L200-L202】.

## Materials

- HC‑SR04 ultrasonic distance sensor
- Arduino Uno and USB cable
- Breadboard and jumper wires
- Buzzer or LED (for the parking sensor)
- 220 Ω resistor (if using an LED)
- Optional: 7‑segment or LCD display (for advanced output)

## Activity 1 – Wiring the HC‑SR04

1. Disconnect the Arduino from power.
2. Place the HC‑SR04 on the breadboard. Identify its four pins: **VCC**, **Trig**, **Echo**, and **GND**.
3. Connect **VCC** to the Arduino’s **5 V** pin and **GND** to **ground**. According to the module’s pinout, power should come from the 5 V supply【525653356484419†L158-L160】【525653356484419†L174-L175】.
4. Connect **Trig** to **digital pin 9** and **Echo** to **digital pin 10**【525653356484419†L244-L247】. You can choose different pins, but they must be configured in your code.
5. If using an external LED, connect its anode to **digital pin 8** through a **220 Ω** resistor and its cathode to **ground**. If using a buzzer, connect one terminal to **digital pin 8** and the other to **ground**.

Double‑check that your wiring matches the table below:

| HC‑SR04 pin | Arduino pin |
|------------|-------------|
| VCC        | 5 V         |
| Trig       | D9          |
| Echo       | D10         |
| GND        | GND         |

## Activity 2 – Measuring distance

The HC‑SR04 is triggered by sending a **10 µs pulse** to the **Trig** pin【525653356484419†L141-L149】【525653356484419†L161-L163】. When the sensor receives this pulse, it emits eight ultrasonic bursts at 40 kHz【525653356484419†L161-L165】. Immediately after, the **Echo** pin goes HIGH and remains HIGH until the reflected sound is detected【525653356484419†L166-L170】. The length of this HIGH pulse is proportional to the distance【525653356484419†L169-L172】.

We can calculate distance using the equation:

> **distance (cm) = (echo_time in µs × 0.034) / 2**

This formula multiplies the pulse duration by the speed of sound (0.034 cm/µs) and divides by 2 because the sound travels to the object and back【525653356484419†L218-L235】.

Here’s a simple sketch that triggers the sensor, measures the echo pulse, and prints the distance to the Serial Monitor. It uses the `pulseIn()` function to measure the length of the HIGH pulse on the Echo pin.

```cpp
const int trigPin = 9;
const int echoPin = 10;
const int ledPin  = 8;   // LED or buzzer

void setup() {
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(ledPin, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  // Send a 10 µs trigger pulse
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  
  // Measure the length of the echo pulse
  long duration = pulseIn(echoPin, HIGH, 38000L); // timeout after 38 ms【525653356484419†L190-L202】
  
  // If no echo is received, skip calculation
  if (duration == 0) {
    Serial.println("Out of range");
  } else {
    // Calculate distance: speed of sound 0.034 cm/µs; divide by 2
    float distanceCm = duration * 0.034 / 2.0;
    Serial.print("Distance: ");
    Serial.print(distanceCm);
    Serial.println(" cm");
  }
  delay(500); // wait half a second before next reading
}
```

Upload the code and open the Serial Monitor. Place an object at various distances and observe the readings. Do they match a ruler or tape measure? Try moving the sensor toward and away from the object slowly to see the values update.

### Troubleshooting tips

- If you always get “Out of range,” verify that **Trig** and **Echo** pins are wired correctly, and check that the object is within 4 m【525653356484419†L129-L130】【525653356484419†L147-L149】.
- Keep objects within the sensor’s **15°** beam; reflections off angled surfaces may not return to the sensor【525653356484419†L147-L149】.
- Avoid soft fabrics or absorbent materials, which may dampen the echo.
- Use `delayMicroseconds` to produce a proper 10 µs trigger pulse. Longer pulses may produce inaccurate measurements.

## Activity 3 – Parking‑assistant buzzer

Let’s build a “parking sensor” that beeps faster as you approach an obstacle. We’ll reuse the `tone()` function from Day 4. The closer the object, the higher the beep frequency. Far away objects produce slow beeps or none.

```cpp
const int trigPin  = 9;
const int echoPin  = 10;
const int buzzerPin = 8;

void setup() {
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(buzzerPin, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  // Trigger the pulse
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  long duration = pulseIn(echoPin, HIGH, 38000L);
  if (duration == 0) {
    noTone(buzzerPin);
  } else {
    float distCm = duration * 0.034 / 2.0;
    // Map distance to frequency. Closer means higher pitch.
    // Clip distances between 2 and 100 cm for mapping.
    float clamped = constrain(distCm, 2.0, 100.0);
    int frequency = map((int)clamped, 2, 100, 2000, 500);
    tone(buzzerPin, frequency, 50);
  }
  delay(100);
}
```

Test your parking‑assistant by moving your hand slowly toward the sensor. You should hear the pitch rise as the distance decreases. Experiment with the mapping range and frequencies to make the alarm more or less sensitive.

### Challenge: Visual display (optional)

Try displaying the measured distance on a **7‑segment display** or a **16×2 LCD**. You will learn how to drive these displays in upcoming lessons, but if you’re feeling adventurous, connect a display now and show the distance in centimeters. Alternatively, send the data to a computer using the Serial Plotter to visualise the measurements as a graph.

## Activity 4 – Calibration and experiments

1. **Range test:** Place a flat object (e.g., a book) at distances from 2 cm to 100 cm in 10 cm increments. Record the sensor’s readings. How close are they to the actual distances? Plot your results and calculate the error.
2. **Angle test:** Slowly rotate the sensor away from a perpendicular object until it stops detecting. Estimate the beam width in degrees. Does it match the **15°** specification?【525653356484419†L147-L149】
3. **Temperature effect:** The speed of sound depends on air temperature. On a hot day, the sensor will read slightly longer distances, because sound travels faster. Try measuring the same distance indoors and outdoors and compare the results. For more accuracy, use `0.033` or `0.035` cm/µs depending on the ambient temperature.
4. **Soft surfaces:** Test the sensor on a pillow or cloth. Does the reading drop or become unstable? Discuss why sound absorption affects measurements.

## Summary

In this lesson you learned how ultrasonic sensors measure distance by sending sound pulses and listening for echoes. You wired the HC‑SR04 to your Arduino and discovered that it requires a **5 V** supply and a **10 µs** trigger pulse【525653356484419†L141-L149】. The sensor can detect objects from **2 cm to 4 m** with a beam angle of about **15°**【525653356484419†L129-L131】【525653356484419†L147-L149】. By timing how long the **Echo** pin stays high【525653356484419†L166-L172】, you calculated distance using the speed of sound【525653356484419†L218-L235】. You built a simple distance meter and turned it into a parking‑assistant that modulates its beep frequency based on distance. Finally, you calibrated the sensor’s range and explored factors like angle, temperature and surface texture that influence readings.