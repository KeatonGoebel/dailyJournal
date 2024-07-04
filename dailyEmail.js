const mysql = require('mysql');
const nodemailer = require('nodemailer');

const dbConfig = {
    host: "localhost",
    user: "kgoebel",
    password: "Goebel*0043",
    database: "journal" 
};

// Log into Dailyjournal Google Account
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dailyjournalproj@gmail.com',
    pass: 'yleq iffw lucy ghul' // Special Password for third-party apps
  }
});

// Fetching all unique email addresses
function fetchEmails(callback) {
  const connection = mysql.createConnection(dbConfig);

  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to database: ' + err.stack);
      callback(err, []);
      return;
    }

    console.log('Connected to database.');

    const query = 'SELECT DISTINCT email FROM userData';

    connection.query(query, (err, results) => {
      connection.end();

      if (err) {
        console.error('Error querying database: ' + err.stack);
        callback(err, []);
      } else {
        const emails = results.map(result => result.email);
        callback(null, emails);
      }
    });
  });
}

// Sending an Email 
function sendEmail(email) {
  const mailOptions = {
    from: 'dailyjournalproj@gmail.com',
    to: email,
    subject: 'Daily Journal',
    text: 'Thank you for using Daily Journal! \n\nIf you would you like to fill out your journal for today, just go to the link below. \n\n https://www.google.co.uk/'
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email to ' + email + ': ' + error);
    } else {
      console.log('Email sent to ' + email + ': ' + info.response);
    }
  });
}

// Main calls fetch emails and then sends an email for each email in the list
function main() {
  fetchEmails((err, emails) => {
    if (err) {
      console.error('Failed to fetch emails:', err);
      return;
    }

    if (emails.length > 0) {
      emails.forEach(email => {
        sendEmail(email);
      });
    } else {
      console.log('No emails found in the database.');
    }
  });
}

// Execute main function
main();
