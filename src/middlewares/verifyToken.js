var jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.BC_SECRET;

const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!req.headers.authorization) {
            res.status(500).json({ message: 'Ko có Token!!' });
        }
        const userID = jwt.verify(token.split(' ')[1], secret);
        req.user = userID;
        next();
    } catch (err) {
        res.status(401).json({
            name: err.name,
            message: err.message
        })
    }
}

const verifyTokenEmail = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const code = req.body.code
        if (!token) {
            res.status(500).json({ message: 'Ko có Token!!' });
        }
        const email = jwt.verify(token.split(' ')[1], secret);
        req.user = { email, code }
        next();
    } catch (err) {
        res.status(401).json({
            name: err.name,
            message: err.message
        })
    }
}

const verifyRegister = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            res.status(500).json({ message: 'Ko có Token!!' });
        }
        const email = jwt.verify(token.split(' ')[1], secret);
        req.user = email;
        next();
    } catch (err) {
        res.status(401).json({
            name: err.name,
            message: err.message
        })
    }
}


module.exports = { verifyToken, verifyTokenEmail, verifyRegister }