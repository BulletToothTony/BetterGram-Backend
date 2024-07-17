const jwt = require("jsonwebtoken");
// const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
    if (req.method === "OPTIONS") {
        return next()
    }

    console.log(req.headers.authorization)

    try {
        console.log(req.headers.authorization, 'req headers token')
        const token = req.headers.authorization.split(" ")[1]; // Authorization: 'Bearer TOKEN
        if (!token) {
            throw new Error("Authentication failed!")
        }
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        req.userData = {userId: decodedToken.userId, email: decodedToken.email, username: decodedToken.username}
        next()
    } catch(err) {
        // const error = new HttpError("Authentication failed!!", 403)
        // console.log(error, 'error')
        // return next(error)
        const error = new Error("Authentication failed!")
        console.log(error, 'error')
        return next(error)
    }
}