const User = require('../Modal/User_Model');
const jwt = require('jsonwebtoken')
const maxAge = 24 * 60 * 60
// const maxAge = 30

const handleErrors = (err) => {
    let errors = {
        "email": "",
        "password": ""
    }

    if (err.code == 11000) {
        const dupField = Object.keys(err.keyValue)[0];
        console.log(err.keyValue)
        const message = `'${err.keyValue[dupField]}' exist .Please use another email or recover your password!`;
        return { message: message, field: dupField }
    }

    if (err.message.includes('User validation failed')) {

        // console.log(Object.values(err.errors))
        Object.values(err.errors).forEach(({ properties }) => {
            if (properties.path == '_id')
                errors['email'] = properties.message;
            else
                errors[properties.path] = properties.message;
        })
    }
    return errors;
}

const create_token = (email) => {
    return jwt.sign({ "email": email }, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: maxAge },"mySecretKey")
}

module.exports.signup_get = (req, res) => {
    res.render('signup')
}
module.exports.login_get = (req, res) => {
    res.render('login')
}

module.exports.signup_post = async (req, res) => {
    const { email, password } = req.body
    console.log('d: ', req.body)

    const u = new User({
        _id: email, password: password
    })

    try {
        const user = await u.save()
        res.status(201).send("Registration completed successfully");
    }
    catch (e) {
        const errors = handleErrors(e)
        console.log('as')
        console.log(errors)
        res.status(400).json({ errors })
    }
}

module.exports.login_post = async (req, res) => {

    const { email, password } = req.body
    if (!email || !password) {
        console.log(email, password)
        res.status(400).send({ "message": "Missing fields" })
        return null;
    }

    const u = await User.login(email, password)
    console.log(u)
    if (u) {
        const accessToken = create_token(email)
        // res.cookie('jwt', accessToken)
        res.json({ email, accessToken })
    }
    else
        res.status(401).send("Unauthorized");

    // // var u = await User.findById(email)
    // if (u) {
    //     const accessToken = create_token(email)
    //     res.cookie('jwt', accessToken)
    //     res.json({ email, accessToken })
    //     // res.status(200).send("succed!");
    // }
    // else
    //     res.status(401).send("Unauthorized");

    console.log(`login~  email:${email}  password:${password}`)
}


module.exports.check_auth = async (req, res, next) => {
    const authHeader = req.authorization
    console.log(authHeader)
    if(authHeader){
        const token = authHeader.split(" ")[1]

        jwt.verify(token,"mySecretKey",(err,user)=>{
            if(err)
                return res.status(401).json("Token is not valid!");
            
            req.user = user;
            next();
        })
        console.log(token)
    }
    else{
        res.status(401).json("you are not authenticated")
    }

    
    
    // console.log("asdasd")
    // const token = req.cookies.jwt
    // if (token) {
    //     jwt.verify(token, 'sd', (err, decodedToken) => {
    //         if (err) {
    //             console.log(err.message)
    //         }
    //         else {
    //             next()
    //         }
    //     })
    // }
    // else {
    //     res.status(403)
    // }

    res.status(200).send()

    console.log(`check auth`)
}

module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.send('logout successful!');
}