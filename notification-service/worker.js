const { Worker } = require("bullmq");

const worker = new Worker(
  "email-queue",
  async (job) => {
    console.log(`Message rec id: ${job.id}`);
    console.log(`Processing message`);
    console.log(`Sending Email to ${job.data.email}`);

    await new Promise((resolve) => setTimeout(resolve, 5000));

    console.log("Message sent");

    return "done";
  },
  {
    connection: {
      host: "127.0.0.1",
      port: 6379,
    },
  },
);

// fires when worker is waiting for jobs

worker.on("drained", () => {
  console.log("No work to do. Queue is empty.");
});
