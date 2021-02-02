import amqp from 'amqplib';

const rabbitURL: string = process.env.RABBITMQ_URL || '';

let connection = amqp.connect(rabbitURL, (err: Error, cxn: amqp.Connection) => {
  if (err) {
    return console.error('Could not create connection');
  }

  return cxn;
});

function channel(): Promise<amqp.Channel> {
  return amqp.connect(rabbitURL).then(cxn => {
    console.log('Connected to RMQ');
    return cxn.createChannel();
  });
}

export default connection;
export { channel };
