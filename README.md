# Daily Journal
Daily Journal is a website developed using HTML, CSS, and Javascript and connected to a database developed using SQL. Daily Journal allows users to input their feelings about their day and once they do that they will then be added to a daily reminder and weekly summary list. I developed this project in July 2024 as the first project I did after graduating from school. I wanted to learn more web development as I never used Javascript in school. I also wanted to get more practice with SQL as I had not yet set up a database on my local workstation. Although this project was simple, I thought it was a good way to learn some new things. Users have the option to enter information about their day like their favorite part about their day or how they are currently feeling. When they submit their response with their email, their information is uploaded to the database. If users upload an additional response, it will change their first response. Only allowing one response per day makes the weekly summaries more accurate and allows users to update their responses if they want to. Users also have the option to enter their email and delete their data from the database. This prevents them from getting any other daily reminders or weekly summaries. 
## How does Daily Journal Work? 
The daily reminders and weekly summaries are programmed using Javascript and called automatically using Cron jobs set up on my local workstation.
For the daily reminders, a query is sent to the database which retrieves all the unique emails on the database. For each email in the list, an email is sent with a link to the website. For the weekly summaries, a query is sent which retrieves all the unique emails on the database that made an entry in the last week. For each email in the list, it calculates certain things like the highest rated day, the lowest rated day, and the average score. It then produces an email and sends it to the email address.
 
