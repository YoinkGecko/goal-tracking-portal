const { Worker } = require("bullmq");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "kartikeya.anjul@gmail.com",
    pass: process.env.EMAIL_PASS,
  },
});

const worker = new Worker(
  "email-queue",
  async (job) => {
    try {
      console.log(`Processing Job ${job.id}`);

      const { email, subject, body } = job.data;

      console.log(job.data);

      const info = await transporter.sendMail({
        from: "kartikeya.anjul@gmail.com",
        to: email,
        subject,
        text: body,
      });

      console.log("MAIL SENT");
      console.log(info);

      return "done";
    } catch (err) {
      console.log("ERROR OCCURRED");
      console.log(err);
    }
  },
  {
    connection: {
      host: "127.0.0.1",
      port: 6379,
    },
  }
);

worker.on("drained", () => {
  console.log("Queue empty");
});