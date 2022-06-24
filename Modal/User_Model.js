const mongoose = require('mongoose'),
    validator = require('validator'),
    bcrypt = require('bcryptjs'),
    crypto = require('crypto');


const UserSchema = new mongoose.Schema({
    _id: {
        type: String,
        trim: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please enter a valid email']

    },
    // userName: {
    //     type: String,
    //     required: [true, 'Please enter a username'],
    //     unique: [true, 'Please enter a unique username'],
    //     trim: true,
    //     lowercase: true,
    //     minlength: [3,'Minimum password length is 3 characters'],
    //     maxlength: [16,'Maximum password length is 16 characters'],
    // },
    password: {
        type: String,
        required: [true, 'Password required'],
        validate(val) {
            if (!validator.isStrongPassword(val))
                throw new Error('Please enter a Strong Password')
        }
    },
    gameList: [
        {
            game: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'game'
            }
        }
    ],
    last_seen: {
        type: Date,
        default: () => Date.now(),
    }


})

UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

// UserSchema.post('save', (u,next)=>{
//     console.log(`new user was created & saved ${u}`);
//     next();
// })

UserSchema.statics.login = async function (email, password) {
    try {
        const user = await this.findById(email)
        if (user) {
            return await bcrypt.compare(password, user.password);
            // return this.methods.checkPassword(password,user.password)
            // bcrypt.compare(password,user.password)
        }
    }
    catch {
        console.log('login problem')
    }

    return false;
}

// UserSchema.methods.checkPassword = async function (inputPassword, rightPassword) {
//     return await bcrypt.compare(inputPassword, rightPassword);
// }

UserSchema.methods.createResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
}

const User = mongoose.model('User', UserSchema);

module.exports = User;