"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = __importDefault(require("../../prisma"));
const user_models_1 = require("./user.models");
const router = express_1.default.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body;
    if (!(user.email && user.password && user.firstName && user.lastName)) {
        res.status(400).send("All input is required");
    }
    const oldUser = yield prisma_1.default.user.findFirst({
        where: {
            email: user.email
        }
    });
    if (oldUser) {
        return res.status(409).send("User already exists. Please login");
    }
    const encryptedPassword = yield bcrypt.hash(user.password, 10);
    const newUser = yield prisma_1.default.user.create({
        data: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email.toLocaleLowerCase(),
            password: encryptedPassword,
        }
    });
    const token = jwt.sign({ user_id: newUser.id, email: String }, process.env.TOKEN_KEY, {
        expiresIn: "2h",
    });
    res.status(200).json(new user_models_1.UserResponse(newUser, token));
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body;
    if (!(user.email && user.password)) {
        return res.status(400).send("All input is required");
    }
    const oldUser = yield prisma_1.default.user.findFirst({
        where: {
            email: user.email
        }
    });
    if (!oldUser) {
        return res.status(404).send("User does not exist");
    }
    const passwordMatches = yield bcrypt.compare(user.password, oldUser.password);
    if (!passwordMatches) {
        return res.status(400).send("Invalid credentials");
    }
    const token = jwt.sign({ user_id: oldUser.id, email: String }, process.env.TOKEN_KEY, {
        expiresIn: "2h"
    });
    res.status(200).json(new user_models_1.UserResponse(oldUser, token));
}));
exports.default = router;
