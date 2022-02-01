const express = require('express');

const crudMethod = require('../src/crud-metho');

const router = new express.Router();

router.get('', (req, res) => {
    res.render('index');
})
router.get('/login.hbs', (req, res) => {
    res.render('login');
})
router.get('/userData', crudMethod.showData);
 

router.get('/register.hbs', (req, res) => {
    res.render('register');
})


router.post('/update/:id', crudMethod.updateUser)
router.post('/updatedForm',crudMethod.updated);

router.post('/addData', crudMethod.addNewUser);
router.post('/delete/:id', crudMethod.deleteUser);

router.post("/welcome", crudMethod.welcome);


module.exports = router;