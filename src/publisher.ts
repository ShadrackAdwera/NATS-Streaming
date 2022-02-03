import nats from 'node-nats-streaming';
import brypto from 'crypto';

import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear();  

const stan = nats.connect('ticketing','abc', {
    url: 'http://localhost:4222'
});

stan.on('connect', async()=>{
    console.log('Publisher Connected to Nats');
    const data = {
        id: brypto.randomUUID().toString(),
        title: 'K8s Event',
        price: 65
    };

    try {
        const newPublish = new TicketCreatedPublisher(stan);
        await newPublish.publish(data);   
    } catch (error) {
        console.log(error);
    }
});
