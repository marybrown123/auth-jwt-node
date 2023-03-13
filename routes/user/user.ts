import express, { Request, Response } from "express";
import prisma from "../../prisma";
import { UserRegistrationDto, UserResponse, UserLoginDto } from "./user.models"

const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post("/register", async (req: Request, res: Response) => {
    const user: UserRegistrationDto = req.body;
    if(!(user.email && user.password && user.firstName && user.lastName)) {
        res.status(400).send("All input is required");
    }

    const oldUser = await prisma.user.findFirst({
        where: {
            email: user.email
        }
    })
    if(oldUser) {
        return res.status(409).send("User already exists. Please login");
    }

    const encryptedPassword = await bcrypt.hash(user.password, 10)

    const newUser = await prisma.user.create({
        data: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email.toLocaleLowerCase(),
            password: encryptedPassword,
        }
    })

    const token = jwt.sign(
        { user_id: newUser.id, email: String },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      res.status(200).json(new UserResponse(newUser, token))
})

router.post("/login", async (req: Request, res: Response) => {
    const user: UserLoginDto = req.body;

    if(!(user.email && user.password)) {
        return res.status(400).send("All input is required");
    }

    const oldUser = await prisma.user.findFirst({
        where: {
            email: user.email
        }
    })

    if(!oldUser) {
        return res.status(404).send("User does not exist")
    }

    const passwordMatches = await bcrypt.compare(user.password, oldUser.password)

    if(!passwordMatches) {
        return res.status(400).send("Invalid credentials")
    }

    const token = jwt.sign(
        { user_id:oldUser.id, email: String },
        process.env.TOKEN_KEY,
        {
            expiresIn:"2h"
        }
    );
    res.status(200).json(new UserResponse(oldUser, token));
    
})

export default router;