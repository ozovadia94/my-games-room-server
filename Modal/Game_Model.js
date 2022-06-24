const mongoose = require("mongoose")

const GameSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true] 
    },
    win: {
        type: Number,
        required: [true]
    },
    loose:{
        type: Number,
        required: [true]
    }


})

const Game = mongoose.model('Game', GameSchema);

module.exports = Game;