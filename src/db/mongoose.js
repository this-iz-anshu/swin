const mongoose = require('mongoose');


const url='mongodb://127.0.0.1:27017/customer'
mongoose.connect(url, { useNewUrlParser: true }).then(() => {
    console.log("connection successful");
}).catch((err) => {
    console.log(err);
})


