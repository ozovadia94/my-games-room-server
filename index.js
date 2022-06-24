require("dotenv").config();
const express = require('express')

const User = require('./Modal/User_Model'),
    connect = require('./Config/MongoDb'),
    authRoutes = require('./routes/authRoutes'),
    cors = require('cors'),
    cookieParser=require('cookie-parser')


const app = express()
const port = process.env.PORT || 8080;

//MiddleWare
app.use(express.static('public'))
app.use(express.json());
app.use(cookieParser())
app.use(cors());



// view enging
app.set('view engine','ejs')
// app.set('view engine','html')

//routes
app.get('/',(req,res)=>{
    res.send('home')
})
app.use(authRoutes);

app.get('/set',(req,res)=>{
    // res.setHeader('Set-Cookie','newU=true')
    res.cookie('is',false)
    res.send('Yougot it')
})

app.get('/get',(req,res)=>{
    
})

app.use((req,res)=>res.status(404).render('404',{title: '404'}));

connect().then((r)=>{
    app.listen(port, () => {
        console.log(`server in listening on port ${port}  &  MongoDB`)
    })
}).catch((e)=>console.log(e))








// .then(()=>{
//     console.log('Connected to the DB')
// }).catch((e)=>{console.log(e)})

// app.listen(port, () => {
//     console.log(`server in listening on port ${port}`)
// })

