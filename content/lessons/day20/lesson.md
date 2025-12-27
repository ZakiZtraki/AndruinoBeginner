## Day 20 – Water Level Sensor & Liquid Detection

### Learning objectives

By the end of this lesson you will be able to:

1. **Describe how water level sensors work** and identify their pin functions.
2. **Wire a water level sensor to an Arduino** and read its analog output reliably.
3. **Calibrate sensor readings** and set threshold values for triggering alarms or pumps.
4. **Implement a simple water level indicator**, lighting LEDs or driving an actuator when the level crosses certain thresholds.
5. **Reduce corrosion and extend sensor life** by controlling sensor power and avoiding full immersion ([Electrolysis](https://en.wikipedia.org/wiki/Electrolysis)).

### How the water level sensor works

A typical water level sensor uses exposed traces to measure the **conductivity** of water.  As more of the sensor is immersed, the conductivity between the traces increases and the **analog output** rises accordingly ([Grove Water Sensor](https://wiki.seeedstudio.com/Grove-Water_Sensor/)).  Because the output is analog, you can read it with `analogRead()` and map it to a percentage or a custom scale.

### Module pinout and specifications

Most water level sensor modules provide three pins:

| Pin | Function | Notes |
|---|---|---|
| **S / AO** | Analog output voltage proportional to water level. | Connects to an Arduino analog input (A0). |
| **VCC** | Power supply 5 V. | Use the module’s rated supply voltage. |
| **GND** | Ground reference. | Must be connected to Arduino GND. |

Source: [Grove Water Sensor](https://wiki.seeedstudio.com/Grove-Water_Sensor/).

> **Tip:** The analog reading depends on supply voltage.  To get consistent results, keep VCC stable and reference it when converting to percentage.

### Wiring and powering the sensor

If your module has only three pins (S, VCC and GND), connect **VCC** to the Arduino’s **5 V** pin and **GND** to ground, then connect **S** to **A0**.  However, running DC current through water can accelerate **electrolysis and corrosion**.  A better approach is to control the sensor’s power from a digital output so it is only powered during measurements ([Electrolysis](https://en.wikipedia.org/wiki/Electrolysis)):

1. Connect **VCC** to digital pin 7 instead of the 5 V pin.
2. Set pin 7 as an OUTPUT in `setup()` and drive it HIGH only when you’re about to take a reading, then LOW afterwards.
3. Connect **S** to **A0** and **GND** to ground.

> **Note:** Only the lower part of the sensor should be submerged.  Do not immerse the entire PCB; the circuitry is not waterproof.

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

* `sensorPower` controls VCC to reduce corrosion and save power.
* After turning the sensor on, wait ~10 ms for the output to stabilise before reading.
* The reading is scaled to a percentage; adjust the divisor if using 3.3 V supply.
* The alarm triggers an LED and a buzzer (from Day 4) when water is low.  You could instead activate a pump via a transistor or relay.

### Calibrating and interpreting readings

Water sensor readings vary with water quality and sensor production tolerance.  Distilled water reads lower because of its low conductivity ([Electrical conductivity of water](https://en.wikipedia.org/wiki/Electrical_conductivity_of_water)).  To calibrate:

1. Dry the sensor completely and record the raw ADC value; this should be near **0**.
2. Submerge only the lower portion of the sensor about halfway and record the value.
3. Immerse to the maximum safe depth and record the full‑scale reading.  Example values might be 0 (dry), 420 (half‑submerged) and 520 (fully submerged).
4. Use these calibration points to map the ADC reading to a percentage or to set thresholds for actions.

Keep in mind that the analog output increases as more of the sensor is submerged.  Because the sensor is not linear across its entire length, calibrating at multiple points improves accuracy.

### Project ideas

* **Automatic plant watering** – Use the sensor to detect when the water level in a reservoir is low and activate a pump (via transistor or relay) to refill it.  Combine with the EEPROM from Day 17 to remember threshold settings.
* **Aquarium monitor** – Mount the sensor vertically inside an aquarium’s filter compartment to trigger an alarm when water drops below a safe level.  Combine with the LCD from Day 16 to display the level and status.
* **Rain catcher gauge** – Use a deep narrow container with the sensor inserted and log the rainfall volume over time.  For low‑power logging, power the sensor only when taking a sample.

### Troubleshooting and best practices

| Symptom | Cause | Solution |
|---|---|---|
| **Sensor output always high** | Sensor dry or supply disconnected | Ensure the sensor’s lower traces are in contact with water and that the sensor is powered correctly. |
| **Sensor output does not change** | Sensor corroded or scaled | Inspect the copper traces for corrosion; clean gently or replace sensor. Powering only when reading reduces corrosion. |
| **Readings drift or are inconsistent** | Fluctuating supply voltage or water conductivity | Use a stable 5 V supply; calibrate with your specific water sample and consider averaging several readings. |
| **Sensor damaged** | Full immersion or water reached electronics | Only immerse the sensor’s lower portion; keep the electronics dry. |

### Summary

Water level sensors provide a simple way to monitor liquid levels using the conductivity of water.  Exposed traces form a variable resistance network that produces an analog output voltage proportional to immersion ([Grove Water Sensor](https://wiki.seeedstudio.com/Grove-Water_Sensor/)).  Connecting VCC through a digital pin allows you to power the sensor only when reading, reducing electrolysis and corrosion ([Electrolysis](https://en.wikipedia.org/wiki/Electrolysis)).  Calibrating the sensor with known levels lets you convert raw ADC values into meaningful measurements.  With these techniques, you can build reliable water level indicators, alarms and automated refilling systems.
