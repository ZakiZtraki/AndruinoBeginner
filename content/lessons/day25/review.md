# Day 25 – Educator Review

Below is constructive feedback on the Day 25 lesson written from the perspective of a modern electronics educator.  Each comment points out an area for improvement along with a status describing how it was addressed.

| Line/Section | Comment | Status |
|---|---|---|
| **MQTT Basics** | The introduction defines MQTT and explains topics and brokers well. To reinforce the concept, it may help to include a small diagram of the publish/subscribe relationship between client, broker and subscriber. | *Not addressed*: The text description is clear; diagrams will be added in future iterations. |
| **PubSubClient installation** | The installation steps are thorough. A link to the Library Manager could be added for users unfamiliar with manually installing libraries. | *Not addressed*: Will add Library Manager screenshot in future updates. |
| **Unique client ID** | The lesson correctly generates a client ID using the MAC address. Emphasize that duplicate IDs will cause clients to disconnect. | *Addressed*: A note on generating unique IDs and avoiding collisions was added in the troubleshooting section. |
| **Publishing interval** | Publishing sensor data every five seconds is reasonable. However, caution that frequent publishing can flood the broker and that some public brokers enforce rate limits. | *Addressed*: Added a best‑practice note in the troubleshooting section to adjust the publishing interval as needed. |
| **Callback function** | The callback handles on/off commands. Encourage students to validate the message payload (e.g. trim whitespace) and handle unexpected commands gracefully. | *Partially addressed*: Added string trimming and equality checks. A more robust parser can be explored later. |
| **Security** | The lesson mentions TLS and port 8883. Suggest adding an example showing how to connect using `WiFiClientSecure` and providing a CA certificate. | *Deferred*: A TLS example would lengthen the lesson; noted under “Going further” to explore secure connections with certificates. |
| **Broker credentials** | The code uses anonymous connections. Remind students that many brokers allow anonymous access but it’s best practice to authenticate with a username and password. | *Addressed*: Added information about username/password in the troubleshooting notes and in the `reconnect()` example from the EMQX article. |
| **Node‑RED/Testing** | Mentioned Node‑RED and MQTT dashboard apps in the project section, but providing a specific test method (e.g. using MQTTX to publish and subscribe) would help learners verify their setup. | *Partially addressed*: Added a suggestion to use Node‑RED or an MQTT dashboard; a step‑by‑step test guide is deferred to a future lesson. |
| **Quality of Service and retain flags** | The lesson briefly mentions QoS 0 and 1. Consider explaining QoS levels and the `retain` flag, since beginners often run into confusion about why messages persist or do not persist. | *Deferred*: A separate lesson on QoS and retain messages will be developed later; flagged for future expansion. |

## Summary of improvements

The final lesson clarifies the importance of unique client IDs, warns about publishing too frequently, and introduces the idea of authentication and secure connections.  Future versions should include diagrams, a Library Manager installation walkthrough and a deeper dive into advanced MQTT features like TLS, QoS and retained messages.