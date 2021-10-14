const crypto = require('crypto');
const nats = require('node-nats-streaming');

console.clear();

const stan = nats.connect('ticketing', crypto.randomUUID().toString() , {
    url: 'http://localhost:4222' 
});

stan.on('connect', ()=>{
    const listenOpts = stan
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable().setDurableName('accounts-service');
    const subscribe = stan.subscribe('ticket:created','orders-service-queue-group', listenOpts);

    stan.on('close', () => {
        console.log('NATS connection closed');
        process.exit();
    })

    subscribe.on('message', (msg)=>{
        console.log(`Message received: [ ${msg.getSequence()} ]`);
        console.log(msg.getData());
        msg.ack();
    })
})

//interrupt signal
process.on('SIGINT', ()=> stan.close());
//terminate signal
process.on('SIGTERM', ()=> stan.close());