"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("./routes/user/user"));
const auth_1 = __importDefault(require("./middleware/auth"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/user", user_1.default);
app.get("/welcome", auth_1.default, (req, res) => {
    res.status(200).send("Witam witam");
});
app.listen(3000, () => {
    console.log("Server started");
});
