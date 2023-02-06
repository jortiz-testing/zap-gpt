const { writeFileSync } = require('fs');
const debug = require('debug')('bot');
const bot = require('venom-bot');
const ai = require('./ai');

module.exports = {
  start: async function () {
    debug.extend('start')('started');

    try {
      const options = { useChrome: false, logQR: false };
      const client = await bot.create('zap-gpt', this.save, undefined, options);

      await client.onAnyMessage((message) => this.chat(client, message));
    } catch (error) {
      throw error;
    }
  },
  chat: async function (client, message) {
    debug.extend('chat')('started');
    const { from, to, isGroupMsg, text } = message;
    const replyTo = from === process.env.ME ? to : from;
    debug.extend('chat')('message %O', { text, replyTo });

    if (text === undefined) {
      debug.extend('chat')('ignored %s', 'it has no text');
      return;
    }

    if (isGroupMsg === true || replyTo === 'status@broadcast') {
      debug.extend('chat')('ignored %s', "it's a group or broadcast");
      return;
    }

    if (text.charAt() === ' ') {
      debug.extend('chat')('ignored %s', "it's the bot");
      return;
    }

    if (process.env.IGNORED.split(',').includes(from) && text.charAt() === '.') {
      debug.extend('chat')('ignored %s', 'it should be ignored');
      return;
    }

    const response = await ai.send(text);
    debug.extend('chat')('response %O', { response });

    await client.sendText(replyTo, ` ${response}`);
  },
  save: function (base64) {
    const matched = base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    const response = {};

    if (matched.length !== 3) {
      return new Error('Invalid input string');
    }

    response.type = matched[1];
    response.data = Buffer.from(matched[2], 'base64');

    writeFileSync('qrcode.png', response.data, 'binary');
  }
};
