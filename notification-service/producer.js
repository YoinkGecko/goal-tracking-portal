const { Queue } = require("bullmq");

const notificationQueue = new Queue("email-queue", {
  connection: {
    host: "127.0.0.1",
    port: 6379,
  },
});

async function init() {
  const res = await notificationQueue.add("email to kartikeya", {
    email: "kartikeya.anjul@gmail.com",
    subject: "Welcome to Notification queue sample",
    body: "hey kartikeya welcome as a new user",
  });

  console.log("Job added to queue", res.id);
}

init();