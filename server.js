require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const knex = require('knex')({
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false},
      host : process.env.DATABASE_HOST,
      port : 5432,
      user : process.env.DATABASE_USER,
      password : process.env.DATABASE_PW,
      database : process.env.DATABASE_DB
    }
  });

knex.select('*').from('users').then(data => {
  console.log('Initial database connection successful.'); // Log success for testing
}).catch(err => {
    console.error('Error connecting to the database:', err);
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

//root route --------------------------------
app.get('/', (req, res) => { res.send('success') })
app.post('/signin', (req, res) => { signin.handleSignin(req, res, knex, bcrypt)})
app.post('/register', (req, res) => { register.handleRegister(req, res, knex, bcrypt)})
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, knex)})
app.put('/image', (req, res) => { image.handleImagePut(req, res, knex)})
app.post('/clarifai-endpoint', (req, res) => { image.handleApiCall(req, res)})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`app is running on port ${port}`);
})
