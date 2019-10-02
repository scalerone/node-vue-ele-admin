const express = require("express");
const mongoose = require('mongoose');

const app = express();

// DB config
const db = require('./config/key').mongoURI;

// connect to mongodb
mongoose.connect(
        db,
        { useNewUrlParser: true }
    )
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

app.get("/",(req,res)=>{
    res.send("hello world");
})
const port = process.env.PORT || 5001;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});