# Day 11 – Soldering Basics & Proto‑Shield Assembly

## Learning objectives

By the end of this lesson you should be able to:

- Prepare a safe, well‑equipped soldering workspace.
- Explain why ventilation, protective equipment and ESD precautions are important when soldering.
- Identify the tools and materials needed for through‑hole soldering.
- Make clean, reliable solder joints by heating the joint correctly, applying solder and letting it flow and cool.
- Recognise signs of good versus bad solder joints and correct common mistakes.
- Solder male header pins onto the Arduino prototype shield from your kit.

## Materials and tools

| Tool / material | Purpose |
|-----------------|---------|
| **Soldering station** (preferably 60 W or greater with adjustable temperature) and iron stand | Provides a stable heat source. Variable‑temperature irons are recommended, especially for lead‑free solder【588136541121542†L70-L72】. |
| **Rosin‑core solder**: 60/40 leaded or lead‑free SAC305 wire | The solder alloy. Rosin flux in the core helps remove oxides and allows the molten solder to “wet” the copper surfaces more easily. |
| **Tip cleaner**: brass cleaning ball or damp sponge | Removes oxidation from the iron tip; brass cleaners don’t cool the tip and clean more effectively【588136541121542†L97-L110】. |
| **Flux pen** (optional but recommended) | Flux removes oxides and improves solder flow when joints are difficult. |
| **Third hand or vise** | Holds boards steady and frees up your hands. |
| **Diagonal flush cutters** | Trims component leads. |
| **Proto‑Shield board and male header strips** | The practice project for this lesson. |
| **Multimeter** (for continuity checks) | Verifies that joints conduct and are not shorted. |
| **Safety equipment**: fume extractor or open window, safety glasses, optional gloves | Protects you from fumes and splatter【733458386403284†L70-L88】. Use gloves when handling leaded solder and wash hands afterwards【733458386403284†L118-L123】. |

## 1 – Prepare your workspace

Soldering irons operate at temperatures around 449 °C, so burns and fire are real hazards【733458386403284†L70-L78】.  Keep flammable materials, solvents and paper away from your bench, and do not solder in bedrooms or near sleeping areas.  The soldering process also produces fumes from burning flux; even though the lead in leaded solder does *not* vaporise at soldering temperatures【733458386403284†L105-L112】, the smoke should be avoided.  Work in a well‑ventilated area or set up a fan or fume extractor to pull smoke away from you【733458386403284†L84-L88】.  Place a heat‑resistant, ESD‑safe mat on your bench and organise components in small containers【733458386403284†L97-L100】.  Switch off and unplug any powered devices you’re working on and discharge large capacitors before soldering to avoid electrical shock【733458386403284†L132-L138】.  Finally, wear protective gloves when handling leaded solder and wash your hands afterwards【733458386403284†L118-L123】; safety glasses will protect you from molten solder splatter and clipped leads【733458386403284†L126-L130】.

## 2 – Clean and immobilise the joint

Before soldering, ensure that the copper pads on your board are clean.  Dirt, oxidation or oily fingerprints can prevent solder from wetting properly; wipe the board with a little isopropyl alcohol if it looks dirty【699443685737800†L236-L239】.  Position the component in the board and immobilise it – bend the leads out slightly or use a third‑hand tool or vise so the part cannot move while the solder solidifies【699443685737800†L243-L249】.  A vise also keeps the board steady while you solder【699443685737800†L254-L257】.

## 3 – Tin and clean your iron

Set your iron to a moderate temperature (around **325–375 °C**)【292150752030442†L895-L908】.  A higher temperature is needed for lead‑free solder, so a variable‑temperature iron of 60 W or more is recommended【588136541121542†L70-L72】.  Before each joint, clean the tip by wiping it on a damp sponge or brass cleaning ball; the brass cleaner doesn’t cool the tip and removes oxidation more effectively【588136541121542†L97-L110】.  Immediately after cleaning, melt a small amount of solder onto the tip to “tin” it.  The fresh solder improves thermal conduction into the joint【292150752030442†L895-L903】.  At the end of your soldering session, re‑tin the tip before switching off the iron to protect it from corrosion.

## 4 – Make a good solder joint

Follow these steps for each through‑hole joint:

1. **Heat the joint** – Touch the iron to the pad and the component lead simultaneously.  A tiny drop of solder on the tip helps transfer heat quickly【931228021549841†L212-L214】.  You want both surfaces to reach the melting temperature at the same time.
2. **Apply the solder** – Touch the end of the solder wire to the heated joint so it contacts both the pad and the lead; it should melt and flow smoothly【931228021549841†L220-L223】.  If the solder doesn’t flow, heat for another second or two.  Avoid melting solder directly on the iron tip, as that can create weak joints.
3. **Let it flow** – Keep heating for a moment so the molten solder fills the hole and wets the pad and lead【931228021549841†L229-L230】.  Avoid excessive solder; the joint should look like a small shiny cone rather than a ball【292150752030442†L905-L908】.
4. **Remove solder, then iron** – When enough solder has flowed, pull the solder wire away first, then remove the iron and allow the joint to cool undisturbed【931228021549841†L234-L236】.  Movement while cooling can create a “cold joint” that looks dull and cracked.
5. **Trim the lead** – Once the joint has cooled, use diagonal cutters to trim any protruding leads flush with the board【931228021549841†L240-L243】.

