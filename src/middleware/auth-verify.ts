import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token =
        req.body.token || req.query.token || req.headers["x-api-key"];

    if (!token) {
        return res.status(403).json("A token is required for authentication");
    }
    try {
        req.user = jwt.verify(token, 'secret');
    } catch (err) {
        if (err.hasOwnProperty("expiredAt")) {
            return res.status(401).json({
                isExpiredToken: true
            })
        } else {
            if (err['message'] === 'invalid token') {
                return res.status(401).json({
                    isInvalidToken: true
                })
            }
        }
    }
    return next();
};


// {
//     "name": "JsonWebTokenError",
//     "message": "invalid token"
// }

// {
//     "name": "TokenExpiredError",
//     "message": "jwt expired",
//     "expiredAt": "2023-08-08T09:12:25.000Z"
// }