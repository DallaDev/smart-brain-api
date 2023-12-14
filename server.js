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
      ssl: true,
      host : 'dpg-clss7t38d1es73bco2qg-a',
      port : 5432,
      user : 'face_detect_db_2lpx_user',
      password : '',
      database : 'face_detect_db_2lpx'
    }
  });

knex.select('*').from('users').then(data => {
    return data;
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
