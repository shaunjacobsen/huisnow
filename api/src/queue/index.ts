import { channel } from './../config/rabbitmq';

const encode = (obj: any) => {
  return new Buffer(JSON.stringify(obj));
};

export const publishToQueue = async (queueName: string, data: any) => {
  console.log('channel', channel);
  channel()
    .then(channel => {
      channel.sendToQueue(queueName, encode(data));
    })
    .catch(e => {
      console.error('Publish to queue error', e);
    });
};
