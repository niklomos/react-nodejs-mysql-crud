const express = require('express')
const cors = require('cors')
const path = require('path')
const db = require("./config/db");
const myRouter = require('./routes/myRouter')
const accountRouter = require('./routes/accountRouter')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const app = express()



app.set('views', path.join(__dirname, 'server', 'views'))
app.set('view engine','ejs')
// app.use(cors())
app.use(cors({
    origin: 'http://localhost:5173', // React client URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true // Allow cookies to be sent with requests
}));

app.use(express.json())
app.use(express.urlencoded({ extended: true })); // สำหรับ x-www-form-urlencoded

//session And cookie
app.use(cookieParser())
app.use(session({
    secret: 'mySession',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // สำหรับการทดสอบบน HTTP (localhost)
        // maxAge:1000 * 60 * 60 * 24
        httpOnly: true,
    }
}));

// ตั้งค่า session ให้สามารถเข้าถึงได้ในทุก view
app.use((req, res, next) => {
    res.locals.session = req.session.username;
    next();
});

// Use routers
app.use(myRouter); // Prefix all routes in myRouter with /my
app.use('/account', accountRouter); // Prefix all routes in accountRouter with /account


// Serve static files from the uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.listen(3001, () => {
    console.log("Listening on port 3001")
})

