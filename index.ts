import express, { Request, Response } from "express";
import routerUser from "./routes/user/user"
import auth from "./middleware/auth";

const app = express();
app.use(express.json());
app.use("/user", routerUser)
app.get("/welcome", auth, (req: Request, res: Response) => {
    res.status(200).send("Witam witam");
})
app.listen(3000, () => {
    console.log("Server started");
});