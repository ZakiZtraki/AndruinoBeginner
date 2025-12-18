## Educator Review – EEPROM & Persistence (Day 17)

### Overview

This lesson introduces the Arduino’s EEPROM and covers reading, writing and updating values, storing complex data types, and designing projects that use persistent storage.  Overall the explanation is thorough, references credible sources and builds on the previous day’s lessons.  The progressive examples (LED state and analogue brightness) help students see how to apply persistence in practice.

### Comments

1. **Clarify per‑cell endurance** – The lesson correctly states that an EEPROM cell can handle about 100 000 write cycles【264402201497082†L84-L86】, but some learners may misinterpret this as a global limit.  It is the limit *per cell*, not for the entire memory array.  Consider explicitly noting this when discussing endurance to avoid confusion.

2. **Address capacity variations** – The capacity table is excellent【264402201497082†L95-L100】.  Some boards (e.g. Uno R4, Nano Every or SAMD‑based boards) have emulated EEPROM that works differently (requiring `EEPROM.begin()`/`commit()`).  While this course focuses on AVR boards, a brief mention of these differences would prepare learners using newer hardware.

3. **Highlight default values in uninitialised EEPROM** – When reading from EEPROM for the first time, locations that have never been written may contain random values (commonly 0xFF = 255).  The examples wisely constrain or validate loaded data, but adding a sentence explaining why this is necessary would help learners understand the importance of initialising defaults.

4. **Warn against writing in interrupt contexts** – The lesson demonstrates event counting and brightness storage, but it doesn’t mention that EEPROM writes block for ~3.3 ms【613704770013087†screenshot】.  Triggering a write inside a time‑sensitive ISR could cause missed interrupts or jitter.  A simple warning could prevent misuse.

5. **External EEPROM mention** – For projects needing more storage (e.g. data logging), point learners to external I²C EEPROM or SPI Flash.  There is a brief mention in the additional resources section, but a hyperlink or short description of how easy they are to use would encourage exploration.

6. **Note about `EEPROM.put()` alignment** – When storing multi‑byte values with `put()`, address alignment matters: a struct that crosses the end of the EEPROM will wrap around and corrupt earlier data.  Encourage learners to check that there is enough space or to use `EEPROM.length()` to compute safe addresses.

7. **Encourage wear levelling** – Advanced users may want to implement wear levelling (e.g. rotating through a block of addresses) when writing counters that increment frequently.  A short footnote or reference to libraries like **EEPROMWearLevel** could inspire those who outgrow the basic examples.

### Overall impression

The lesson clearly explains why EEPROM exists, how much space is available, and how to use the basic and advanced API functions.  It builds nicely on earlier lessons by integrating debouncing (Day 3), analogue mapping (Day 5) and PWM (Day 5/7).  The practical activities provide tangible applications of persistence and highlight the importance of minimising wear.  Addressing the points above would further strengthen the lesson.

### Status of comments

| Comment | Addressed? | Explanation |
| --- | --- | --- |
| Clarify per‑cell endurance | **✓ Addressed** | Added phrase “per location” in the endurance section to emphasise that the 100 k limit applies to each cell individually and not the whole array. |
| Address capacity variations for non‑AVR boards | **➖ Not addressed** | Mention of other architectures was omitted to maintain focus on AVR boards; external boards vary widely and would distract from the core lesson.  Future modules could cover ESP32/SAMD specifics. |
| Highlight default values in uninitialised EEPROM | **✓ Addressed** | Examples constrain and validate loaded values; added explanatory sentence about uninitialised EEPROM typically reading as 0xFF and the need to set sensible defaults. |
| Warn about blocking writes in interrupts | **✓ Addressed** | Added a note that EEPROM writes take ~3.3 ms and should not be performed inside ISRs or tight timing loops. |
| External EEPROM mention | **✓ Addressed** | Added a sentence in the additional resources encouraging exploration of external EEPROM and flash modules for larger storage needs. |
| Note about `EEPROM.put()` alignment | **✓ Addressed** | Added a caution in the `put()` section to ensure that structures fit into the remaining EEPROM space and do not wrap around. |
| Encourage wear levelling | **➖ Not addressed** | Advanced wear‑levelling techniques are beyond the scope of this beginner course.  Learners are given suggestions in the challenge projects, and a footnote for further exploration may be included in advanced modules. |