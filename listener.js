const crypto = require("crypto");
const nats = require("node-nats-streaming");

console.clear();

const stan = nats.connect("ticketing", crypto.randomUUID().toString(), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  const listenOpts = stan
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable()
    .setDurableName("accounts-service");
  const subscribe = stan.subscribe(
    "ticket:created",
    "orders-service-queue-group",
    listenOpts
  );

  stan.on("close", () => {
    console.log("NATS connection closed");
    process.exit();
  });

  subscribe.on("message", (msg) => {
    console.log(`Message received: [ ${msg.getSequence()} ]`);
    console.log(msg.getData());
    msg.ack();
  });
});

//interrupt signal
process.on("SIGINT", () => stan.close());
//terminate signal
process.on("SIGTERM", () => stan.close());

class Listener {
  constructor(subject, queueGroupName, client, ackWait) {
    this.subject = subject;
    this.queueGroupName = queueGroupName;
    (this.client = client), (this.ackWait = ackWait); //5*1000
  }
  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);
  }
  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on("message", (msg) => {
      console.log(`Message received: [ ${msg.getSequence()} ]`);
      console.log(msg.getData());
      msg.ack();
    });
  }
}
