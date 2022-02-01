import nats from 'node-nats-streaming';
import brypto from 'crypto';

const stan = nats.connect('ticketing','abc', {
    url: 'http://localhost:4222'
});

stan.on('connect', ()=>{
    console.log('Publisher Connected to Nats');
    const data = JSON.stringify({
        id: brypto.randomUUID().toString(),
        title: 'K8s Event',
        price: 65
    });

    stan.publish('ticket:created', data, ()=>{
        console.log('Event published!');
    })
});
