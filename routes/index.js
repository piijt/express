const express = require('express');
const mongoose = require('mongoose');

const path = require('path');
const auth = require('http-auth');
const basic = auth.basic({
  file: path.join(__dirname, '../users.htpasswd'),
});

const { body, validationResult } = require('express-validator/check');

const router = express.Router();
const Registration = mongoose.model('Registration');

router.get('/registrations', (req,res) => {
  Registration.find() // returns records from the registration object
    .then((registrations) => {
      res.render('index', { title: 'All Registrations:', registrations });
    })
    .catch(() => { res.send('404'); });
});


router.get('/registrations', auth.connect(basic), (req, res) => {
  
});

router.post('/', [
    body('name')
      .isLength({ min: 1 })
      .withMessage('Please enter a name'),
    body('email')
      .isLength({ min: 1 })
      .withMessage('Please enter an email'),
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      const registration = new Registration(req.body);
      registration.save()
        .then(() => { res.send('Thank you for registering to our site!'); })
        .catch (() => { res.send('Sorry! Something went wrong under the registration, please try again'); })
    } else {
      res.render('form', {
        title: 'Registration Form',
        errors: errors.array(),
        data: req.body,
      });
    }
  }
);

router.get('/', (req, res) => { // router method (request, response) {callback function}
  res.render('form', {title: 'Registration form'});
});

router.post('/', (req, res) => {
  console.log(req.body);
  res.render('form', {title: 'Registration form'});
});

module.exports = router;
