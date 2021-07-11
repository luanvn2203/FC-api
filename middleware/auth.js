const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) return res.sendStatus(401)
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.userEmail = decoded.email
        req.signInAccount = decoded
        next()
    } catch (error) {
        if (error.message === 'invalid token') {
            return res.status(403).json({
                errors: error.message
            })
        }
        if (error.message === 'jwt expired') {
            return res.status(403).json({
                errors: error.message
            })
        }
        console.log("ahihihii")
        console.log(error)
    }
}

module.exports = verifyToken;