# Day 1 – Orientation & Safety

## Objectives

- Familiarize yourself with your DIY electronics kit components.
- Learn how a breadboard works and how to supply power safely.
- Understand the Arduino Uno board specifications.
- Recognize common safety pitfalls and how to avoid them.

## Materials Needed

- Complete electronics kit (controller board, breadboard, sensors, motors, displays).
- USB cable and power supply (7–12 V recommended)【473952369938122†L139-L154】.
- Multimeter (optional).

## 1. Unboxing and Identifying Components

Start by laying out all the parts from your kit. **Use the kit inventory sheet or the listing provided to cross‑check that you have the correct components.** As you identify items, note their names and purposes in a table (this will help reinforce learning). The kit includes a wide range of sensors (ultrasonic, PIR, flame, temperature/humidity, photoresistor, water level, accelerometer), actuators (servo, stepper motor, DC motor, relay, fan, buzzer), displays (LCD1602, 7‑segment, dot matrix), and discrete components (LEDs, resistors, capacitors, transistors, etc.)【394043538358400†L126-L176】.

> **Interactive activity:** Create a table with columns **“Component”**, **“Appearance”**, and **“Possible Function.”** As you unpack each part, fill in the table based on your own observations. At the end of the lesson, review how accurate your guesses were.

### Recommended video

To see a full unboxing, watch the *Unboxing the Official Arduino Starter Kit (2024)* video on YouTube. Watch minutes **0:00 – 3:00** to follow along with the unpacking and component identification. [Video link](https://www.youtube.com/watch?v=ZBD3x6-MgiA) (you don’t need to watch past 3:00 today).

## 2. Understanding the Breadboard

A breadboard is a reusable prototyping platform that lets you build circuits without soldering. Its holes are organized internally by metal strips that connect rows or columns together【394043538358400†L126-L152】. Key parts include:

- **Tie points:** holes where you insert wires or component leads.
- **Power rails:** long columns on the sides used to distribute power and ground【394043538358400†L126-L146】.
- **Isolated rows and columns:** grids where most components are placed【394043538358400†L126-L132】.

When powering a breadboard, connect your power supply’s positive terminal to a red power rail and the negative terminal to the blue/black rail【394043538358400†L202-L223】. Always verify connections with a multimeter (measure the voltage across the rails) before connecting any components【394043538358400†L235-L244】.

> *Tip:* If you’re a visual learner, open the recommended article’s labelled breadboard diagram. It illustrates how the power rails and tie points are internally connected and can help cement your understanding【394043538358400†L126-L146】.

> **Interactive activity:** Without connecting any components, use jumper wires to connect a 9 V battery (or regulated power supply) to the breadboard rails. Use a multimeter to confirm that the power rails receive the expected voltage. Practice swapping wires and observe the effect on the voltage reading.

### Recommended article

Read the *Wiring Up Your First Components with a Breadboard* guide (Blues University, 2024). Focus on the sections explaining breadboard layout and how to connect the power rails【394043538358400†L126-L176】.

## 3. Meeting the Arduino Uno (Controller Board)

Your kit’s main microcontroller board is an Arduino‑Uno–class board based on the ATmega328P. It features:

- **14 digital I/O pins**, 6 of which can output PWM signals【106161718326948†L71-L77】.
- **6 analog input pins**【106161718326948†L71-L77】.
- A **16 MHz** clock oscillator.
- **USB port and power jack** for programming and power【106161718326948†L71-L76】.
- **Replaceable ATmega328P chip**【106161718326948†L80-L83】.
- A recommended operating voltage range of **7–12 V** when using an external supply【473952369938122†L139-L154】.

**Digital vs analog pins:** The 14 digital pins can be configured as inputs or outputs and can read or write two logic states—HIGH (5 V) or LOW (0 V). Six of these digital pins support pulse‑width modulation (PWM) for generating analog‑like output. The six analog pins are designed for reading continuous voltage levels (0–5 V) from sensors such as potentiometers or temperature sensors, converting them to a numeric value via the board’s analog‑to‑digital converter.

> **Interactive activity:** Inspect your controller board. Locate the power jack, USB port, reset button, digital and analog pin headers. Sketch a simple pinout or annotate a photograph of your board with these labels.

### Recommended video

Watch the first **0:00 – 1:00** of *Arduino Uno tutorial: Basic microcontroller overview* (eTech Tom, 2014). The first minute introduces the board’s major components. [Video link](https://www.youtube.com/watch?v=Z8KpPb6O654). If this video is unavailable in your region, search for “Official Arduino Uno introduction” on YouTube or the Arduino website—any introductory video that walks through the board’s connectors and pin headers will work. Most videos offer captions or transcripts you can follow for accessibility.

## 4. Safety First – Avoiding Common Pitfalls

Mistakes can damage your board or components. Here are key safety rules:

- **Use the correct input voltage.** While the Uno can accept 6–20 V, it operates safest at **7–12 V**【473952369938122†L139-L154】. Avoid applying >20 V to the power jack or >5 V to the 5 V pin【402985175360835†L45-L69】.
- **Don’t draw too much current from a pin.** Each I/O pin is rated for around **20–40 mA**; drawing more can overheat the pin【402985175360835†L73-L84】.
- **Avoid short circuits.** Connecting power pins directly to ground or connecting two pins set to opposite logic levels can cause large currents that damage the board【402985175360835†L100-L117】.
- **Protect inductive loads.** Motors and relays can feed voltage spikes back into the board when switched off. Use a flyback diode or motor driver to prevent damage【402985175360835†L124-L136】.
- **Respect 3.3 V devices.** Some sensors (especially those used later with the ESP32) operate at 3.3 V. Connecting them directly to 5 V may permanently damage them.

Why do these limits matter? Exceeding the voltage range can stress the onboard voltage regulator and cause excessive heat, while drawing too much current can burn out the tiny transistors inside the microcontroller. Components like resistors and voltage regulators help keep current and voltage within safe bounds. For inductive loads, a flyback diode provides a path for the collapsing magnetic field, preventing damaging voltage spikes from feeding back into the board.

> **Interactive quiz:**  
> 1. **Voltage:** Why is it dangerous to power the Arduino Uno with 15 V on the 5 V pin?  
> 2. **Current:** What is the maximum safe current you should draw from a single Uno I/O pin?  
> 3. **Inductive loads:** How can you prevent voltage spikes from motors from damaging your board?

Write your answers in your lab notebook or digital journal. We’ll revisit these in later lessons.

## 5. Summary & What’s Next

Today you explored your kit, learned how breadboards organize connections, reviewed the Arduino Uno’s features, and understood the importance of safe voltage and current limits. In the next lesson, you’ll build your first circuit: blinking an LED using a resistor to limit current. Have your breadboard, LED, resistor, and jumper wires ready.

![ESP32 boards and Arduino proto shield](/home/oai/share/IMG_A57F87DF-7BB8-4556-991E-E76325F70E59.jpeg)

*Figure: Example microcontroller boards and a prototyping shield.* The black boards in the image are ESP32 development boards, which we will explore in later lessons. The blue board is an Arduino prototyping shield designed to plug into an Arduino Uno. Use this photo to start recognising different board form factors and to compare them with your own Uno board.