# slot-booking
A simple slot-booking application using NodeJS, Express and MongoDB.
Link:
https://simple-slot-booking.herokuapp.com/

Facility Booking:
An Apartment Complex has a lot of facilities for its residents to use. Some of them include Tennis Court, Swimming Pool, Badminton Court, Gym, Club House and Cycle tracks. These facilities are free and available to all the residents.
Apartment Society requires a web portal where the residents can book to access those facilities.
Booking process is simple. 
A resident will login to the web portal and select the facility. 
A Resident can choose the date and time range. For example 1st Jan 2019, 10 AM to 11 AM.
If the slot is available, resident booking gets confirmed. 
If the slot is not available, i.e., if it’s already booked by another resident, it will return an error. Residents can choose to book a different slot.
Residents can see the following once they login into the portal.,
List of available facilities
Book a facility

Expected Outcome:

A login page for residents to access the portal.
A dashboard for residents (features listed in the previous section).


Technical:

Node and Express JS used for the APIs.
MongoDB with Mongoose ORM.
Deployed this application in heroku. 
