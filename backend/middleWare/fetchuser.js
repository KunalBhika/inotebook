const jwt = require('jsonwebtoken');
const JWT_SECRET = 'KunalBhika1#';

const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    
    if(!token) {
        return res.status(401).json('Access Denied! Please try to login using correct token');
    }

    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.userId = data.userId;
        next();
    } catch (error) {
        res.send(error);
    }
}

module.exports = fetchUser;