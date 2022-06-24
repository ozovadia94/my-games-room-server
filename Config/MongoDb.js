const mongoose = require('mongoose')

const connect = ()=>{
    const dbURI = process.env.MONGODB

    return mongoose.connect(dbURI,{ useNewUrlParser: true, useUnifiedTopology: true})
}

module.exports=connect;