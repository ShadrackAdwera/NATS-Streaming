const crypto = require('crypto');
const nats = require('node-nats-streaming');

console.clear();

const stan = nats.connect('ticketing', crypto.randomUUID().toString() , {
    url: 'http://localhost:4222'
});

stan.on('connect', ()=>{
    const listenOpts = stan.subscriptionOptions().setStartWithLastReceived().setManualAckMode(true);
    const subscribe = stan.subscribe('ticket:created','orders-service-queue-group', listenOpts);
    subscribe.on('message', (msg)=>{
        console.log(`Message received: [ ${msg.getSequence()} ]`);
        console.log(`Message received: [ ${msg.getData()} ]`);
        msg.ack();
    })
})