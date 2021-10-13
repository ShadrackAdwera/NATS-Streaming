const nats = require('node-nats-streaming');
const crypto = require('crypto');

console.clear();

const stan = nats.connect('ticketing',crypto.randomUUID().toString(), { url: 'http://localhost:4222' });

stan.on('connect', ()=>{
    const ticketData = JSON.stringify({
        id: crypto.randomUUID().toString(),
        title: 'K8s Event 1',
        price: 2500
    })
    stan.publish('ticket:created', ticketData, (err, guid)=>{
        if (err) {
            console.log('publish failed: ' + err)
          } else {
            console.log('published message with guid: ' + guid)
          }
    })
})