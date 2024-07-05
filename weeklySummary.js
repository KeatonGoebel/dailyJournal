const mysql = require('mysql');
const nodemailer = require('nodemailer');

const con = mysql.createConnection({
    host: "host",
    user: "username",
    password: "password",
    database: "database_name" 
});

// Log into Dailyjournal Google Account
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'dailyjournalproj@gmail.com',
      pass: 'yleq iffw lucy ghul' // Special Password for third-party apps
    }
});

con.connect(function(err) {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log("Connected to MySQL!");

    // Fetch unique email addresses
    con.query("SELECT DISTINCT email FROM userData WHERE currentDay BETWEEN DATE_SUB(NOW(), INTERVAL 7 DAY) AND NOW()", function(err, emailsResult) {
        if (err) {
            console.error('Error fetching unique email addresses:', err);
            con.end();
            return;
        }

        let emailCount = emailsResult.length;
        if (emailCount === 0) {
            console.log("No emails to process.");
            con.end();
            return;
        }

        // Grab data from each email address over the last week
        emailsResult.forEach(emailRow => {
            const email = emailRow.email;

            con.query(`SELECT currentDay, mood, rating FROM userData WHERE email = ? AND currentDay BETWEEN DATE_SUB(NOW(), INTERVAL 7 DAY) AND NOW()`, [email], function(err, dataResult) {
                if (err) {
                    console.error(`Error fetching data for email ${email}:`, err);
                    emailCount--;
                    if (emailCount === 0) {
                        con.end();
                    }
                    return;
                }

                // Calculate summaries
                if (dataResult.length > 0) {
                    let happiestDay = null;
                    let happiestDayRating = -Infinity;
                    let unhappiestDay = null;
                    let unhappiestDayRating = Infinity;
                    let totalRating = 0;

                    dataResult.forEach(entry => {
                        const rating = entry.rating;
                        totalRating += rating;

                        if (rating > happiestDayRating) {
                            happiestDayRating = rating;
                            happiestDay = entry.currentDay;
                        }

                        if (rating < unhappiestDayRating) {
                            unhappiestDayRating = rating;
                            unhappiestDay = entry.currentDay;
                        }
                    });

                    const averageRating = totalRating / dataResult.length;

                    const happiestDayFormatted = new Date(happiestDay).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
                    const unhappiestDayFormatted = new Date(unhappiestDay).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });

                    // Output summaries and sending emails
                    console.log(`Summary for email ${email}:`);
                    console.log(`Happiest Day: ${happiestDayFormatted} (Rating: ${happiestDayRating})`);
                    console.log(`Unhappiest Day: ${unhappiestDayFormatted} (Rating: ${unhappiestDayRating})`);
                    console.log(`Average Rating: ${averageRating.toFixed(2)}`);
                    console.log("\n");

                    const mailOptions = {
                        from: 'dailyjournalproj@gmail.com',
                        to: email,
                        subject: 'Weekly Summary',
                        text: `Thank you for using Daily Journal ${email}, here is a weekly summary of your input.\n\nYour happiest day was ${happiestDayFormatted} where you rated your day ${happiestDayRating}.\n\nYour most unhappy day was ${unhappiestDayFormatted} where you rated your day ${unhappiestDayRating}.\n\nYour average rating for the week was ${averageRating.toFixed(2)}.\n\nThank you for using Daily Journal!`
                    };
                    
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.error('Error sending email to ' + email + ': ' + error);
                        } else {
                            console.log('Email sent to ' + email + ': ' + info.response);
                        }
                        emailCount--;
                        if (emailCount === 0) {
                            con.end();
                        }
                    });
                } else {
                    console.log(`No data found for email ${email}`);
                    emailCount--;
                    if (emailCount === 0) {
                        con.end();
                    }
                }
            });
        });
    });
});
