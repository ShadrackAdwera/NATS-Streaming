const nats = require('node-nats-streaming');

const stan = nats.connect('ticketing','xyz', {
    url: 'http://localhost:4222'
});

stan.on('connect', ()=>{
    const listenOpts = stan.subscriptionOptions().setStartWithLastReceived();
    const subscribe = stan.subscribe('ticket:created', listenOpts);
    subscribe.on('message', (msg)=>{
        console.log(`Message received: [ ${msg.getSequence()} ]`);
        console.log(`Message received: [ ${msg.getData()} ]`);
    })
})