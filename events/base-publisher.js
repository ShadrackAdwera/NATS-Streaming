class Publisher {
    constructor(subject, client) {
        this.subject = subject;
        this.client = client;
    }
    publish(data) {
        this.client.publish(this.subject, JSON.stringify(data), (err,guid)=>{
            if (err) {
                console.log('publish failed: ' + err)
              } else {
                console.log('published message with guid: ' + guid)
              }
        })
    }
}

module.exports = Publisher;