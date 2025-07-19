const twilio = require("twilio");
require("dotenv").config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

exports.listAvailablePhoneNumber = async (req, res) => {
    try {
        const country = req.query.country;

        if (!country) {
            return res.status(400).json({
                message: "Country code is required",
            });
        }

        const locals = await client.availablePhoneNumbers(country).local.list({
            limit: 10,
        });

        const phoneNumbers = locals.map((l) => l.phoneNumber);

        res.status(200).json({
            message: "Available phone numbers fetched successfully",
            data: phoneNumbers,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Error fetching phone numbers",
            error: err.message,
        });
    }
};

exports.sendMessage = async (req, res) => {
    try {
        console.log(req)
        const { numbers, message } = req.body;

        if (!numbers || !message) {
            return res.status(400).json({ error: "Numbers and message are required" });
        }

        if (!Array.isArray(numbers)) {
            return res.status(400).json({ error: "Numbers should be an array" });
        }

        const results = [];

        for (let number of numbers) {
            const msg = await client.messages.create({
                body: message,
                from: "+16814914749",
                to: number,
            });
            results.push(msg);
        }

        res.json({
            message: "Messages sent successfully",
            data: results,
        });
        console.log(results)

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred while sending messages" });
    }
};


exports.sendWhatsApp = async (req, res) => {
    try {
        console.log("the whatsapp message request is ", req)
        const { numbers, message } = req.body;
        if (!numbers || !message) {
            return res.status(400).json({ error: "Numbers and message is required" });
        }
        if (!Array.isArray(numbers)) {
            return res.status(400).json({ error: "Numbers must be an array" });
        }
        for (let number of numbers) {
            client.messages.create({
                body: message,
                from: 'whatsapp:+9779840171864',
                to: `whatsapp:${number}`
            })
                .then(message => console.log(message.sid));


        }

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "An error occured while sending message" });

    }
}

exports.sendEmail = async (req, res) => {
  try {
    const { emails, message } = req.body;

    if (!emails || !message) {
      return res.status(400).json({ error: "Emails and message are required" });
    }

    if (!Array.isArray(emails)) {
      return res.status(400).json({ error: "Emails must be an array" });
    }
    const msg = {
      from: 'kamalbasyal987@gmail.com',
      subject: 'Bulk Email from SendGrid',
      text: message,
      html: `<strong>${message}</strong>`,
      personalizations: emails.map(email => ({
        to: [{ email }],
      })),
    };

    await sgMail.send(msg);
    return res.status(200).json({ success: true, message: "Emails sent successfully" });

  } catch (error) {
    console.error("Error sending emails:", error.response?.body || error);
    return res.status(500).json({ error: "Failed to send emails" });
  }
};
