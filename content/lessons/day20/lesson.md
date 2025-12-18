## Day 20 – Water Level Sensor & Liquid Detection

### Learning objectives

By the end of this lesson you will be able to:

1. **Describe how water level sensors work** and identify their pin functions.
2. **Wire a water level sensor to an Arduino** and read its analog output reliably.
3. **Calibrate sensor readings** and set threshold values for triggering alarms or pumps.
4. **Implement a simple water level indicator**, lighting LEDs or driving an actuator when the level crosses certain thresholds.
5. **Reduce corrosion and extend sensor life** by controlling sensor power and avoiding full immersion.

### How the water level sensor works

A typical water level sensor consists of **interleaved copper traces** on a printed circuit board.  One set of traces is connected to a 5 V supply through a 100 Ω resistor, while the other set connects to the base of an NPN transistor【760746864211831†L124-L154】.  When the board is dry, no current flows between the traces, so the transistor remains off and the output pin reads near 0 V.  As soon as water touches the sensor, it forms a conductive bridge between the traces.  Minerals and impurities in the water carry a tiny current into the transistor’s base, turning it on and raising the voltage on the output pin【760746864211831†L124-L154】.

Importantly, the output voltage isn’t just HIGH or LOW – it changes proportionally with water level.  More immersed area means more current flows into the transistor and the **analog output** increases【760746864211831†L148-L154】.  Some modules also include an **LM393 comparator** that compares the analog signal to a reference voltage set by a potentiometer.  When the signal crosses this threshold, the comparator flips the **digital output (DO)** from HIGH to LOW【568536163166220†L126-L144】.  This allows the module to provide both an analog voltage and a digital “water present” signal.  Two indicator LEDs show power and status; turning the potentiometer adjusts the digital threshold【568536163166220†L148-L156】【568536163166220†L217-L231】.

### Module pinout and specifications

Most water level sensor modules provide three or four pins:

| Pin | Function | Notes |
|---|---|---|
| **S / AO** | Analog output voltage proportional to water level【760746864211831†L168-L174】【568536163166220†L165-L168】. | Connects to an Arduino analog input (A0). |
| **DO** (optional) | Digital output from LM393 comparator【568536163166220†L126-L144】. | LOW when water level exceeds threshold; HIGH otherwise. |
| **VCC** | Power supply 3.3 V–5 V【760746864211831†L172-L176】【568536163166220†L174-L176】. | Supplying 5 V gives the widest ADC range; however, powering through a digital pin can reduce corrosion【760746864211831†L186-L199】【568536163166220†L190-L199】. |
| **GND** | Ground reference. | Must be connected to Arduino GND. |

> **Tip:** The analog reading depends on supply voltage【760746864211831†L172-L176】.  To get consistent results, keep VCC stable and reference it when converting to percentage.

### Wiring and powering the sensor

If your module has only three pins (S, VCC and GND), connect **VCC** to the Arduino’s **5 V** pin and **GND** to ground, then connect **S** to **A0**【760746864211831†L172-L176】【760746864211831†L201-L209】.  However, continuously powering the sensor in water accelerates corrosion【760746864211831†L186-L199】【568536163166220†L190-L199】.  A better approach is to control the sensor’s power from a digital output:

1. Connect **VCC** to digital pin 7 instead of the 5 V pin【760746864211831†L186-L199】.
2. Set pin 7 as an OUTPUT in `setup()` and drive it HIGH only when you’re about to take a reading, then LOW afterwards【760746864211831†L186-L199】.
3. Connect **S** to **A0** and **GND** to ground【760746864211831†L201-L209】.

If your module has a **DO** pin and an onboard comparator, wire **DO** to any digital input pin (e.g., D8) and adjust the threshold using the built‑in potentiometer【568536163166220†L165-L172】【568536163166220†L217-L231】.  Turning the potentiometer clockwise increases sensitivity (triggering at lower water levels), while turning it counter‑clockwise decreases sensitivity.

> **Note:** Only the lower part of the sensor should be submerged.  Do not immerse the entire PCB; the circuitry is not waterproof【760746864211831†L256-L265】.

### Reading the analog level

The following sketch controls the sensor power via pin 7, reads the analog voltage and converts it to a percentage level.  It also blinks an LED and plays a tone when the water level drops below a threshold.

```cpp
const int sensorPower = 7;
const int sensorPin = A0;
const int alarmLED = 4;
const int buzzerPin = 5;

void setup() {
  pinMode(sensorPower, OUTPUT);
  digitalWrite(sensorPower, LOW); // keep sensor off initially
  pinMode(alarmLED, OUTPUT);
  pinMode(buzzerPin, OUTPUT);
  Serial.begin(9600);
}

int readLevel() {
  digitalWrite(sensorPower, HIGH);
  delay(10);                     // let the sensor stabilise
  int raw = analogRead(sensorPin);
  digitalWrite(sensorPower, LOW);
  return raw;
}

void loop() {
  int reading = readLevel();
  // Convert raw reading (0–1023) to percentage (assuming 5V supply)
  float levelPct = (reading / 1023.0) * 100.0;
  Serial.print("Raw: "); Serial.print(reading);
  Serial.print("  Level: "); Serial.print(levelPct); Serial.println(" %");
  // Trigger alarm if level below 20%
  if (levelPct < 20) {
    digitalWrite(alarmLED, HIGH);
    tone(buzzerPin, 1000, 200);
  } else {
    digitalWrite(alarmLED, LOW);
  }
  delay(1000);
}
```

