import nats, { Message, Stan } from 'node-nats-streaming';
import { randomBytes } from 'crypto';
console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex') , {
    url: 'http://localhost:4222'
});

stan.on('connect', ()=>{ 
    console.log('Listener connected to NATS');
    //name queue group according to the service listening to the channel

    stan.on('close', () => {
        console.log('NATS connection closed!');
        process.exit();
    });

    const options = stan
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable().setDurableName('tickets-service');

    const subscription = stan.subscribe('ticket:created', 'queue-group-name' ,options);

    subscription.on('message', (msg: Message)=>{
        const data = msg.getData();

        if(typeof data === 'string') {
            console.log(`Received Event, ${msg.getSequence()}, with data: ${data}`);
        }

        msg.ack();
    })
})

process.on('SIGINT', ()=> stan.close());
process.on('SIGTERM', ()=> stan.close());

abstract class Listener {
    abstract subject: string;
    abstract queueGroupName: string;
    abstract onMessage(data: any, msg: Message) : void;
    private client: Stan;
    protected ackWait = 5 * 1000;

    constructor(client: Stan) {
        this.client = client;
    }

    subscriptionOptions() {
        return this.client.subscriptionOptions()
        .setDeliverAllAvailable()
        .setManualAckMode(true)
        .setAckWait(this.ackWait)
        .setDurableName(this.queueGroupName)
    }

    listen() {
        const subscription = this.client.subscribe(this.subject, this.queueGroupName, this.subscriptionOptions());
        subscription.on('message', (msg:Message) => {
            console.log(`
                Message Received: ${this.subject} from Queue Group: ${this.queueGroupName}
            `)
            const parsedData = this.parseMessage(msg);
            this.onMessage(parsedData, msg);
        })
    }

    parseMessage(msg: Message) {
        const data = msg.getData();
        return typeof data === 'string' ? JSON.parse(data) : JSON.parse(data.toString('utf8'))
    } 
}

class TicketCreatedListener extends Listener {
    subject = 'ticket:created';
    queueGroupName = 'payments-service';
    onMessage(data: any, msg: Message): void {
        try {
            console.log(`Event Data: `, data);
            msg.ack();
        } catch (error) {
            console.log(error);
        }
    }
    
}