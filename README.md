# TrackCom – ISS Secure Component Tracking

Trackcom_v is a modern application React + Vite frontend with a Node/Express backend integrating Hedera HTS/HCS 
on logging and verifying component lifecycle events for the International Space Station, utilizing
 Hedera’s core services.

## Development

```sh
# Clone the project
git clone https://github.com/Gueyeelpapinho/Trackcom_v.git
#install
npm install --legacy-peer-deps
npm run dev         # frontend
npm run dev:server  # backend
npm run dev:all     # both
```
## Different features of the app
 1. Registration : A new component (e.g., a sensor) is tokenized (an NFT is
 created) on Hedera on the ground.
 
 2.  ISS Operation (Simulation) : The astronaut (user) registers the component.
 The application sends an HCS message: "Sensor replacement completed by Astronaut B- 2025/10/05 15:30:00 GMT".

 3. Verification (Ground) : The ground control team views the dashboard and
 instantly sees the update, which is verifiable by consensus. The history cannot be
 altered, ensuring data trust.


 ## Strategic Impact and Future Prospects

 The TRACKCOMproject goes beyond inventory management; it establishes a foundation of
 digital trust for future space operations.
 Key Benefits for NASA
 • Increased Safety : Reduction of operational risk thanks to an undisputed maintenance
 history.
 • Predictive Maintenance : Reliable data allows for optimizing the remaining lifespan of
 parts and planning replacements with high accuracy.
 • Interplanetary Logistics : The developed model is directly applicable to future orbital
 structures (Gateway) or lunar bases, which require logistical autonomy.
