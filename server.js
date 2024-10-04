// importing the necessary dependencies
const express = require('express');
const app = express()
const mysql = require('mysql2');
const dotenv = require('dotenv');





// configure the environment variables
dotenv.config()

// create a connection object
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
})

// test the connection of  database
db.connect((err) => {
  // connection not successful
  if (err) {
    return console.log("Error connecting to database:", err)
  }
  // connnection successful
  console.log("MySQL connection successful:", db.ThreadId)

})

// endpoint for testing purposes only
app.get('', (req, res) => {
  res.send('Hello World, It is a beatiful day today');
})


// restructure the patients data on the browser
// app.set('view engine', 'ejs');
// app.set('views', __dirname + '/views');

//Question 1: Retrieve all patients
app.get('/patients', (req, res) => {
  const getPatients = "SELECT patient_id, first_name, last_name, date_of_birth FROM patients"

  db.query(getPatients, (err, data) => {
    // if an error
    if (err) {
      return res.status(400).send("Error fetching patients", err)
    }

    // get back the data/results
    // res.status(200).render('data', { data })
    res.status(200).send(data)
  });
});


// Question 2: Retrieve all providers
app.get('/providers', (req, res) => {
  const getProviders = 'SELECT first_name, last_name, provider_specialty FROM providers';

  db.query(getProviders, (err, data) => {
    if (err) {
      return res.status(400).send('Error fetching providers');
    }
    // res.status(200).render('data', { data })
    res.status(200).send(data);
  });
});

// Question 3: Filter patients by First Name
app.get('/filter-patients', (req, res) => {
  const { first_name } = req.query;
  const filterPatients = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';
  db.query(filterPatients, [first_name], (err, data) => {
    if (err) {
      return res.status(400).send('Error filtering patients');
    }
    res.status(200).send(data);
  });
});

// Question 4: Retrieve all providers by their specialty
app.get('/providers-specialty', (req, res) => {
  const { specialty } = req.query;
  const providerSpecialty = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';

  db.query(providerSpecialty, [specialty], (err, data) => {
    if (err) {
      return res.status(400).send('Error filtering providers');
    }
    res.status(200).send(data);
  });
});

// declare the ports and listen to the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log('Server is running on PORT ${PORT}');
});