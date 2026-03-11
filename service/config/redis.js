const Redis = require('redis');

const redisClient = Redis.createClient('6380', '172.17.160.138');

redisClient.ping(function(err, reply) {
  if (err) {
    console.error('验证连接失败:', err);
    return;
  }

  console.log('连接验证成功:', reply);
});


redisClient.subscribe('employeeInfo', (err, reply) => {
  console.log(reply);
});
redisClient.on('message', (employeeInfo, message) => {
  console.log("channel",employeeInfo, "data",message);
   gateData = message.data;
});

console.log(gateData,"----------");

export default gateData
