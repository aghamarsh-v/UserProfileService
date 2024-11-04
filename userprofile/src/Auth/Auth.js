const User = require("../model/User")
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken');
const jwtSecret = "e43e987fcaf4d7032da084803e2238c55b7cf56ead34b6b5f290cc2574c03487333614";

// user registration API
exports.register = async (req, res, next) => {
    const {userInfo} = req.body;
    const loginInfo = atob(userInfo);
    const strArr = loginInfo.split(':');
    const username = strArr[0];
    const password = strArr[1];

    if (!password || password.length < 8) {
        return res.status(400).json({ message: "Password less than 8 characters" });
    }

    try {
        const hash = await bcrypt.hash(password, 10);
        await User.create({
            username,
            password: hash
        }).then(user => {
            const maxAge = 3 * 60 * 60;
            const token = jwt.sign(
                { id: user._id, username, role: user.role },
                jwtSecret,
                { expiresIn: maxAge}
            );

            res.cookie("jwt", token, {
                httpOnly: true,
                maxAge: maxAge * 1000
            });
    
            res.status(200).json({
                status: true,
                message: "User successfully created",
                user: {
                    username: user.username,
                    selectedLanguage: user.selectedLanguage
                }
            });
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
exports.login = async (req, res, next) => {
    const {userInfo} = req.body;
    const loginInfo = atob(userInfo);
    const strArr = loginInfo.split(':');
    const username = strArr[0];
    const password = strArr[1];

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
                const maxAge = 3 * 60 * 60;
                const token = jwt.sign(
                    { id: user._id, username, role: user.role},
                    jwtSecret,
                    { expiresIn: maxAge }
                );

                res.cookie("jwt", token, {
                    httpOnly: true,
                    maxAge: maxAge * 1000
                });

                res.status(200).json({
                    status: true,
                    message: "Login successful",
                    user: {
                        username: user.username,
                        selectedLanguage: user.selectedLanguage
                    }
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