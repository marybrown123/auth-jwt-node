import { Response, Request, NextFunction } from 'express';
import { UserResponse } from '../routes/user/user.models';
const jwt = require("jsonwebtoken");
const config = process.env;

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.body.token || req.query.token || req.headers["x-access-token"];

    if(!token) {
        return res.status(403).send("A token is required for authentication");
    }
    try {
        jwt.verify(token, config.TOKEN_KEY);
    } catch (err) {
        return res.status(401).send("Invalid token");
    }
    return next();
}

export default verifyToken;
