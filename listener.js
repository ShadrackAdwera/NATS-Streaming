const crypto = require("crypto");
const nats = require("node-nats-streaming");
const Listener = require('./events/base-listener');

console.clear();

const stan = nats.connect("ticketing", crypto.randomUUID().toString(), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {

const ticketCreatedListener = new Listener('ticket:created','payments-service', stan, 5000);
ticketCreatedListener.listen();
  stan.on("close", () => {
    console.log("NATS connection closed");
    process.exit();
  });
});

//interrupt signal
process.on("SIGINT", () => stan.close());
//terminate signal
process.on("SIGTERM", () => stan.close());

