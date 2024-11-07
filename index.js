const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: "timro email", // Your email address
    pass: "timro gmail ma gayarw apps password vanni xa tyaha bata password pauxa liga", // Your email password or app-specific password
  },
  debug: true,
  logger: true,
});

// Array intialize
const recipients = [];

const extractNamesAndEmails = (csvFilePath) => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on("data", (data) => {
        const name = data.Name;
        const email = data.Email;
        console.log(data.email);
        console.log(data.Name);

        if (name && email) {
          recipients.push({ name, email });
        }
      })
      .on("end", () => {
        console.log("Extracted Names and Emails:", recipients);
        resolve();
      })
      .on("error", (error) => {
        console.error(`Error reading the CSV file: ${error.message}`);
        reject(error);
      });
  });
};

// Function to send emails
const sendEmails = async () => {
  for (const recipient of recipients) {
    const mailOptions = {
      from: '"Sagar Regmi" <sagar.regmi@endpointech.com>', // Sender address
      to: recipient.email, // Receiver's email
      subject: "Registration for Cybersecurity & SailPoint Bootcamps", // Subject line
      // content
      html: `<p>Dear ${recipient.name},</p>
             <p>I hope this message finds you well.</p>
             <p>As the Marketing Manager at EndpoinTech, I am excited to share our upcoming Cybersecurity and SailPoint Bootcamps designed to help professionals like you enhance their skills in these critical areas.</p>
             <p>Our bootcamps offer hands-on learning experiences and insights from industry experts. You'll also receive support with placements to help you take the next step in your career.</p>
             <p>Please find the registration link below to secure your spot:<br><a href="https://forms.office.com/r/QuZ8JVwpqW"><strong>Register Now</strong></a></p>
             <p>Don't miss out on this opportunity to advance your career!</p>
             <p>Thank you for considering our program. I look forward to welcoming you aboard!</p>
             <p>Best regards,<br>Sagar Regmi<br>Marketing Manager<br>EndpoinTech</p>`,
      attachments: [
        {
          filename: "image.png",
          path: path.join(__dirname, "./image.jpg"),
          cid: "unique@imagecid",
        },
      ],
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(
        `Email sent successfully to ${recipient.name} (${recipient.email})`
      );
    } catch (error) {
      console.error(`Error sending email to ${recipient.name}:`, error);
    }
  }
};

const main = async () => {
  // timro csv file ko name
  const csvFilePath = path.join(__dirname, "contact.csv");
  try {
    await extractNamesAndEmails(csvFilePath);
    await sendEmails(); // Send emails after extraction is done
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

// Execute the main function
main();
