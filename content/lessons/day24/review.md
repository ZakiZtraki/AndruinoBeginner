# Educator Review – Day 24: ESP32 Web Server Introduction

## Overall feedback

This lesson effectively introduces learners to serving web pages from the ESP32.  It clearly explains the station, access‑point and dual Wi‑Fi modes【384423720218434†L145-L160】 and provides a well‑structured sketch that connects to Wi‑Fi, starts a `WebServer`, registers request handlers and serves HTML pages【384423720218434†L252-L276】.  The example for controlling an LED via URL commands bridges theory and practice, and the guidance on adding sensor data encourages students to integrate previous lessons.  The troubleshooting table is helpful, covering common connectivity and code issues.

## Specific comments

| Section | Comment | Status |
|---|---|---|
| Wi‑Fi modes | Good introduction.  Consider briefly mentioning that the AP mode supports up to 4 or 8 clients depending on firmware and that AP+STA mode can be used to set up a captive portal for configuration. | *Deferred for future lesson on AP mode.* |
| Connecting to Wi‑Fi | The loop waiting for `WL_CONNECTED` is straightforward.  Encourage students to add a timeout to avoid infinite loops, and to handle errors like `WL_NO_SSID_AVAIL` or `WL_CONNECT_FAILED`【384423720218434†L371-L396】. | *Not implemented to keep the example simple.* |
| HTML generation | Building the HTML string in C++ works, but the concatenation can be error‑prone.  Suggest using raw string literals (`R"(...html...)"`) or storing HTML in a `const char*` for readability. | *Acknowledged; left as is for beginner familiarity.* |
| Redirection after LED toggle | Using an HTTP 303 redirect is a clean way to return to the main page.  Explain why we use `server.sendHeader("Location", "/")` and `server.send(303)` instead of re‑serving the page directly. | *Added a brief explanation in the comments.* |
| Sensor sampling rate | Good reminder that DHT22 has a low sampling rate【860589226677594†L98-L116】.  Encourage use of non‑blocking delays or timers so the web server remains responsive. | *Added note about avoiding blocking delays in handlers.* |
| Security considerations | Nice mention of strong passwords and HTTPS.  Suggest adding a note about not serving sensitive data and being cautious when exposing the ESP32 to the public internet.  Recommend using a captive portal for credential configuration and adding a login page. | *Added general security guidance; details deferred to advanced lessons.* |
| Troubleshooting | Comprehensive.  You might include an item explaining how to fix IP address changes by using static IP or DHCP reservation. | *Addressed in the table with a note about static IP assignment.* |
| Going further | The suggestions are well‑chosen.  Consider linking to the AsyncWebServer library and mDNS examples for readers ready to advance. | *Deferred to future lessons.* |

## Summary of modifications

- Added a comment explaining the 303 redirect mechanism in the LED handlers.
- Added a note in the troubleshooting table about assigning a static IP or using mDNS when the IP changes.
- Added a line reminding students to avoid blocking delays when reading sensors in HTTP handlers and to respect sensor sample rates.
- Expanded the security considerations section to warn against exposing the ESP32 and serving sensitive data without authentication.

Overall, the lesson provides a solid foundation for building web‑enabled projects with the ESP32.  Future iterations can introduce asynchronous web servers, WebSockets and user authentication to create more sophisticated and secure interfaces.