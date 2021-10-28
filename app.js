const express = require('express');
const app = express();

// database
const {db, Product} = require('./db');


const session = require('express-session');
app.use(session({
    secret: 'kalHumVahaanHonge',
    resave: false,
    saveUninitialized: true
}))


// imp middlewares
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use("/", express.static(__dirname + '/public'));

// app.set('view engine', 'ejs');




//syncing db
const port = process.env.PORT || 3000;
db.sync()
    .then(()=>{
        app.listen(port, ()=>{
            console.log("Server started successfully at http://localhost:3000 ");
        })
})
