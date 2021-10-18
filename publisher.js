const nats = require('node-nats-streaming');
const crypto = require('crypto');
const Publisher = require('./events/base-publisher');

console.clear();

const stan = nats.connect('ticketing',crypto.randomUUID().toString(), { url: 'http://localhost:4222' });

stan.on('connect', async()=>{
    const ticketData = {
        id: crypto.randomUUID().toString(),
        title: 'K8s Event 1',
        price: 2500
    }
    try {
      const publisher = new Publisher('ticket:created', stan);
      await publisher.publish(ticketData);
    } catch (error) {
      console.log(error);
    }
})