### Recap

SparkFun’s soldering guidelines summarise best practices【292150752030442†L895-L908】:

* Be cautious when handling a hot iron and always return it to its stand.
* Use a third hand or vise to hold your board steady.
* Set the iron to a moderate temperature (325–375 °C) and reduce the heat if you see smoke from the flux.
* Tin your tip before **every** joint to improve heat transfer, and re‑tin the tip before turning off the iron to prolong its life.
* Use the side of the tip (the “sweet spot”), not just the very tip.
* Heat both the pad and the lead evenly and at the same time.
* Pull the solder away first, then the iron.
* A good solder joint is shiny and shaped like a volcano or Hershey’s Kiss.

## 5 – Practical exercise: soldering header pins

You will now solder the male header strips onto your Arduino proto‑shield:

1. **Insert headers and align** – Fit the header strips into the shield’s rows of holes.  To keep them straight, plug the shield onto an Arduino board or a breadboard as a jig【292150752030442†L959-L963】.
2. **Tack one pin per row** – Carefully solder one pin at one end of each header strip using the technique above.  This temporarily holds the header in place.
3. **Check alignment** – Make sure the header is perpendicular to the board.  If it’s crooked, reheat the tack joint and adjust.
4. **Solder remaining pins** – Proceed to solder the remaining pins, working methodically and keeping your iron on each joint just long enough for the solder to flow.  Clean and tin the tip regularly.  If you are soldering a long row of pins, let the board cool for a minute halfway through to avoid overheating the copper pads.
5. **Inspect and trim** – Inspect all joints.  They should be shiny and conical.  Rework any dull or blobbed joints by reheating and applying a little fresh solder.  Trim any long leads.
6. **Test continuity** – Use a multimeter in continuity mode to check that each pin connects to the corresponding pad and that no adjacent pins are shorted.  Alternatively, plug the shield into your Arduino and verify that the pins fit snugly.

### Common mistakes and how to fix them

| Mistake | Symptom | Fix |
|-------|---------|----|
| **Cold joint** | Dull, grainy surface; poor or intermittent electrical connection | Reheat the joint with a clean, tinned tip and fresh flux until the solder reflows. |
| **Solder bridge** | Blob of solder connecting adjacent pins | Remove excess solder with solder wick or a solder pump, then re‑solder each joint separately. |
| **Insufficient solder** | Pin barely covered; hole visible | Reheat and add a small amount of solder until the joint fills the hole and wets the pad. |
| **Damaged pad** | Pad lifts from the board due to excessive heat | Avoid prolonged heating; if a pad lifts, carefully scrape the solder mask off the nearby trace and bridge a small wire to the next connection point. |

## 6 – Additional resources

* **Video tutorial** – The *Collin’s Lab: Soldering* video from Adafruit (YouTube) demonstrates through‑hole soldering.  Watch from 3:00 to 5:00 minutes for a clear view of heating the joint and applying solder.
* **SparkFun soldering tutorial** – The SparkFun article you’ve just read includes a helpful animation and troubleshooting section, and covers more tips such as using cardboard or tape to hold components and dealing with ground planes【292150752030442†L940-L992】.
* **Desoldering techniques** – Mistakes happen.  Learn how to remove solder with a solder wick or pump.  SparkFun’s tutorial and many YouTube videos cover desoldering methods.
* **iFixit guide** – The iFixit “Soldering Simplified” article covers workstation setup and recommends using a variable‑temperature iron【588136541121542†L70-L72】 and brass tip cleaner【588136541121542†L97-L110】.

## Summary

Soldering unlocks a world of permanent, reliable electronics.  Working safely is essential: high temperatures can cause burns, smoke from burning flux should be avoided, and lead exposure is mainly via touch【733458386403284†L70-L88】【733458386403284†L105-L112】.  Prepare your workspace with ventilation, protective equipment and ESD‑safe surfaces, and always unplug circuits before soldering【733458386403284†L132-L138】.  Clean your board and immobilise the parts【699443685737800†L243-L249】, set your iron to an appropriate temperature【292150752030442†L895-L908】, keep the tip clean and tinned【292150752030442†L895-L903】【588136541121542†L97-L110】, and heat both the pad and the lead before applying solder【931228021549841†L212-L214】.  A good solder joint should be shiny and cone‑shaped, not a dull blob【292150752030442†L905-L908】.  Practise these skills by soldering the header pins onto your proto‑shield and verifying your work with a multimeter.  Desoldering tools like wick and pumps can rescue mistakes.  Above all, practise on scrap boards before tackling critical assemblies – your technique will improve quickly with hands‑on experience.