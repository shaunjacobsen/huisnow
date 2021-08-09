require('dotenv').config();

import { channel } from './config/queue';
import { sendEmail } from './email';

const QUEUE_NAME = 'new_properties';

const decode = (messageContent: any) => {
  return JSON.parse(messageContent);
};

channel()
  .then((canal) => {
    canal.consume(QUEUE_NAME, (msg) => {
      // when message received, do this
      const listing = decode(msg.content);
      console.log('message received!', listing);
      // send the email and acknowledge
      sendEmail([listing])
        .then(() => {
          canal.ack(msg);
        })
        .catch((e) => console.error('error, cannot send', e));
    });
  })
  .catch((e) => console.log('channel error', e));
