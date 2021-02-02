import { channel } from './../config/rabbitmq';

const encode = (obj: any) => {
  return new Buffer(JSON.stringify(obj));
};

export const publishToQueue = async (queueName: string, data: any) => {
  console.log('channel', channel);
  channel()
    .then(channel => {
      console.log('publishing to queue', queueName, encode(data));
      channel.sendToQueue(queueName, encode(data));
    })
    .catch(e => {
      console.error('Publish to queue error', e);
    });
};
