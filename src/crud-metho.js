const express = require('express');
const user = require('./models/user.js');

// const alert = require('alert');
const app = express();
// const swal= require ('sweetAlert');




const addNewUser = async (req, res) => {
    try {
        const result = await user.insertMany([{ ...req.body }])
        
        res.render('register');
    } catch (error) {
        console.log(error);
    }
}


const showData = async (req, res) => {
    try {
        const userData = await user.find({}).lean()
        // console.log(userData);
        res.render('userData',{userData});
    } catch (error) {
        console.log(error);
    }
}

const deleteUser = async (req, res) => {
    try {
        const _id = req.params.id;
        
        const deletedUser = await user.findByIdAndDelete({ _id })
        const userData = await user.find({}).lean()
        res.render('userData',{userData});
    } catch (error) {
        console.log(error);
    }
}

const updateUser = async (req, res) => {
    try {
        const _id = req.params.id;
        res.render('form', { _id });
        // const updatedUser=await user.findByIdAndUpdate({_id},{$set:{name:uname,
        //     emai: email
        // }
        // })
        
        // const userData = await user.find({}).lean()
        // res.render('userData', { userData });
    } catch (error) {
        console.log(error);
    }
}

const updated = async (req, res) => {
    try {
        const id = req.body.id;
        const _name = req.body.name;
        const _email = req.body.emai;
       
        var newvalues = { $set: {name: _name, emai: _email } };
        // console.log(id + name + email);
        await user.updateOne({ id }, newvalues, (err, res) => {
            if (err) throw err;
            console.log("document updated");
        }).clone();
        const userData = await user.find({}).lean()
        console.log(userData);
        res.render('userData',{userData});
       
    } catch (error) {
        console.log(error);
    }
}

const welcome = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    var BreakException = {};
    
    const userData = await user.find({ emai: email, password: password }).lean()
    console.log(userData);
    if (userData.length===0) {
        alert("Invalid Password and user name ")
    }
        
    else if(userData[0].emai == email & userData[0].password == password)
    {
        var name = userData[0].name;
        //  await alert("you are successfuly loged In ");
      
       
        res.render('afterLogin', { name });
    } 
    
}



module.exports = {
    addNewUser,
    showData,
    deleteUser,
    updateUser,
    updated,
    welcome
}