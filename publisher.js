import nats from 'node-nats-streaming';

const stan = nats.connect('ticketing','abc', { url: 'http://localhost:4222' });

stan.on('connect', ()=>{
    stan.publish('foo', 'Hello from the other side', (err, guid)=>{
        if (err) {
            console.log('publish failed: ' + err)
          } else {
            console.log('published message with guid: ' + guid)
          }
    })
})