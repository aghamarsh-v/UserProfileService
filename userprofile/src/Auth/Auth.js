const User = require("../model/User")
const Utils = require("./Utils")
const bcrypt = require("bcryptjs")
const moment = require('moment');

// user registration API

// user registration is in the format. All fields are required
// {
//     userInfo: {
//         name: 'full name',
//         email: 'abcd@gmail.com',
//         password: 'qwerty', //  64 bit encoded, password should be a min of 8 characters
//         username: 'my_user_name'
//     }
// }

exports.register = async (req, res, next) => {
    const {userInfo} = req.body;
    const fullName = userInfo.name;
    const email = userInfo.email;
    const username = userInfo.username;
    let password = atob(userInfo.password);

    if (!password || password.length < 8) {
        return res.status(400).json({ message: "Password less than 8 characters" });
    }

    try {
        const hash = await bcrypt.hash(password, 10);
        password = null;

        const user = await User.create({
            username,
            password: hash,
            name: fullName,
            email
        });

        res.status(200).json({
            status: true,
            message: "User successfully created",
            user: {
                username: user.username,
                email: user.email
            }
        });
    } catch (err) {
        res.status(401).json({
            status: false,
            message: "User creation failed",
            error: err.message
        });
    }
}

// user login API

// user login input format
// {
//     username: 'my_username',
//     password: 'qwerty', //  64 bit encoded
// }

exports.login = async (req, res, next) => {
    const username = req.body.username;
    const password = atob(req.body.password);
    
    if (!username || !password) {
        return res.status(400).json({
            status: false,
            message: "Username or password not present"
        })
    }

    try {
        const user = await User.findOne({username});

        // user not found
        if (!user) {
            res.status(401).json({
                status: false,
                message: "user not found"
            });
        } else {
            const result = await bcrypt.compare(password, user.password);
            if (result) {
                const token = Utils.generateJWT({username: user.username});
                const refreshExpiry = moment().utc().add(3, 'days').endOf('day').format('X')
                const refreshtoken = Utils.generateJWT({ exp: parseInt(refreshExpiry), data: user.username })

                delete user.password;

                res.status(200).json({
                    status: true,
                    message: "Login successful",
                    user,
                    token,
                    refresh: refreshtoken
                });
            } else {
                res.status(401).json({
                    status: false,
                    message: "Password entered is invalid",
                });
            }
        }
    } catch (error) {
        res.status(400).json({
            status: false,
            message: "An unknown error occurred",
            error: error.message
        });
    }
}