const USER = require("../../models/users");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

async function register(req, res) {
    try {

        const emailCheck = await USER.findOne({ email: req.body.email });

        if (emailCheck) {
            return res.status(409).json({
                success: false,
                message: "User already exist"
            });

        } else {
            if (req.body.password === req.body.confirmpassword) {
                const password = await bcrypt.hash(req.body.password, 10);
                const user = new USER({
                    email: req.body.email,
                    name: req.body.name,
                    password: password,



                })
                const savedUser = await user.save(user);
                //Jsonweb token authorization
                const Json_Token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
                res.status(200).json({
                    success: true,
                    jwt: Json_Token,
                    user: { email: user.email, name: user.name },
                    message: "Registered Successfully"
                })
            } else {
                res.status(409).json({
                    success: false,
                    message: "Password & confirm password didn't matched"
                })
            }
        }
    } catch (err) {
        console.log("error", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

async function login(req, res) {
    try {
        const emailCheck = await USER.findOne({ email: req.body.email });
        const validpass = await bcrypt.compare(req.body.password, emailCheck.password)
        if (!emailCheck && !validpass) {
            return res.status(409).json({
                success: false,
                message: "Invalid login credentials"
            })
        }
        const payload = {
            name: emailCheck.name,
            email: emailCheck.email,
            _id: emailCheck._id
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" })
        console.log("logged in", token)
        return res.status(200).json({
            success: true,
            token: token,
            user: { email: emailCheck.email, name: emailCheck.name, _id: emailCheck._id },
            message: "LogIn Successfully"
        })
    } catch (err) {
        console.log("error", err)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

async function protected(req, res) {
    

    let token = req.headers.authorization;
    console.log(token)
    if (!token) {
        return res.status(409).json({
            message: "",
            header: req.headers,
        });
    } else {
        // token = token.replace("Bearer ", "");
        try {
            const verfied = jwt.verify(token, process.env.JWT_SECRET);
            const data  = verfied;
            // console.log(data);
            res.status(200).json({
                user:{
                    name:data.name,
                    email:data.email,
                    _id:data._id,
                    
                },
                token:token,
                message:"Token Verified Successfully"
            })
        } catch (err) {
            res
                .status(401)
                .json({ message: "Error", err: err, header: token });
        }
    }
}

module.exports = { register, login, protected }