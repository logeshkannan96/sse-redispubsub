const Redis = require('ioredis');
const pub = new Redis();

const publisher = (channel, message) => {
    pub.publish(channel, JSON.stringify(message));
}

module.exports = {
    publisher
}