const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Port configuration
const PORT = process.env.PORT || 3000;

// Body parser middleware
app.use(bodyParser.json()); // Use only JSON parsing for cleaner data handling

// Serve static files from the public directory
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.status(200).send('Server is running!');
});

// Contact form route
app.post('/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body; // Extracting from request body

        // Validate required fields
        if (!name || !email || !message) {
            return res.status(400).send('Missing required fields in form data.');
        }

        // Looking to send emails in production? Check out our Email API/SMTP product!
        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
            user: "ec2b6a7d138f4e",
            pass: "b1af75c497f6db"
            }
        });

        // Setup email data
        const mailOptions = {
            from: 'samaranis304@gmail.com',
            to: email,
            subject: 'New Contact Form Submission',
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`, // Fixed template literals
        };

        // Send mail with defined transport object
        const info = await transport.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        console.log('Message sent: %s', info.messageId);
        res.status(200).send({ status: true, message: 'Message sent successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error sending message. Please try again later.');
    }
});

app.listen(PORT, '127.0.0.1', () => console.log(`Server running on port ${PORT}`)); // Fixed backticks
