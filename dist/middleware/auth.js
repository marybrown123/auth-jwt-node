"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const config = process.env;
const verifyToken = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    try {
        jwt.verify(token, config.TOKEN_KEY);
    }
    catch (err) {
        return res.status(401).send("Invalid token");
    }
    return next();
};
exports.default = verifyToken;
