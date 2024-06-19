const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authController = {
    // Generate Access Token
    generateAccessToken(user) {
        const accessToken = jwt.sign(
            {
                uid: user.id,
                user_name: user.user_name,
                admin: user.admin,
            },
            process.env.JWT_ACCESS_KEY,
            {
                expiresIn: 60 * 30, // 30 minute
            }
        );
        return accessToken;
    },
    // POST localhost:[port]/api/user/login
    async login(req, res) {
        try {
            const user = await User.findOne({ user_name: req.body.user_name });
            if (!user) {
                return res.status(404).json("Wrong username!");
            }
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if (!validPassword) {
                return res.status(404).json("Wrong password!");
            }
            if (user && validPassword) {
                const accessToken = authController.generateAccessToken(user);
                
                res.status(200).json({ uid });
            }
        } catch (err) {
            res.status(500).json(err);
        }
    },

}