**Explanation**

* `sensorPower` controls VCC to reduce corrosion and save power【760746864211831†L186-L199】.
* After turning the sensor on, wait ~10 ms for the output to stabilise before reading【760746864211831†L248-L253】.
* The reading is scaled to a percentage; adjust the divisor if using 3.3 V supply.
* The alarm triggers an LED and a buzzer (from Day 4) when water is low.  You could instead activate a pump via a transistor or relay.

### Using the digital output

If your module includes a **digital output** (DO), you can offload threshold detection to the hardware comparator.  After wiring **DO** to a digital input (e.g., pin 8), use `digitalRead()` to determine when the water level crosses the set threshold:

```cpp
const int sensorPower = 7;
const int digitalPin = 8;

void setup() {
  pinMode(sensorPower, OUTPUT);
  pinMode(digitalPin, INPUT);
  digitalWrite(sensorPower, LOW);
  Serial.begin(9600);
}

int readDigital() {
  digitalWrite(sensorPower, HIGH);
  delay(10);
  int state = digitalRead(digitalPin);  // HIGH means dry; LOW means wet【568536163166220†L170-L173】
  digitalWrite(sensorPower, LOW);
  return state;
}

void loop() {
  int wet = !readDigital();   // invert logic: HIGH->dry, LOW->wet
  if (wet) {
    Serial.println("Water detected!");
  } else {
    Serial.println("No water");
  }
  delay(1000);
}
```

Use the on‑board potentiometer to adjust the trigger point: sprinkle water on the sensor and turn the potentiometer until the status LED just changes state【568536163166220†L217-L231】.

### Calibrating and interpreting readings

Water sensor readings vary with water quality and sensor production tolerance.  Distilled water reads lower because of its low conductivity【760746864211831†L323-L325】.  To calibrate:

1. Dry the sensor completely and record the raw ADC value; this should be near **0**【760746864211831†L256-L259】.
2. Submerge only the lower portion of the sensor about halfway and record the value.
3. Immerse to the maximum safe depth and record the full‑scale reading.  Example values might be 0 (dry), 420 (half‑submerged) and 520 (fully submerged)【760746864211831†L328-L333】.
4. Use these calibration points to map the ADC reading to a percentage or to set thresholds for actions.

Keep in mind that the analog output increases as more of the sensor is submerged【760746864211831†L148-L154】.  Because the sensor is not linear across its entire length, calibrating at multiple points improves accuracy.

### Project ideas

* **Automatic plant watering** – Use the sensor to detect when the water level in a reservoir is low and activate a pump (via transistor or relay) to refill it.  Combine with the EEPROM from Day 17 to remember threshold settings.
* **Aquarium monitor** – Mount the sensor vertically inside an aquarium’s filter compartment to trigger an alarm when water drops below a safe level.  Combine with the LCD from Day 16 to display the level and status.
* **Rain catcher gauge** – Use a deep narrow container with the sensor inserted and log the rainfall volume over time.  Consider using the comparator output to wake an ESP8266 for energy‑efficient remote monitoring.

### Troubleshooting and best practices

| Symptom | Cause | Solution |
|---|---|---|
| **Sensor output always high** | Sensor dry or supply disconnected | Ensure the sensor’s lower traces are in contact with water and that the sensor is powered correctly. |
| **Sensor output does not change** | Sensor corroded or scaled | Inspect the copper traces for corrosion; clean gently or replace sensor. Powering only when reading reduces corrosion【760746864211831†L186-L199】【568536163166220†L190-L199】. |
| **Readings drift or are inconsistent** | Fluctuating supply voltage or water conductivity | Use a stable 5 V supply; calibrate with your specific water sample and consider averaging several readings. |
| **Digital output never triggers** | Threshold not set properly | Adjust the potentiometer on the comparator module until the status LED toggles at the desired water level【568536163166220†L217-L231】. |
| **Sensor damaged** | Full immersion or water reached electronics | Only immerse the sensor’s lower portion; keep the electronics dry【760746864211831†L256-L265】. |

### Summary

Water level sensors provide a simple way to monitor liquid levels using the conductivity of water.  Interleaved traces form a variable resistance network that drives an NPN transistor to produce an analog output voltage proportional to immersion【760746864211831†L124-L154】.  Many modules include an LM393 comparator, offering a digital output with an adjustable threshold【568536163166220†L126-L144】.  Connecting VCC through a digital pin allows you to power the sensor only when reading, reducing corrosion【760746864211831†L186-L199】【568536163166220†L190-L199】.  Calibrating the sensor with known levels lets you convert raw ADC values into meaningful measurements【760746864211831†L316-L337】.  With these techniques, you can build reliable water level indicators, alarms and automated refilling systems.